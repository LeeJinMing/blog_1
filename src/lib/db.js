/**
 * db.js - Simplified database interaction module
 * Uses global cache mechanism to reduce database access
 */

// Check if in server-side environment
const isServer = typeof window === "undefined";

// MongoDB client and ObjectId - only import in server-side
let MongoClient;
let ObjectId;
let mongoImport = null;
let cachedClient = null;

if (isServer) {
  try {
    // Try direct import first
    const mongodb = require("mongodb");
    MongoClient = mongodb.MongoClient;
    ObjectId = mongodb.ObjectId;
  } catch (error) {
    console.log("MongoDB module import failed, will use mock data");
    // Will attempt dynamic import later in getMongoClient
  }
}

// MongoDB connection URI - only get on server-side
const MONGODB_URI = isServer ? process.env.MONGODB_URI : null;

// Global cache - store all blog posts
let blogCache = {
  posts: [],
  lastUpdated: 0,
  isLoading: false,
};

// Cache validity period - 1 hour
const CACHE_TTL = 60 * 60 * 1000;

import { convertTagTextsToIds, convertTagIdsToTexts } from "./tags";
import { migratePostsToTagIds } from "./migration";

// If in non-browser environment, try to import MongoDB and connect
if (typeof window === "undefined") {
  try {
    // Dynamically import MongoDB module (allows compiling in browser environment)
    mongoImport = import("mongodb");
  } catch (e) {
    console.log("MongoDB module import failed, will use mock data");
  }
}

/**
 * Get MongoDB client instance
 */
async function getMongoClient() {
  // If we already have MongoClient from direct import, use it
  if (MongoClient) {
    try {
      if (cachedClient) return cachedClient;

      const uri = process.env.MONGODB_URI || process.env.MONGO_REMOTE_URL;

      if (!uri) {
        console.log("MongoDB URI not found in environment variables");
        return null;
      }

      const client = new MongoClient(uri);
      await client.connect();
      cachedClient = client;
      return client;
    } catch (error) {
      console.error("Database connection failed:", error);
      return null;
    }
  }

  // If direct import failed, try dynamic import
  if (!mongoImport) return null;

  try {
    const { MongoClient: DynamicMongoClient } = await mongoImport;
    const uri = process.env.MONGODB_URI || process.env.MONGO_REMOTE_URL;

    if (!uri) {
      console.log("MongoDB URI not found in environment variables");
      return null;
    }

    const client = new DynamicMongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("Database connection failed:", error);
    return null;
  }
}

/**
 * Load all posts to global cache
 * If cache is fresh, return cached posts directly
 */
async function loadAllPosts() {
  // If already loading, wait for completion
  if (blogCache.isLoading) {
    // Simple delay and check again
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (blogCache.posts.length > 0) {
      return blogCache.posts;
    }
  }

  // Cache still valid, return directly
  if (
    Date.now() - blogCache.lastUpdated < CACHE_TTL &&
    blogCache.posts.length > 0
  ) {
    return blogCache.posts;
  }

  // Mark as loading to prevent concurrent requests
  blogCache.isLoading = true;

  try {
    const client = await getMongoClient();
    if (!client) {
      blogCache.isLoading = false;
      return getMockPosts(50); // Use mock data
    }

    const db = client.db();

    // Get all posts at once (or limit quantity)
    const posts = await db
      .collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .limit(500) // Limit quantity to avoid memory issues
      .toArray();

    // Close connection
    client.close();

    // Serialize documents
    let serializedPosts = posts.map(serializeDocument);

    // Migrate tags
    serializedPosts = migratePostsToTagIds(serializedPosts);

    // Update cache
    blogCache.posts = serializedPosts;
    blogCache.lastUpdated = Date.now();

    console.log(`Server loaded ${blogCache.posts.length} articles to cache`);
  } catch (error) {
    console.error("Failed to load articles to cache:", error);
    // Return mock data on error
    if (blogCache.posts.length === 0) {
      blogCache.posts = getMockPosts(50);
    }
  } finally {
    blogCache.isLoading = false;
  }

  return blogCache.posts;
}

/**
 * Get multiple posts
 * @param {number} limit - Limit the number of returned posts
 * @param {Object} query - Query conditions (only for filtering cache)
 */
