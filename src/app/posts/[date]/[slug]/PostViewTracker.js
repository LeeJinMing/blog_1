"use client";

import { useEffect, useState } from "react";
import { trackPostView } from "../../../../lib/analytics";

/**
 * Component for tracking article view count
 * Uses useEffect hook in client component to track views
 * Sends an API request to increment view count whenever component loads (i.e., user visits article)
 */
export default function PostViewTracker({ postId, slug }) {
  const [hasTracked, setHasTracked] = useState(false);
  const [viewCount, setViewCount] = useState(null);

  useEffect(() => {
    if (!postId || hasTracked) return;

    const sessionKey = `viewed-${postId}`;
    const hasViewedInSession = sessionStorage.getItem(sessionKey);

    if (hasViewedInSession) {
      // Get current article view count but don't increment
      fetchViewCount();
      return;
    }

    // Set a reasonable delay to ensure user is actually reading the article
    const timer = setTimeout(() => {
      incrementViewCount();
    }, 5000); // Consider user is actually reading after 5 seconds

    return () => clearTimeout(timer);
  }, [postId, hasTracked]);

  // Get current view count
  const fetchViewCount = async () => {
    try {
      const response = await fetch(`/api/views?id=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setViewCount(data.views);
      }
    } catch (error) {
      console.error("Failed to fetch view count:", error);
    }
  };

  // Increment view count
  const incrementViewCount = async () => {
    try {
      const response = await fetch("/api/views/increment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, slug }),
      });

      if (response.ok) {
        const data = await response.json();
        setViewCount(data.views);

        // Mark this article as viewed in session
        sessionStorage.setItem(`viewed-${postId}`, "true");
        setHasTracked(true);
      }
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
  };

  return (
    <>
      {/* This is an invisible component, only used for tracking view count */}
      {viewCount !== null && (
        <div className="hidden">{`Article views: ${viewCount}`}</div>
      )}
    </>
  );
}
