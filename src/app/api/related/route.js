import { NextResponse } from "next/server";
import { getRelatedPosts } from "@/lib/db";
import { getTagIdByText } from "@/lib/tags";

export async function GET(request) {
  // 解析请求URL，获取查询参数
  const { searchParams } = new URL(request.url);
  const tagsParam = searchParams.get("tags");
  const excludeId = searchParams.get("exclude");

  // 如果没有传入标签参数，返回空数组
  if (!tagsParam) {
    return NextResponse.json([]);
  }

  // 解析标签参数 - 现在处理的是标签ID
  const tagIds = tagsParam.split(",");

  try {
    // 使用简化的全局缓存函数获取相关文章
    const relatedPosts = await getRelatedPosts(tagIds, excludeId, 5);
    return NextResponse.json(relatedPosts);
  } catch (error) {
    console.error("相关文章API错误:", error);
    return NextResponse.json(
      { error: "获取相关文章时出现错误" },
      { status: 500 }
    );
  }
}
