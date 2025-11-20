import { MongoClient } from "mongodb";

// Helper to get MongoDB URI with validation
function getMongoUri() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }
  return process.env.MONGODB_URI;
}

const uri = process.env.MONGODB_URI || '';
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the connection
  // across hot reloads
  let globalWithMongo = global;

  if (!globalWithMongo._mongoClientPromise && uri) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, create a new connection
  if (!clientPromise && uri) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Export a module-scoped MongoClient promise
export default clientPromise;

