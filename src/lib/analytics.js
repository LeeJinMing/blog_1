import { track } from "@vercel/analytics";

/**
 * 跟踪文章阅读事件
 * @param {Object} post - 文章对象
 */
export function trackPostView(post) {
  if (!post || !post._id) return;

  // 使用Vercel Analytics跟踪
  track("post_view", {
    postId: typeof post._id === "object" ? post._id.toString() : post._id,
    title: post.title,
    slug: post.slug,
    category: post.tags?.[0] || "uncategorized",
  });

  // 同时使用Google Analytics跟踪
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
 * 跟踪外部链接点击
 * @param {string} url - 外部链接
 * @param {string} text - 链接文本
 */
export function trackExternalLinkClick(url, text) {
  // 使用Vercel Analytics
  track("external_link_click", {
    url,
    text,
    location: typeof window !== "undefined" ? window.location.pathname : "",
  });

  // 使用Google Analytics
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
 * 跟踪标签点击
 * @param {string} tagId - 标签ID
 * @param {string} tagText - 标签文本
 */
export function trackTagClick(tagId, tagText) {
  // 使用Vercel Analytics
  track("tag_click", {
    tagId,
    tagText,
    location: typeof window !== "undefined" ? window.location.pathname : "",
  });

  // 使用Google Analytics
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "tag_click", {
      event_category: "engagement",
      event_label: tagText,
      tag_id: tagId,
    });
  }
}

/**
 * 跟踪搜索操作
 * @param {string} query - 搜索关键词
 * @param {number} resultsCount - 结果数量
 */
export function trackSearch(query, resultsCount) {
  // 使用Vercel Analytics
  track("search", {
    query,
    resultsCount,
  });

  // 使用Google Analytics
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "search", {
      search_term: query,
      // GA4特定参数
      search_results_count: resultsCount,
    });
  }
}

/**
 * 博客分析工具函数集
 * 用于跟踪用户行为、页面浏览、搜索和点击等活动
 */

// 跟踪页面浏览
export function trackPageView(url) {
  if (typeof window === "undefined") return;

  try {
    // 检查是否配置了Google Analytics
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

// 跟踪搜索查询
export function trackSearchQuery(query, resultCount) {
  if (typeof window === "undefined") return;

  try {
    // 清理和标准化查询
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

// 跟踪社交分享
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

// 跟踪点击事件
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

// 内部工具函数: 发送分析数据到API
function sendToAnalyticsAPI(eventType, data) {
  // 仅在生产环境发送真实数据
  if (process.env.NODE_ENV !== "production") {
    console.log("Development environment analytics data:", {
      eventType,
      ...data,
    });
    return;
  }

  // 这里可以实现向自定义分析API发送数据的逻辑
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ eventType, ...data, timestamp: new Date().toISOString() })
  // });
}
