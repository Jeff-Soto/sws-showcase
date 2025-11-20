import { getDemosFromDB } from "@/lib/projects";

let cachedDemos = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

/**
 * Get demos from database with caching
 * This function can be called from server components
 */
export async function getDemos() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedDemos && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedDemos;
  }

  try {
    const demos = await getDemosFromDB();
    cachedDemos = demos;
    cacheTimestamp = now;
    return demos;
  } catch (error) {
    console.error("Error in getDemos:", error);
    // Fallback to cached data if available, otherwise empty array
    return cachedDemos || [];
  }
}

// Export empty array for backward compatibility with client components
// Client components should use the API route instead
export const demos = [];

export const stackBadges = [
  { label: "Next.js 15", accent: "core" },
  { label: "MUI 7", accent: "ux" },
  { label: "Recharts", accent: "data" },
  { label: "OpenAI Platform", accent: "ai" },
  { label: "Node 24", accent: "ops" },
];

