import { track } from "@vercel/analytics";

/**
 * 跟踪文章阅读事件
 * @param {Object} post - 文章对象
 */
export function trackPostView(post) {
  if (!post || !post._id) return;

  track("post_view", {
    postId: typeof post._id === "object" ? post._id.toString() : post._id,
    title: post.title,
    slug: post.slug,
    category: post.tags?.[0] || "uncategorized",
  });
}

/**
 * 跟踪外部链接点击
 * @param {string} url - 外部链接
 * @param {string} text - 链接文本
 */
export function trackExternalLinkClick(url, text) {
  track("external_link_click", {
    url,
    text,
    location: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

/**
 * 跟踪标签点击
 * @param {string} tagId - 标签ID
 * @param {string} tagText - 标签文本
 */
export function trackTagClick(tagId, tagText) {
  track("tag_click", {
    tagId,
    tagText,
    location: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

/**
 * 跟踪搜索操作
 * @param {string} query - 搜索关键词
 * @param {number} resultsCount - 结果数量
 */
export function trackSearch(query, resultsCount) {
  track("search", {
    query,
    resultsCount,
  });
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
      });
    }

    // 这里可以添加其他分析平台的跟踪代码
    console.log(`页面浏览: ${url}`);

    // 可选: 发送到自定义分析端点
    // sendToAnalyticsAPI('pageview', { url });
  } catch (err) {
    console.error("跟踪页面浏览失败:", err);
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
        results_count: resultCount,
      });
    }

    console.log(`搜索查询: "${cleanQuery}" (结果: ${resultCount})`);

    // 可选: 发送到自定义分析端点
    // sendToAnalyticsAPI('search', { query: cleanQuery, resultCount });
  } catch (err) {
    console.error("跟踪搜索失败:", err);
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
        content_title: contentTitle,
      });
    }

    console.log(`内容分享: "${contentTitle}" 到 ${platform}`);

    // 可选: 发送到自定义分析端点
    // sendToAnalyticsAPI('share', { platform, contentTitle });
  } catch (err) {
    console.error("跟踪分享失败:", err);
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

    console.log(`点击: ${elementId} (${category}: ${label})`);

    // 可选: 发送到自定义分析端点
    // sendToAnalyticsAPI('click', { elementId, category, label });
  } catch (err) {
    console.error("跟踪点击失败:", err);
  }
}

// 内部工具函数: 发送分析数据到API
function sendToAnalyticsAPI(eventType, data) {
  // 仅在生产环境发送真实数据
  if (process.env.NODE_ENV !== "production") {
    console.log("开发环境分析数据:", { eventType, ...data });
    return;
  }

  // 这里可以实现向自定义分析API发送数据的逻辑
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ eventType, ...data, timestamp: new Date().toISOString() })
  // });
}
