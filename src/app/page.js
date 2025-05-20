import dayjs from "dayjs";
import Link from "next/link";
import { getPosts, formatDateForUrl, getUrlSafeSlug } from "@/lib/db";
import { trackSearch } from "@/lib/analytics";
import PostCard from "./components/PostCard";
import Pagination from "./components/Pagination";
import GlobalLayout from "./components/GlobalLayout";

// Modify ISR cache strategy, use a shorter cache time
// Originally set to 1 week (604800), now changed to 30 minutes for more frequent data refresh
export const revalidate = 1800; // 30 minutes (60 * 30 seconds)

export default async function HomePage({ searchParams }) {
  // Get the current page from URL query parameters, default to page 1
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const pageSize = 10; // Posts per page

  // Load all available posts from the database
  const allPosts = await getPosts(500); // Load more posts to ensure we have enough for pagination

  // Calculate pagination
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);

  // Get posts for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const postsToDisplay = allPosts.slice(startIndex, startIndex + pageSize);

  return (
    <GlobalLayout>
      <section className="hero">
        <h1>Insights and Analysis</h1>
        <p className="subtitle">
          Thoughtful perspectives on global affairs, business trends, and
          emerging technologies.
        </p>
      </section>

      <section className="post-list">
        {postsToDisplay.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

        {/* Pagination component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/"
        />
      </section>
    </GlobalLayout>
  );
}
