import { track } from "@vercel/analytics";

/**
 * Track article reading events
 * @param {Object} post - Article object
 */
export function trackPostView(post) {
  if (!post || !post._id) return;

  // Use Vercel Analytics for tracking
  track("post_view", {
    postId: typeof post._id === "object" ? post._id.toString() : post._id,
    title: post.title,
    slug: post.slug,
    category: post.tags?.[0] || "uncategorized",
  });

  // Also use Google Analytics for tracking
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "post_view", {
      event_category: "content",
      event_label: post.title,
      post_id: typeof post._id === "object" ? post._id.toString() : post._id,
      post_slug: post.slug,
    });
  }
}

/**
 * Track external link clicks
 * @param {string} url - External link
 * @param {string} text - Link text
 */
export function trackExternalLinkClick(url, text) {
  // Use Vercel Analytics
  track("external_link_click", {
    url,
    text,
    location: typeof window !== "undefined" ? window.location.pathname : "",
  });

  // Use Google Analytics
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "click", {
      event_category: "outbound",
      event_label: text || url,
      transport_type: "beacon",
      outbound_url: url,
    });
  }
}

/**
 * Track tag clicks
 * @param {string} tagId - Tag ID
 * @param {string} tagText - Tag text
 */
export function trackTagClick(tagId, tagText) {
  // Use Vercel Analytics
  track("tag_click", {
    tagId,
    tagText,
    location: typeof window !== "undefined" ? window.location.pathname : "",
  });

  // Use Google Analytics
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "tag_click", {
      event_category: "engagement",
      event_label: tagText,
      tag_id: tagId,
    });
  }
}

/**
 * Track search operations
 * @param {string} query - Search keyword
 * @param {number} resultsCount - Result count
 */
export function trackSearch(query, resultsCount) {
  // Use Vercel Analytics
  track("search", {
    query,
    resultsCount,
  });

  // Use Google Analytics
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "search", {
      search_term: query,
      // GA4 specific parameter
      search_results_count: resultsCount,
    });
  }
}

/**
 * Blog analytics utility functions
 * Used to track user behavior, page views, searches, and clicks
 */

// Track page views
export function trackPageView(url) {
  if (typeof window === "undefined") return;

  try {
    // Check if Google Analytics is configured
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    console.log(`Page view: ${url}`);
  } catch (err) {
    console.error("Failed to track page view:", err);
  }
}

// Track search queries
export function trackSearchQuery(query, resultCount) {
  if (typeof window === "undefined") return;

  try {
    // Clean and standardize query
    const cleanQuery = (query || "").trim();
    if (!cleanQuery) return;

    if (typeof window.gtag === "function") {
      window.gtag("event", "search", {
        search_term: cleanQuery,
        search_results_count: resultCount,
      });
    }

    console.log(`Search query: "${cleanQuery}" (Results: ${resultCount})`);
  } catch (err) {
    console.error("Failed to track search:", err);
  }
}

// Track social sharing
export function trackShare(platform, contentTitle) {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "share", {
        method: platform,
        content_type: "article",
        item_id: window.location.pathname,
        content_title: contentTitle,
      });
    }

    console.log(`Content shared: "${contentTitle}" to ${platform}`);
  } catch (err) {
    console.error("Failed to track share:", err);
  }
}

// Track click events
export function trackClick(elementId, category, label) {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "click", {
        event_category: category,
        event_label: label,
        element_id: elementId,
      });
    }

    console.log(`Click: ${elementId} (${category}: ${label})`);
  } catch (err) {
    console.error("Failed to track click:", err);
  }
}

// Internal utility function: Send analytics data to API
function sendToAnalyticsAPI(eventType, data) {
  // Only send real data in production environment
  if (process.env.NODE_ENV !== "production") {
    console.log("Development environment analytics data:", {
      eventType,
      ...data,
    });
    return;
  }

  // Here you can implement the logic to send data to a custom analytics API
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ eventType, ...data, timestamp: new Date().toISOString() })
  // });
}
