/**
 * 标签迁移脚本
 * 用于将MongoDB数据库中的文章标签从文本格式迁移到ID格式
 *
 * 使用方法: node migrateTagsToIds.js
 * 注意：在执行此脚本前，请确保已备份数据库
 */

const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "../../.env.local" });

// 从标签库导入工具函数
const { convertTagTextsToIds } = require("../lib/tags");

// 数据库连接信息
const MONGODB_URI = process.env.MONGO_REMOTE_URL;
const DB_NAME = process.env.MONGO_DB_NAME || "blog";
const COLLECTION_NAME = "posts";

async function main() {
  console.log("开始标签迁移...");

  let client;
  try {
    // 连接到MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("成功连接到数据库");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // 获取所有没有tagIds字段的文章
    const posts = await collection
      .find({
        tags: { $exists: true, $ne: [] },
        $or: [{ tagIds: { $exists: false } }, { tagIds: { $eq: [] } }],
      })
      .toArray();

    console.log(`找到 ${posts.length} 篇需要迁移的文章`);

    // 逐个处理文章
    let migratedCount = 0;
    for (const post of posts) {
      if (!post.tags || post.tags.length === 0) {
        continue;
      }

      // 转换标签
      const tagIds = convertTagTextsToIds(post.tags);

      // 更新数据库
      const result = await collection.updateOne(
        { _id: post._id },
        { $set: { tagIds: tagIds } }
      );

      if (result.modifiedCount > 0) {
        migratedCount++;
        console.log(`已迁移文章: ${post.title} (${post._id})`);
        console.log(`  - 标签: ${post.tags.join(", ")}`);
        console.log(`  - 标签ID: ${tagIds.join(", ")}`);
      }
    }

    console.log(`迁移完成! 共成功处理 ${migratedCount} 篇文章`);
  } catch (error) {
    console.error("迁移过程中出现错误:", error);
  } finally {
    if (client) {
      await client.close();
      console.log("数据库连接已关闭");
    }
  }
}

// 执行主函数
main().catch(console.error);
