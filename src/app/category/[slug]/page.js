import { Suspense } from "react";
import { getPosts } from "@/lib/db";
import Link from "next/link";
import PostCard from "@/app/components/PostCard";
import ClientAdPlaceholder from "@/app/components/ClientAdPlaceholder";
import { getTagTextById } from "@/lib/tags";
import GlobalLayout from "@/app/components/GlobalLayout";
import Pagination from "@/app/components/Pagination";

// Predefined categories
const categories = {
  "politics-diplomacy": {
    name: "Politics & Diplomacy",
    description:
      "In-depth analysis of domestic politics and international diplomatic relations",
  },
  "business-economy": {
    name: "Business & Economy",
    description:
      "Curated content on business trends, economic analysis, and market dynamics",
  },
  "tech-innovation": {
    name: "Technology & Innovation",
    description:
      "Exploring the latest technology trends, innovation developments, and digital transformation",
  },
  "international-relations": {
    name: "International Relations",
    description:
      "Focus on global geopolitics, international organizations, and transnational cooperation",
  },
  "culture-society": {
    name: "Culture & Society",
    description:
      "Fascinating content on social phenomena, cultural changes, and humanistic thinking",
  },
};

// Modify ISR cache time from 1 week to 20 minutes
// Use a shorter cache time to get new data more frequently
export const revalidate = 1200; // 20 minutes

// Filter articles by category tag
async function getCategoryPosts(slug) {
  // Get all articles
  const allPosts = await getPosts(500);

  // If category doesn't exist, return empty array
  if (!categories[slug]) {
    return [];
  }

  // Convert category slug to category name for matching
  const categoryName = categories[slug].name;
  const keywordsByCategory = {
    "politics-diplomacy": [
      "politics",
      "diplomacy",
      "government",
      "election",
      "policy",
    ],
    "business-economy": [
      "economy",
      "business",
      "finance",
      "market",
      "trade",
      "enterprise",
    ],
    "tech-innovation": [
      "technology",
      "innovation",
      "tech",
      "digital",
      "AI",
      "artificial intelligence",
    ],
    "international-relations": [
      "international",
      "global",
      "diplomacy",
      "geopolitics",
    ],
    "culture-society": ["culture", "society", "art", "education", "lifestyle"],
  };

  const keywords = keywordsByCategory[slug] || [];

  // Filter articles that contain relevant tags or keywords
  const filteredPosts = allPosts.filter((post) => {
    // Check article tags
    if (post.tagIds && post.tagIds.length > 0) {
      for (const tagId of post.tagIds) {
        const tagText = getTagTextById(tagId);

        // Check if tag text contains category name
        if (tagText.includes(categoryName)) return true;

        // Check if tag text contains related keywords
        for (const keyword of keywords) {
          if (tagText.toLowerCase().includes(keyword.toLowerCase()))
            return true;
        }
      }
    }

    // Check if title contains category name or keywords
    if (post.title) {
      if (post.title.includes(categoryName)) return true;

      for (const keyword of keywords) {
        if (post.title.toLowerCase().includes(keyword.toLowerCase()))
          return true;
      }
    }

    return false;
  });

  return filteredPosts;
}

// Pre-generate possible static parameters, which helps Next.js optimize routes
export async function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({
    slug,
  }));
}

// Generate metadata for each page
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;
  const category = categories[categorySlug] || { name: "Unknown Category" };

  return {
    title: `${category.name} - Blog Category`,
    description: category.description || "View all articles in this category",
  };
}

// Page component
export default async function CategoryPage({ params, searchParams }) {
  // Safely get parameters in Next.js App Router mode
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedParams.slug;

  // Get the current page from URL query parameters, default to page 1
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const pageSize = 10; // Posts per page

  // Get articles for this category
  const allCategoryPosts = await getCategoryPosts(categorySlug);

  // Calculate pagination
  const totalPosts = allCategoryPosts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);

  // Get posts for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const posts = allCategoryPosts.slice(startIndex, startIndex + pageSize);

  // Get category information
  const category = categories[categorySlug] || {
    name: "Unknown Category",
    description: "Information for this category could not be found",
  };

  return (
    <GlobalLayout>
      <section className="hero">
        <h1>{category.name}</h1>
        <p className="subtitle">{category.description}</p>
      </section>

      <section className="post-list">
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {/* Pagination component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/category/${categorySlug}`}
            />
          </>
        ) : (
          <div className="no-posts">
            <p>No articles found in this category.</p>
            <Link href="/" className="back-link">
              Return to Home
            </Link>
          </div>
        )}
      </section>
    </GlobalLayout>
  );
}
