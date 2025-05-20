import { NextResponse } from "next/server";
import { getPosts } from "../../../lib/db";
import fs from "fs";
import path from "path";

/**
 * API handler for fetching popular posts based on view count
 * GET /api/popular-posts
 */
export async function GET() {
  try {
    // 获取所有文章
    const posts = (await getPosts(100)) || [];

    // 获取视图数据存储路径
    const viewsFile = path.join(process.cwd(), "data", "views.json");
    const likesFile = path.join(process.cwd(), "data", "likes.json");

    // 读取视图数据
    let viewsData = {};
    if (fs.existsSync(viewsFile)) {
      try {
        const fileContent = fs.readFileSync(viewsFile, "utf8");
        viewsData = JSON.parse(fileContent);
      } catch (e) {
        console.error("Error parsing views data:", e);
        // 出错时继续使用空对象
      }
    }

    // 读取点赞数据
    let likesData = {};
    if (fs.existsSync(likesFile)) {
      try {
        const fileContent = fs.readFileSync(likesFile, "utf8");
        likesData = JSON.parse(fileContent);
      } catch (e) {
        console.error("Error parsing likes data:", e);
        // 出错时继续使用空对象
      }
    }

    // 将视图和点赞数据添加到文章中
    const postsWithEngagement = posts.map((post) => {
      const postId = post._id.toString();
      const viewInfo = viewsData[postId] || { count: 0 };
      const likeInfo = likesData[postId] || { count: 0 };

      return {
        ...post,
        views: viewInfo.count,
        likes: likeInfo.count,
      };
    });

    // 按浏览量排序并返回前5篇
    const popularPosts = postsWithEngagement
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((post) => ({
        _id: post._id,
        title: post.title,
        date: post.date,
        slug: post.slug,
        views: post.views,
        likes: post.likes,
      }));

    return NextResponse.json({ popularPosts });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular posts" },
      { status: 500 }
    );
  }
}

/**
 * 根据字符串计算一个固定的哈希值
 * 这样确保同一字符串始终生成相同的数值
 */
function getStringHash(str) {
  let hash = 0;
  if (str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash);
}
