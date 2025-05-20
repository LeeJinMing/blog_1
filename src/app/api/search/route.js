import { NextResponse } from "next/server";
// 导入新的数据库模块
import { getPosts } from "@/lib/db";
import { getTagTextById } from "@/lib/tags";

export async function GET(request) {
  // 解析请求URL，获取查询参数
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // 如果没有查询字符串，返回空数组
  if (!query || query.trim() === "") {
    return NextResponse.json([]);
  }

  try {
    // 使用db.js模块获取所有文章（限制较大数量，以便进行本地过滤）
    const allPosts = await getPosts(50);

    // 在应用层面进行搜索过滤
    const searchRegex = new RegExp(query, "i"); // 不区分大小写
    const results = allPosts.filter((post) => {
      // 查找标题、内容、摘要
      const basicMatch =
        (post.title && searchRegex.test(post.title)) ||
        (post.content && searchRegex.test(String(post.content))) ||
        (post.summary && searchRegex.test(post.summary));

      if (basicMatch) return true;

      // 查找标签 - 需要将标签ID转换为文本再匹配
      if (post.tagIds && post.tagIds.length > 0) {
        return post.tagIds.some((tagId) => {
          const tagText = getTagTextById(tagId);
          return searchRegex.test(tagText);
        });
      }

      return false;
    });

    // 限制返回结果数量
    return NextResponse.json(results.slice(0, 20));
  } catch (error) {
    console.error("搜索API错误:", error);
    return NextResponse.json({ error: "搜索时出现错误" }, { status: 500 });
  }
}
