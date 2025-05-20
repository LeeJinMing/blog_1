import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * API端点用于递增文章点赞数
 * POST /api/likes/increment
 */
export async function POST(request) {
  try {
    // 解析请求体获取文章ID
    const { postId, slug } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // 获取点赞数据存储路径
    const dataDir = path.join(process.cwd(), "data");
    const likesFile = path.join(dataDir, "likes.json");

    // 确保目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 读取现有点赞数据或创建新的
    let likesData = {};
    if (fs.existsSync(likesFile)) {
      const fileContent = fs.readFileSync(likesFile, "utf8");
      try {
        likesData = JSON.parse(fileContent);
      } catch (e) {
        console.error("Error parsing likes data:", e);
        // 文件可能损坏，使用空对象
        likesData = {};
      }
    }

    // 增加特定文章的点赞数
    if (!likesData[postId]) {
      likesData[postId] = {
        count: 0,
        slug: slug || "",
        lastUpdated: new Date().toISOString(),
      };
    }

    likesData[postId].count += 1;
    likesData[postId].lastUpdated = new Date().toISOString();

    // 将更新后的数据写回文件
    fs.writeFileSync(likesFile, JSON.stringify(likesData, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      likes: likesData[postId].count,
    });
  } catch (error) {
    console.error("Error incrementing like count:", error);
    return NextResponse.json(
      { error: "Failed to increment like count" },
      { status: 500 }
    );
  }
}
