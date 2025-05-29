import mongoose from "mongoose";

// 简化全局类型声明
declare global {
  var mongoose: any;
}

// 连接到post-bot-2数据库
const MONGODB_URI =
  process.env.MONGO_REMOTE_URL || "mongodb://localhost:27017/post-bot-2";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGO_REMOTE_URL environment variable inside .env"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "post-bot-2", // 明确指定数据库名称
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("Connected to post-bot-2 database");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Failed to connect to post-bot-2 database:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
