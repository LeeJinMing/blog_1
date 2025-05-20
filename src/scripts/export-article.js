// 导出文章数据到文件系统
const fs = require("fs").promises;
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

// 数据库连接信息
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "blog";

// 获取文章数据
async function getPostBySlug(slug) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("posts");

    // 查找文章
    const post = await collection.findOne({ slug });
    return post;
  } finally {
    await client.close();
  }
}

// 导出指定文章到文件
async function exportArticle(slug) {
  try {
    console.log(`正在导出文章: ${slug}`);

    // 获取文章数据
    const article = await getPostBySlug(slug);

    if (!article) {
      console.error(`找不到文章: ${slug}`);
      return;
    }

    // 整理数据结构
    const data = {
      id: article._id.toString(),
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      conclusion: article.conclusion,
      tags: article.tagIds || [],
      links: article.links || [],
      createdAt: article.createdAt,
    };

    // 输出文件路径
    const outputPath = path.join(process.cwd(), "data", "temp", `${slug}.json`);

    // 写入文件
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf-8");

    console.log(`文章已导出到: ${outputPath}`);

    // 检查字段是否存在
    console.log("文章数据结构检查:");
    console.log(`标题: ${data.title ? "✅" : "❌"}`);
    console.log(`摘要: ${data.summary ? "✅" : "❌"}`);
    console.log(`内容: ${data.content ? "✅" : "❌"}`);
    console.log(`结论: ${data.conclusion ? "✅" : "❌"}`);
    console.log(
      `标签: ${Array.isArray(data.tags) && data.tags.length > 0 ? "✅" : "❌"}`
    );
    console.log(
      `链接: ${
        Array.isArray(data.links) && data.links.length > 0 ? "✅" : "❌"
      }`
    );
  } catch (error) {
    console.error("导出文章时出错:", error);
  }
}

// 要导出的文章slug
const articleSlug = "billie-eilish-live-music-fair-ticketing";

// 执行导出
exportArticle(articleSlug);
