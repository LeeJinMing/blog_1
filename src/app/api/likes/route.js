import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * API端点用于获取文章点赞数
 * GET /api/likes?id=postId - 获取特定文章的点赞数
 * GET /api/likes - 获取所有文章的点赞数
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    // 获取点赞数据存储路径
    const likesFile = path.join(process.cwd(), "data", "likes.json");

    // 如果文件不存在，返回空数据
    if (!fs.existsSync(likesFile)) {
      return NextResponse.json(
        postId ? { id: postId, likes: 0 } : { likes: {} }
      );
    }

    // 读取点赞数据
    const fileContent = fs.readFileSync(likesFile, "utf8");
    let likesData = {};

    try {
      likesData = JSON.parse(fileContent);
    } catch (e) {
      console.error("Error parsing likes data:", e);
      return NextResponse.json(
        { error: "Failed to parse likes data" },
        { status: 500 }
      );
    }

    // 如果请求特定文章的点赞数
    if (postId) {
      const postLikes = likesData[postId] ? likesData[postId].count : 0;
      return NextResponse.json({
        id: postId,
        likes: postLikes,
      });
    }

    // 返回所有文章的点赞数
    return NextResponse.json({ likes: likesData });
  } catch (error) {
    console.error("Error getting like count:", error);
    return NextResponse.json(
      { error: "Failed to get like count" },
      { status: 500 }
    );
  }
}
