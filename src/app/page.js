import dayjs from "dayjs";
import Link from "next/link";
import { getPosts, formatDateForUrl, getUrlSafeSlug } from "@/lib/db";
import { trackSearch } from "@/lib/analytics";
import PostCard from "./components/PostCard";
import Pagination from "./components/Pagination";
import GlobalLayout from "./components/GlobalLayout";
import { AdManager } from "./components/AdManager";
import styles from "./page.module.css";

// Modify ISR cache strategy, use a shorter cache time
// Originally set to 1 week (604800), now changed to 30 minutes for more frequent data refresh
export const revalidate = 1800; // 30 minutes (60 * 30 seconds)

// Add homepage SEO metadata
export const metadata = {
  title: "Business Analysis, Tech Insights & Global Affairs | Insights Blog",
  description:
    "Discover expert analysis on AI technology, sustainable business practices, emerging markets, and investment strategies. Stay ahead with our in-depth insights on global economic trends and digital transformation.",
  keywords:
    "business analysis, AI technology, sustainable development, investment strategies, market trends, global economics, tech innovation, emerging markets",
  openGraph: {
    title: "Business Analysis, Tech Insights & Global Affairs | Insights Blog",
    description:
      "Discover expert analysis on AI technology, sustainable business practices, emerging markets, and investment strategies.",
    type: "website",
  },
};

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

  // Calculate ad insertion point for posts
  const midPoint = Math.floor(postsToDisplay.length / 2);

  return (
    <GlobalLayout>
      <section className="hero">
        <h1>Expert Business Analysis & Technology Insights</h1>
        <p className="subtitle">
          Discover cutting-edge analysis on AI technology, sustainable business
          practices, emerging markets, and investment strategies. Stay ahead of
          global trends with our expert insights and in-depth research.
        </p>
      </section>

      {/* Top Ad - After Hero Section */}
      <section className={styles.adSection}>
        <AdManager
          adType="native"
          position="top"
          size="large"
          className={styles.homepageTopAd}
        />
      </section>

      <section className="post-list">
        {postsToDisplay.map((post, index) => (
          <div key={post._id}>
            <PostCard post={post} />

            {/* Mid-content Ad - Insert after middle post */}
            {index === midPoint && postsToDisplay.length > 4 && (
              <div className={styles.adSectionInline}>
                <AdManager
                  adType="native"
                  position="middle"
                  size="medium"
                  className={styles.homepageMidAd}
                />
              </div>
            )}
          </div>
        ))}

        {/* Post-content Ad - After article list */}
        <div className={styles.adSection}>
          <AdManager
            adType="native"
            position="bottom"
            size="large"
            className={styles.homepageBottomAd}
          />
        </div>

        {/* Pagination component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/"
        />

        {/* Footer Ad - After pagination */}
        <div className={styles.adSection}>
          <AdManager
            adType="native"
            position="footer"
            size="medium"
            className={styles.homepageFooterAd}
          />
        </div>
      </section>
    </GlobalLayout>
  );
}
