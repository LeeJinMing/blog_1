/**
 * Google Indexing API 集成
 * 用于文章发布后立即通知Google进行索引
 */

import { google } from "googleapis";

// Google Indexing API 配置
const GOOGLE_INDEXING_CONFIG = {
  // 需要从 Google Cloud Console 获取服务账号密钥
  serviceAccount: process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
    : null,
  scopes: ["https://www.googleapis.com/auth/indexing"],
};

/**
 * 初始化 Google Indexing API 客户端
 */
async function getIndexingClient() {
  if (!GOOGLE_INDEXING_CONFIG.serviceAccount) {
    throw new Error("Google Service Account 配置缺失");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: GOOGLE_INDEXING_CONFIG.serviceAccount,
    scopes: GOOGLE_INDEXING_CONFIG.scopes,
  });

  return google.indexing({
    version: "v3",
    auth,
  });
}

/**
 * 通知 Google 索引单个 URL
 * @param {string} url - 要索引的完整URL
 * @param {string} type - 操作类型 ('URL_UPDATED' 或 'URL_DELETED')
 * @returns {Promise<Object>} API 响应
 */
export async function notifyGoogleIndex(url, type = "URL_UPDATED") {
  try {
    console.log(`🔍 开始通知Google索引: ${url}`);

    const indexing = await getIndexingClient();

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type,
      },
    });

    console.log(`✅ Google索引通知成功: ${url}`, response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ Google索引通知失败: ${url}`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 批量通知 Google 索引多个 URL
 * @param {Array<string>} urls - 要索引的URL数组
 * @param {string} type - 操作类型
 * @returns {Promise<Array>} 所有请求的结果
 */
export async function notifyGoogleIndexBatch(urls, type = "URL_UPDATED") {
  console.log(`🔍 开始批量通知Google索引: ${urls.length} 个URL`);

  const results = [];

  // 限制并发请求数量，避免超出API限制
  const BATCH_SIZE = 5;
  const DELAY_BETWEEN_BATCHES = 1000; // 1秒延迟

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);

    const batchPromises = batch.map(async (url) => {
      try {
        const result = await notifyGoogleIndex(url, type);
        return { url, ...result };
      } catch (error) {
        return { url, success: false, error: error.message };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // 如果还有更多批次，添加延迟
    if (i + BATCH_SIZE < urls.length) {
      await new Promise((resolve) =>
        setTimeout(resolve, DELAY_BETWEEN_BATCHES)
      );
    }
  }

  const successCount = results.filter((r) => r.success).length;
  console.log(`✅ 批量索引通知完成: ${successCount}/${urls.length} 成功`);

  return results;
}

/**
 * 通知文章发布（包含文章和相关页面）
 * @param {Object} post - 文章对象
 * @returns {Promise<Object>} 通知结果
 */
export async function notifyPostPublished(post) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";

  // 构建文章URL
  const { formatDateForUrl, getUrlSafeSlug } = await import("./db");
  const dateStr = formatDateForUrl(post.createdAt);
  const urlSafeSlug = getUrlSafeSlug(post.slug);
  const postUrl = `${baseUrl}/posts/${dateStr}/${urlSafeSlug}`;

  // 需要通知的URL列表
  const urlsToNotify = [
    postUrl, // 文章页面
    `${baseUrl}/`, // 主页（可能显示最新文章）
    `${baseUrl}/archives`, // 归档页面
  ];

  // 如果文章有分类，也通知分类页面
  if (post.categoryId) {
    const { getCategorySlugById } = await import("./db");
    const categorySlug = getCategorySlugById(post.categoryId);
    if (categorySlug) {
      urlsToNotify.push(`${baseUrl}/category/${categorySlug}`);
    }
  }

  console.log(`📝 文章发布，通知Google索引: "${post.title}"`);

  const results = await notifyGoogleIndexBatch(urlsToNotify);

  return {
    post: {
      title: post.title,
      url: postUrl,
    },
    notificationResults: results,
    summary: {
      total: results.length,
      success: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    },
  };
}

/**
 * 获取 Google Indexing API 状态
 * @param {string} url - 要检查的URL
 * @returns {Promise<Object>} 索引状态信息
 */
export async function getIndexingStatus(url) {
  try {
    const indexing = await getIndexingClient();

    const response = await indexing.urlNotifications.getMetadata({
      url: url,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error(`获取索引状态失败: ${url}`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 验证 Google Indexing API 配置
 * @returns {Promise<boolean>} 配置是否有效
 */
export async function validateIndexingConfig() {
  try {
    if (!GOOGLE_INDEXING_CONFIG.serviceAccount) {
      console.warn("⚠️ Google Service Account 未配置");
      return false;
    }

    // 尝试初始化客户端
    await getIndexingClient();
    console.log("✅ Google Indexing API 配置有效");
    return true;
  } catch (error) {
    console.error("❌ Google Indexing API 配置无效:", error.message);
    return false;
  }
}

// 导出配置验证函数，用于启动时检查
export { validateIndexingConfig as default };
