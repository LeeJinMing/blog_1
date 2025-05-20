import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * API端点用于获取文章浏览量
 * GET /api/views?id=postId - 获取特定文章的浏览量
 * GET /api/views - 获取所有文章的浏览量
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    // 获取视图数据存储路径
    const viewsFile = path.join(process.cwd(), "data", "views.json");

    // 如果文件不存在，返回空数据
    if (!fs.existsSync(viewsFile)) {
      return NextResponse.json(
        postId ? { id: postId, views: 0 } : { views: {} }
      );
    }

    // 读取视图数据
    const fileContent = fs.readFileSync(viewsFile, "utf8");
    let viewsData = {};

    try {
      viewsData = JSON.parse(fileContent);
    } catch (e) {
      console.error("Error parsing views data:", e);
      return NextResponse.json(
        { error: "Failed to parse views data" },
        { status: 500 }
      );
    }

    // 如果请求特定文章的浏览量
    if (postId) {
      const postViews = viewsData[postId] ? viewsData[postId].count : 0;
      return NextResponse.json({
        id: postId,
        views: postViews,
      });
    }

    // 返回所有文章的浏览量
    return NextResponse.json({ views: viewsData });
  } catch (error) {
    console.error("Error getting view count:", error);
    return NextResponse.json(
      { error: "Failed to get view count" },
      { status: 500 }
    );
  }
}
