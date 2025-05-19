// Conditionally import revalidatePath based on environment
let revalidatePath;

// 只在服务器端导入和使用 revalidatePath
if (typeof window === "undefined") {
  try {
    // Try to import from next/cache (App Router)
    const nextCache = require("next/cache");
    revalidatePath = nextCache.revalidatePath;
  } catch (error) {
    // Fallback for Pages Router
    revalidatePath = (path) => {
      console.log(
        `Would revalidate path: ${path} (not available in Pages Router)`
      );
      // In Pages Router, we can't revalidate paths directly
      // You could implement alternative caching strategies here
    };
  }
} else {
  // 客户端模拟函数
  revalidatePath = (path) => {
    console.log(`Client side: can't revalidate path: ${path}`);
  };
}

// 使用动态导入以避免在客户端构建时出错
let MongoClient;
let getMongoClient;

// 仅在服务器端导入 MongoDB 相关模块
if (typeof window === "undefined") {
  try {
    const mongodb = require("mongodb");
    MongoClient = mongodb.MongoClient;

    const mongoModule = require("./mongo");
    getMongoClient = mongoModule.getMongoClient;
  } catch (error) {
    console.error("Error importing MongoDB modules:", error);
  }
}

// MongoDB 连接 URI - 仅在服务器端访问
const uri = typeof window === "undefined" ? process.env.MONGO_REMOTE_URL : null;

/**
 * 监听 MongoDB 变更流，当文章集合有更新时自动刷新缓存
 * 该函数应在服务器初始化时调用
 */
export async function startChangeStream() {
  // 在客户端环境，返回 null
  if (typeof window !== "undefined" || !MongoClient) {
    console.log("Change stream not available in client environment");
    return null;
  }

  let changeStreamClient;

  try {
    // 获取专用于变更流的连接
    // 注意：不使用共享连接池，因为变更流需要长期保持连接
    changeStreamClient = new MongoClient(uri, {
      maxPoolSize: 1, // 使用单独的连接
    });

    await changeStreamClient.connect();
    console.log("Change stream listener connected to MongoDB");

    const db = changeStreamClient.db();
    const postsCollection = db.collection("posts");

    // 创建变更流，监听文档的插入、更新和替换操作
    const changeStream = postsCollection.watch(
      [{ $match: { operationType: { $in: ["insert", "update", "replace"] } } }],
      { fullDocument: "updateLookup" }
    );

    // 监听变更事件
    changeStream.on("change", async (change) => {
      try {
        console.log(
          `Detected change in posts collection: ${change.operationType}`
        );

        if (change.operationType === "insert") {
          // 新文章添加，刷新首页
          console.log("New post added, revalidating homepage");
          revalidatePath("/");
          // 刷新分类页面
          revalidatePath("/categories");
          Object.keys(categories).forEach((slug) => {
            revalidatePath(`/category/${slug}`);
          });
        } else if (
          change.operationType === "update" ||
          change.operationType === "replace"
        ) {
          // 文章更新，获取文章信息
          const post = change.fullDocument;

          if (post && post.slug) {
            // 计算文章路径
            const dateStr = formatDateForUrl(post.createdAt);
            const path = `/posts/${dateStr}/${safeSlug(post.slug)}`;

            // 刷新特定文章页面和首页
            console.log(`Revalidating modified post page: ${path}`);
            revalidatePath(path);
            revalidatePath("/");

            // 如果文章有标签，还需要刷新相关分类页面
            if (post.tags && post.tags.length > 0) {
              // 计算哪些分类页面需要刷新
              const categoriesToRefresh = findCategoriesForTags(post.tags);
              for (const category of categoriesToRefresh) {
                console.log(
                  `Revalidating category page: /category/${category}`
                );
                revalidatePath(`/category/${category}`);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error handling change stream event:", error);
      }
    });

    console.log("Change stream initialized and listening for post changes");

    // 处理错误
    changeStream.on("error", (error) => {
      console.error("Change stream error:", error);
      // 尝试重新连接
      setTimeout(startChangeStream, 5000);
    });

    return changeStream;
  } catch (error) {
    console.error("Error starting change stream:", error);
    // 如果出错，尝试关闭客户端连接
    if (changeStreamClient) {
      try {
        await changeStreamClient.close();
      } catch (closeError) {
        console.error("Error closing change stream client:", closeError);
      }
    }

    // 尝试延迟重新连接
    setTimeout(startChangeStream, 10000);
    return null;
  }
}

// 预定义分类映射
const categories = {
  "politics-diplomacy": ["政治", "外交", "政府", "选举", "政策"],
  "business-economy": ["经济", "商业", "金融", "市场", "贸易", "企业"],
  "tech-innovation": ["科技", "创新", "技术", "数字", "AI", "人工智能"],
  "international-relations": ["国际", "全球", "外交", "地缘政治"],
  "culture-society": ["文化", "社会", "艺术", "教育", "生活方式"],
};

/**
 * 根据文章标签判断需要刷新的分类页面
 */
function findCategoriesForTags(tags) {
  const matchedCategories = new Set();

  for (const tag of tags) {
    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (tag.includes(keyword)) {
          matchedCategories.add(category);
          break;
        }
      }
    }
  }

  return Array.from(matchedCategories);
}

/**
 * 将日期格式化为 URL 友好的格式 (YYYYMMDD)
 */
function formatDateForUrl(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * 确保 slug 对 URL 友好
 */
function safeSlug(slug) {
  try {
    return slug.replace(/[^\w-]/g, (char) => encodeURIComponent(char));
  } catch (e) {
    console.error("Error normalizing slug:", e);
    return slug;
  }
}
