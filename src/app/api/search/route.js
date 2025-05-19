import { NextResponse } from "next/server";

// 安全地导入MongoDB
let MongoClient;
if (typeof window === "undefined") {
  try {
    const mongodb = require("mongodb");
    MongoClient = mongodb.MongoClient;
  } catch (error) {
    console.error("无法导入MongoDB模块:", error);
  }
}

// 从环境变量获取MongoDB连接字符串，确保只在服务器端获取
const uri = typeof window === "undefined" ? process.env.MONGODB_URI : null;

export async function GET(request) {
  // 解析请求URL，获取查询参数
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // 如果没有查询字符串，返回空数组
  if (!query || query.trim() === "") {
    return NextResponse.json([]);
  }

  // 检查是否可以使用MongoDB客户端
  if (!MongoClient || !uri) {
    console.error("MongoDB客户端不可用");
    return NextResponse.json({ error: "搜索服务暂时不可用" }, { status: 500 });
  }

  // 创建一个新的客户端实例
  const client = new MongoClient(uri);

  try {
    // 连接到MongoDB
    await client.connect();
    const database = client.db("blog");
    const collection = database.collection("posts");

    // 创建搜索条件：标题、内容、标签或摘要中包含查询字符串
    const searchRegex = new RegExp(query, "i"); // 不区分大小写
    const searchCondition = {
      $or: [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { summary: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } },
      ],
    };

    // 执行搜索
    const results = await collection
      .find(searchCondition)
      .sort({ createdAt: -1 }) // 按创建日期降序排序
      .limit(20) // 限制结果数量
      .toArray();

    return NextResponse.json(results);
  } catch (error) {
    console.error("搜索API错误:", error);
    return NextResponse.json({ error: "搜索时出现错误" }, { status: 500 });
  } finally {
    // 关闭MongoDB连接
    if (client) {
      try {
        await client.close();
      } catch (error) {
        console.error("关闭MongoDB连接时出错:", error);
      }
    }
  }
}
