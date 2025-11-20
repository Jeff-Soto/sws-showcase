import clientPromise from "./db";

/**
 * Fetch all projects (demos) from the MongoDB 'projects' collection
 * Maps database structure to match the existing demo structure
 */
export async function getDemosFromDB() {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI not set, cannot fetch from database");
      return [];
    }

    const client = await clientPromise;
    
    // Use 'sws_db' as the database name, matching the main app pattern
    const dbName = 'sws_db';
    const db = client.db(dbName);
    const collection = db.collection("projects");

    // Fetch all projects from the database
    const projects = await collection.find({}).toArray();

    // Map database documents to the expected demo structure
    const mappedDemos = projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      description: project.summary || project.description, // Use summary for card display
      highlights: project.features || [],
      tech: project.techStack || [],
    })).filter((demo) => demo.slug && demo.title); // Filter out any invalid entries

    return mappedDemos;
  } catch (error) {
    console.error("Error fetching demos from database:", error);
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    throw error; // Re-throw so getDemos can handle it
  }
}

