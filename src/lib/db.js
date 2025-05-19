/**
 * db.js - 简化的数据库交互模块
 * 使用全局缓存机制，减少数据库访问
 */

// 检查是否在服务器端环境
const isServer = typeof window === "undefined";

// MongoDB客户端和ObjectId - 仅在服务器端导入
let MongoClient;
let ObjectId;

if (isServer) {
  try {
    const mongodb = require("mongodb");
    MongoClient = mongodb.MongoClient;
    ObjectId = mongodb.ObjectId;
  } catch (error) {
    console.log("MongoDB模块导入失败，将使用模拟数据");
  }
}

// MongoDB连接URI - 只在服务器端获取
const MONGODB_URI = isServer ? process.env.MONGO_REMOTE_URL : null;

// 全局缓存 - 存储所有博客文章
let blogCache = {
  posts: [],
  lastUpdated: 0,
  isLoading: false,
};

// 缓存有效期 - 1小时
const CACHE_TTL = 60 * 60 * 1000;

import { convertTagTextsToIds, convertTagIdsToTexts } from "./tags";
import { migratePostsToTagIds } from "./migration";

/**
 * 获取MongoDB客户端连接
 */
async function getMongoClient() {
  if (!isServer) return null;

  try {
    // 使用简单的连接配置，不使用已弃用的选项
    const client = await MongoClient.connect(MONGODB_URI);
    return client;
  } catch (error) {
    console.error("数据库连接失败:", error);
    return null;
  }
}

/**
 * 加载所有文章到全局缓存
 * 如果缓存较新，直接返回缓存的文章
 */
async function loadAllPosts() {
  // 如果已经在加载中，等待加载完成
  if (blogCache.isLoading) {
    // 简单延迟并再次检查
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (blogCache.posts.length > 0) {
      return blogCache.posts;
    }
  }

  // 缓存仍然有效，直接返回
  if (
    Date.now() - blogCache.lastUpdated < CACHE_TTL &&
    blogCache.posts.length > 0
  ) {
    return blogCache.posts;
  }

  // 标记为加载中，防止并发请求
  blogCache.isLoading = true;

  try {
    const client = await getMongoClient();
    if (!client) {
      blogCache.isLoading = false;
      return getMockPosts(50); // 使用模拟数据
    }

    const db = client.db();

    // 一次性获取所有文章（或限制数量）
    const posts = await db
      .collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .limit(500) // 限制数量，避免内存问题
      .toArray();

    // 关闭连接
    client.close();

    // 序列化文档
    let serializedPosts = posts.map(serializeDocument);

    // 迁移标签
    serializedPosts = migratePostsToTagIds(serializedPosts);

    // 更新缓存
    blogCache.posts = serializedPosts;
    blogCache.lastUpdated = Date.now();

    console.log(`已加载 ${blogCache.posts.length} 篇文章到缓存`);
  } catch (error) {
    console.error("加载文章到缓存失败:", error);
    // 错误时返回模拟数据
    if (blogCache.posts.length === 0) {
      blogCache.posts = getMockPosts(50);
    }
  } finally {
    blogCache.isLoading = false;
  }

  return blogCache.posts;
}

/**
 * 获取多篇文章
 * @param {number} limit - 限制返回的文章数量
 * @param {Object} query - 查询条件（仅用于过滤缓存）
 */
export async function getPosts(limit = 10, query = {}) {
  await loadAllPosts();

  let filteredPosts = blogCache.posts;

  // 如果有标签查询，进行过滤
  if (query.tags) {
    const tagIds = Array.isArray(query.tags) ? query.tags : [query.tags];
    filteredPosts = filteredPosts.filter(
      (post) => post.tagIds && post.tagIds.some((id) => tagIds.includes(id))
    );
  }

  // 返回限制数量的文章
  return filteredPosts.slice(0, limit);
}

/**
 * 根据slug获取单篇文章
 */
export async function getPostBySlug(slug) {
  if (!slug) return null;

  await loadAllPosts();

  // 尝试查找精确匹配
  let post = blogCache.posts.find((p) => p.slug === slug);

  // 如果没找到，尝试URL解码后再查找
  if (!post && slug !== decodeURIComponent(slug)) {
    const decodedSlug = decodeURIComponent(slug);
    post = blogCache.posts.find((p) => p.slug === decodedSlug);
  }

  return post || null;
}

/**
 * 获取相关文章
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
      // 计算匹配标签数量
      const aMatchCount = a.tagIds
        ? a.tagIds.filter((id) => tagIds.includes(id)).length
        : 0;
      const bMatchCount = b.tagIds
        ? b.tagIds.filter((id) => tagIds.includes(id)).length
        : 0;

      // 优先按匹配标签数量排序
      if (aMatchCount !== bMatchCount) {
        return bMatchCount - aMatchCount;
      }

      // 然后按创建时间排序
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, limit);
}

/**
 * 序列化MongoDB文档，处理ObjectId等特殊类型
 */
function serializeDocument(doc) {
  if (!doc) return null;

  const serialized = { ...doc };

  // 转换ObjectId为字符串
  if (doc._id) {
    serialized._id = doc._id.toString();
  }

  // 转换日期
  if (doc.createdAt instanceof Date) {
    serialized.createdAt = doc.createdAt.toISOString();
  }

  return serialized;
}

/**
 * 格式化日期为URL友好的格式
 */
export function formatDateForUrl(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * 确保slug对URL友好
 */
export function getUrlSafeSlug(slug) {
  if (!slug) return "";

  try {
    return slug.replace(/[^\w-]/g, (char) => encodeURIComponent(char));
  } catch (e) {
    console.error("Slug编码失败:", e);
    return slug;
  }
}

// ========== 模拟数据 ==========

/**
 * 获取模拟文章数据
 */
function getMockPosts(limit = 10) {
  // 转换原来的标签文本为标签ID
  const mockPosts = [
    {
      _id: "mock1",
      title: "人工智能如何改变我们的未来",
      slug: "how-ai-will-change-our-future",
      summary: "探索AI技术对各行各业的深远影响",
      content:
        "# 人工智能如何改变我们的未来\n\n人工智能技术正在以前所未有的速度发展...",
      tagIds: convertTagTextsToIds(["科技", "AI", "未来趋势"]),
      tags: ["科技", "AI", "未来趋势"], // 保留原始标签文本以兼容旧代码
      createdAt: new Date("2023-08-01").toISOString(),
    },
    // 其他模拟文章...
  ];

  return mockPosts.slice(0, limit);
}

// 导出默认对象
export default {
  getPosts,
  getPostBySlug,
  getRelatedPosts,
  formatDateForUrl,
  getUrlSafeSlug,
};
