// 只在服务器端导入MongoDB
let MongoClient;
let ObjectId;

// 检查是否在服务器端环境
if (typeof window === "undefined") {
  try {
    const mongodb = require("mongodb");
    MongoClient = mongodb.MongoClient;
    ObjectId = mongodb.ObjectId;
  } catch (error) {
    console.error("无法导入MongoDB模块:", error);
  }
}

// MongoDB连接URI - 只在服务器端获取
const uri = typeof window === "undefined" ? process.env.MONGO_REMOTE_URL : null;

// 全局连接实例 - 用于连接池
let client = null;
let clientPromise = null;

/**
 * 获取MongoDB客户端连接
 * 这采用了单例模式，确保整个应用只建立一个数据库连接池
 * @returns {Promise<MongoClient>} MongoDB客户端连接
 */
export async function getMongoClient() {
  // 客户端环境直接返回null
  if (typeof window !== "undefined" || !MongoClient) {
    console.log("客户端环境不支持MongoDB连接");
    return null;
  }

  // 开发环境下，每次重新连接以避免热重载问题
  if (process.env.NODE_ENV === "development") {
    if (!client) {
      client = new MongoClient(uri, {
        maxPoolSize: 10, // 连接池大小
        minPoolSize: 1, // 最小保持连接数
        connectTimeoutMS: 5000, // 连接超时
      });
      clientPromise = client
        .connect()
        .then((client) => {
          console.log("Connected to MongoDB with new connection pool");
          return client;
        })
        .catch((err) => {
          console.error("Failed to connect to MongoDB:", err);
          client = null;
          clientPromise = null;
          throw err;
        });
    }
    return clientPromise;
  }

  // 生产环境下使用持久连接
  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 20, // 生产环境使用更大的连接池
      minPoolSize: 5, // 最小保持5个连接
      connectTimeoutMS: 5000,
    });
    clientPromise = client
      .connect()
      .then((client) => {
        console.log("Connected to MongoDB with persistent connection pool");
        // 确保在应用关闭时关闭连接
        process.on("SIGINT", async () => {
          await client.close();
          console.log("MongoDB connection closed due to app termination");
          process.exit(0);
        });
        return client;
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        client = null;
        clientPromise = null;
        throw err;
      });
  }

  return clientPromise;
}

/**
 * 创建所有必要的数据库索引
 * 应在应用初始化时调用一次
 */
export async function createIndexes() {
  // 客户端环境直接返回
  if (typeof window !== "undefined") {
    return;
  }

  try {
    const client = await getMongoClient();
    if (!client) return;

    const db = client.db();

    // 为posts集合创建索引
    await db.collection("posts").createIndex({ createdAt: -1 }); // 按创建日期倒序
    await db.collection("posts").createIndex({ slug: 1 }); // 按slug查询
    await db.collection("posts").createIndex({ tags: 1 }); // 按标签查询

    // 可以添加其他需要的索引
    console.log("MongoDB indexes created successfully");
  } catch (error) {
    console.error("Failed to create MongoDB indexes:", error);
  }
}

// 安全地创建 ObjectId 实例
export function createObjectId(id) {
  if (typeof window !== "undefined" || !ObjectId) {
    console.warn("客户端环境不支持创建ObjectId");
    return null;
  }
  try {
    return new ObjectId(id);
  } catch (error) {
    console.error("创建ObjectId失败:", error);
    return null;
  }
}

/**
 * 查找多个文档 - 优化版本，不再每次关闭连接
 * @param {string} collection - 集合名称
 * @param {number} limit - 限制返回的文档数量
 * @param {Object} query - 查询条件
 * @param {Object} sort - 排序条件
 * @returns {Promise<Array>} 文档数组
 */
export async function findManyPosts(
  collection,
  limit = 10,
  query = {},
  sort = { createdAt: -1 }
) {
  // 客户端环境直接返回空数组
  if (typeof window !== "undefined") {
    return [];
  }

  try {
    const client = await getMongoClient();
    if (!client) return [];

    const db = client.db();
    const result = await db
      .collection(collection)
      .find(query)
      .sort(sort)
      .limit(limit)
      .toArray();

    console.log(`findManyPosts(${collection}, ${limit}): ${result.length}`);
    return result;
  } catch (error) {
    console.error(`Error in findManyPosts (${collection}):`, error);
    return [];
  }
}

/**
 * 根据ID查找单个文档 - 优化版本
 * @param {string} collection - 集合名称
 * @param {string} id - 文档ID
 * @returns {Promise<Object|null>} 文档对象或null
 */
export async function findOneById(collection, id) {
  // 客户端环境直接返回null
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const client = await getMongoClient();
    if (!client) return null;

    const db = client.db();
    const objectId = createObjectId(id);
    if (!objectId) return null;

    const result = await db.collection(collection).findOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error(`Error in findOneById (${collection}):`, error);
    return null;
  }
}

/**
 * 根据slug查找单个文档 - 优化版本
 * @param {string} collection - 集合名称
 * @param {string} slug - 文档slug
 * @returns {Promise<Object|null>} 文档对象或null
 */
export async function findOneBySlug(collection, slug) {
  // 客户端环境直接返回null
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const client = await getMongoClient();
    if (!client) return null;

    const db = client.db();

    // 尝试直接匹配
    let result = await db.collection(collection).findOne({ slug });

    // 如果没有找到，尝试正则匹配（不区分大小写）
    if (!result) {
      console.log(
        `No exact match for slug: ${slug}, trying normalized version`
      );
      // 创建一个不区分大小写的正则表达式
      const regex = new RegExp(`^${slug}$`, "i");
      result = await db.collection(collection).findOne({ slug: regex });
    }

    console.log(
      `findOneBySlug(${collection}, ${slug}): ${result ? true : false}`
    );
    return result;
  } catch (error) {
    console.error(`Error in findOneBySlug (${collection}, ${slug}):`, error);
    return null;
  }
}

/**
 * 用于API路由的连接关闭函数
 * 注意：通常不需要调用，因为我们使用连接池，但在API路由中可能需要
 */
export async function closeMongoConnection() {
  // 客户端环境无需操作
  if (typeof window !== "undefined") {
    return;
  }

  if (client) {
    if (process.env.NODE_ENV === "development") {
      await client.close();
      client = null;
      clientPromise = null;
      console.log("MongoDB connection closed");
    }
    // 在生产环境中，我们保持连接池开启
  }
}
