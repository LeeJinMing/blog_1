"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

// Format date for URL format
function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

// URL safe slug processing
function getUrlSafeSlug(slug) {
  if (!slug) return "";

  try {
    let safeSlug = slug;
    safeSlug = safeSlug.replace(/[^\w-]/g, (char) => {
      return encodeURIComponent(char);
    });
    return safeSlug;
  } catch (e) {
    console.error("Error normalizing slug:", e);
    return slug;
  }
}

/**
 * Related Posts Component - Shows recommendations based on current article tags
 * @param {Object} currentPost - Current article
 * @param {Array} currentPost.tagIds - Current article's tag ID array
 * @param {string} currentPost._id - Current article ID, used to exclude itself
 */
export default function RelatedPosts({ currentPost }) {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false); // Used to track if a request has already been initiated

  useEffect(() => {
    async function fetchRelatedPosts() {
      if (
        !currentPost ||
        !currentPost.tagIds ||
        currentPost.tagIds.length === 0 ||
        fetchedRef.current
      ) {
        setRelatedPosts([]);
        setLoading(false);
        return;
      }

      fetchedRef.current = true; // Mark that a request has been initiated

      try {
        // Get articles with the same tags
        const tagIds = encodeURIComponent(currentPost.tagIds.join(","));
        const response = await fetch(
          `/api/related?tags=${tagIds}&exclude=${currentPost._id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch related posts");
        }

        const data = await response.json();
        setRelatedPosts(data.slice(0, 3)); // Show at most 3 related articles
      } catch (error) {
        console.error("Error fetching related posts:", error);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedPosts();
  }, [currentPost]);

  // If there are no related posts, don't render
  if (!loading && relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="related-posts-container">
      <h3 className="related-posts-title">Related Articles</h3>

      {loading ? (
        <div className="related-posts-loading">
          <p>Loading related articles...</p>
        </div>
      ) : (
        <div className="related-posts-grid">
          {relatedPosts.map((post) => {
            const yyyymmdd = formatDateToYYYYMMDD(post.createdAt);
            const safeSlug = getUrlSafeSlug(post.slug);
            const postUrl = `/posts/${yyyymmdd}/${safeSlug}`;
            const formattedDate = dayjs(post.createdAt).format("MMM D, YYYY");

            return (
              <div key={post._id} className="related-post-card">
                <Link href={postUrl}>
                  <h4>{post.title}</h4>
                </Link>
                <div className="related-post-meta">
                  <time dateTime={dayjs(post.createdAt).format("YYYY-MM-DD")}>
                    {formattedDate}
                  </time>
                </div>
                <p className="related-post-excerpt">
                  {post.summary
                    ? post.summary.length > 120
                      ? `${post.summary.slice(0, 120)}...`
                      : post.summary
                    : "No summary available."}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
