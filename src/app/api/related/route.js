import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// 从环境变量获取MongoDB连接字符串
const uri = process.env.MONGO_REMOTE_URL;

export async function GET(request) {
  // 解析请求URL，获取查询参数
  const { searchParams } = new URL(request.url);
  const tagsParam = searchParams.get("tags");
  const excludeId = searchParams.get("exclude");

  // 如果没有传入标签参数，返回空数组
  if (!tagsParam) {
    return NextResponse.json([]);
  }

  // 解析标签参数
  const tags = tagsParam.split(",");

  let client;
  try {
    // 连接到MongoDB
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB for related posts API");

    const collection = client.db().collection("posts");

    // 创建查询条件：包含任一相同标签，但排除当前文章
    const query = {
      tags: { $in: tags },
    };

    // 如果提供了要排除的文章ID，添加到查询条件
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    // 执行查询，按照标签匹配数量和创建时间降序排序
    const relatedPosts = await collection
      .aggregate([
        { $match: query },
        // 计算匹配标签的数量
        {
          $addFields: {
            matchCount: {
              $size: {
                $setIntersection: ["$tags", tags],
              },
            },
          },
        },
        // 按匹配数量降序，创建时间降序排序
        { $sort: { matchCount: -1, createdAt: -1 } },
        // 限制结果
        { $limit: 5 },
        // 投影需要的字段
        {
          $project: {
            _id: 1,
            title: 1,
            slug: 1,
            summary: 1,
            createdAt: 1,
            tags: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(relatedPosts);
  } catch (error) {
    console.error("相关文章API错误:", error);
    return NextResponse.json(
      { error: "获取相关文章时出现错误" },
      { status: 500 }
    );
  } finally {
    // 关闭MongoDB连接
    if (client) {
      await client.close();
      console.log("MongoDB connection closed for related posts API");
    }
  }
}