export async function getPosts(limit = 500, query = {}) {
  await loadAllPosts();

  let filteredPosts = blogCache.posts;

  // If there's a tag query, filter
  if (query.tags) {
    const tagIds = Array.isArray(query.tags) ? query.tags : [query.tags];
    filteredPosts = filteredPosts.filter(
      (post) => post.tagIds && post.tagIds.some((id) => tagIds.includes(id))
    );
  }

  // Return limited number of posts
  return filteredPosts.slice(0, limit);
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug) {
  if (!slug) return null;

  await loadAllPosts();

  // Try to find exact match
  let post = blogCache.posts.find((p) => p.slug === slug);

  // If not found, try URL-decoded version
  if (!post && slug !== decodeURIComponent(slug)) {
    const decodedSlug = decodeURIComponent(slug);
    post = blogCache.posts.find((p) => p.slug === decodedSlug);
  }

  return post || null;
}

/**
 * Get related posts
 */
export async function getRelatedPosts(
  tagIds = [],
  excludeId = null,
  limit = 5
) {
  await loadAllPosts();

  return blogCache.posts
    .filter(
      (post) => !excludeId || post._id.toString() !== excludeId.toString()
    )
    .filter(
      (post) => post.tagIds && post.tagIds.some((id) => tagIds.includes(id))
    )
    .sort((a, b) => {
      // Calculate matching tag count
      const aMatchCount = a.tagIds
        ? a.tagIds.filter((id) => tagIds.includes(id)).length
        : 0;
      const bMatchCount = b.tagIds
        ? b.tagIds.filter((id) => tagIds.includes(id)).length
        : 0;

      // Sort by matching tag count first
      if (aMatchCount !== bMatchCount) {
        return bMatchCount - aMatchCount;
      }

      // Then by creation time
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, limit);
}

/**
 * Serialize MongoDB document, handle ObjectId and other special types
 */
function serializeDocument(doc) {
  if (!doc) return null;

  const serialized = { ...doc };

  // Convert ObjectId to string
  if (doc._id) {
    serialized._id = doc._id.toString();
  }

  // Convert date
  if (doc.createdAt instanceof Date) {
    serialized.createdAt = doc.createdAt.toISOString();
  }

  return serialized;
}

/**
 * Format date to URL-friendly format
 */
export function formatDateForUrl(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Ensure slug is URL-friendly
 */
export function getUrlSafeSlug(slug) {
  if (!slug) return "";

  try {
    return slug.replace(/[^\w-]/g, (char) => encodeURIComponent(char));
  } catch (e) {
    console.error("Slug encoding failed:", e);
    return slug;
  }
}

// ========== Mock Data ==========

/**
 * Get mock post data
 */
function getMockPosts(limit = 10) {
  // Convert original tag text to tag IDs
  const mockPosts = [
    {
      _id: "mock1",
      title: "How AI Will Change Our Future",
      slug: "how-ai-will-change-our-future",
      summary:
        "Exploring the profound impact of AI technology across industries",
      content:
        "# How AI Will Change Our Future\n\nAI technology is developing at an unprecedented pace...",
      tagIds: convertTagTextsToIds(["Technology", "AI", "Future Trends"]),
      tags: ["Technology", "AI", "Future Trends"], // Keep original tag text for backward compatibility
      createdAt: new Date("2023-08-01").toISOString(),
    },
    {
      _id: "mock2",
      title: "Global Economic Trends Analysis: 2023 Second Half Outlook",
      slug: "global-economy-trends-outlook-2023",
      summary:
        "A detailed analysis of global economic trends for the second half of 2023",
      content:
        "# Global Economic Trends Analysis: 2023 Second Half Outlook\n\nThe global economy continues to face significant challenges...",
      tagIds: convertTagTextsToIds(["Economy", "Global", "Finance"]),
      tags: ["Economy", "Global", "Finance"],
      createdAt: new Date("2023-07-15").toISOString(),
    },
    {
      _id: "mock3",
      title: "Sustainable Development in Corporate Strategy",
      slug: "sustainable-development-corporate-strategy",
      summary:
        "How businesses are integrating sustainability into their core strategies",
      content:
        "# Sustainable Development in Corporate Strategy\n\nSustainability has become a central concern for businesses worldwide...",
      tagIds: convertTagTextsToIds(["Business", "Innovation", "Society"]),
      tags: ["Business", "Innovation", "Society"],
      createdAt: new Date("2023-06-20").toISOString(),
    },
    {
      _id: "mock4",
      title: "The Future of Remote Work Post-Pandemic",
      slug: "future-remote-work-post-pandemic",
      summary:
        "Analyzing how work culture has permanently changed after the global pandemic",
      content:
        "# The Future of Remote Work Post-Pandemic\n\nAs the world recovers from the pandemic, many organizations are reevaluating their work models...",
      tagIds: convertTagTextsToIds(["Business", "Society", "Future Trends"]),
      tags: ["Business", "Society", "Future Trends"],
      createdAt: new Date("2023-06-05").toISOString(),
    },
    {
      _id: "mock5",
      title:
        "Advances in Quantum Computing: Current State and Future Prospects",
      slug: "quantum-computing-advances-future",
      summary:
        "A comprehensive look at recent breakthroughs in quantum computing",
      content:
        "# Advances in Quantum Computing: Current State and Future Prospects\n\nQuantum computing has seen remarkable progress in recent years...",
      tagIds: convertTagTextsToIds([
        "Technology",
        "Innovation",
        "Future Trends",
      ]),
      tags: ["Technology", "Innovation", "Future Trends"],
      createdAt: new Date("2023-05-22").toISOString(),
    },
    {
      _id: "mock6",
      title: "Geopolitical Shifts in the Indo-Pacific Region",
      slug: "geopolitical-shifts-indo-pacific",
      summary:
        "Examining changing power dynamics and strategic relationships in the Indo-Pacific",
      content:
        "# Geopolitical Shifts in the Indo-Pacific Region\n\nThe Indo-Pacific region has become a focal point of international relations...",
      tagIds: convertTagTextsToIds([
        "Geopolitics",
        "International",
        "Politics",
      ]),
      tags: ["Geopolitics", "International", "Politics"],
      createdAt: new Date("2023-05-10").toISOString(),
    },
    {
      _id: "mock7",
      title: "The Rise of Digital Currencies and Central Bank Initiatives",
      slug: "digital-currencies-central-bank-initiatives",
      summary:
        "How central banks worldwide are responding to the cryptocurrency revolution",
      content:
        "# The Rise of Digital Currencies and Central Bank Initiatives\n\nAs cryptocurrencies gain mainstream attention, central banks are developing their own digital alternatives...",
      tagIds: convertTagTextsToIds(["Finance", "Digital", "Economy"]),
      tags: ["Finance", "Digital", "Economy"],
      createdAt: new Date("2023-04-28").toISOString(),
    },
    {
      _id: "mock8",
      title: "Climate Change Adaptation Strategies for Urban Areas",
      slug: "climate-change-adaptation-urban-areas",
      summary:
        "Innovative approaches cities are taking to adapt to climate change challenges",
      content:
        "# Climate Change Adaptation Strategies for Urban Areas\n\nUrban areas face unique challenges from climate change that require tailored solutions...",
      tagIds: convertTagTextsToIds(["Society", "Innovation", "Culture"]),
      tags: ["Society", "Innovation", "Culture"],
      createdAt: new Date("2023-04-15").toISOString(),
    },
    {
      _id: "mock9",
      title: "The Evolution of E-commerce in the Post-COVID Era",
      slug: "evolution-ecommerce-post-covid",
      summary:
        "How consumer shopping habits and e-commerce platforms have transformed",
      content:
        "# The Evolution of E-commerce in the Post-COVID Era\n\nThe COVID-19 pandemic accelerated the growth of e-commerce by years...",
      tagIds: convertTagTextsToIds(["Business", "Digital", "Market"]),
      tags: ["Business", "Digital", "Market"],
      createdAt: new Date("2023-03-30").toISOString(),
    },
    {
      _id: "mock10",
      title: "Emerging Technologies in Healthcare Delivery",
      slug: "emerging-technologies-healthcare-delivery",
      summary:
        "How AI, robotics, and telemedicine are revolutionizing healthcare services",
      content:
        "# Emerging Technologies in Healthcare Delivery\n\nThe healthcare industry is undergoing a technological transformation...",
      tagIds: convertTagTextsToIds(["Technology", "Innovation", "AI"]),
      tags: ["Technology", "Innovation", "AI"],
      createdAt: new Date("2023-03-15").toISOString(),
    },
  ];

  return mockPosts.slice(0, limit);
}

// Export default object
export default {
  getPosts,
  getPostBySlug,
  getRelatedPosts,
  formatDateForUrl,
  getUrlSafeSlug,
};
