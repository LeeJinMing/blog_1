import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * API端点用于递增文章浏览量
 * POST /api/views/increment
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

    // 获取视图数据存储路径
    const dataDir = path.join(process.cwd(), "data");
    const viewsFile = path.join(dataDir, "views.json");

    // 确保目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 读取现有视图数据或创建新的
    let viewsData = {};
    if (fs.existsSync(viewsFile)) {
      const fileContent = fs.readFileSync(viewsFile, "utf8");
      try {
        viewsData = JSON.parse(fileContent);
      } catch (e) {
        console.error("Error parsing views data:", e);
        // 文件可能损坏，使用空对象
        viewsData = {};
      }
    }

    // 增加特定文章的浏览量
    if (!viewsData[postId]) {
      viewsData[postId] = {
        count: 0,
        slug: slug || "",
        lastUpdated: new Date().toISOString(),
      };
    }

    viewsData[postId].count += 1;
    viewsData[postId].lastUpdated = new Date().toISOString();

    // 将更新后的数据写回文件
    fs.writeFileSync(viewsFile, JSON.stringify(viewsData, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      views: viewsData[postId].count,
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}
