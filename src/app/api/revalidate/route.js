import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * API路由：手动触发缓存重新验证
 * 可以在添加/更新文章后调用此API，刷新特定页面的缓存
 *
 * 用法示例：
 * POST /api/revalidate?path=/posts/20240517/example-post&secret=YOUR_SECRET_TOKEN
 */
export async function POST(request) {
  try {
    // 解析URL参数
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    const secret = searchParams.get("secret");

    // 验证安全令牌，防止未授权访问
    // 在实际生产环境中，应该使用环境变量存储这个令牌
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: "Invalid revalidation token" },
        { status: 401 }
      );
    }

    // 如果没有提供路径，默认重新验证首页
    const pathToRevalidate = path || "/";

    // 触发重新验证
    revalidatePath(pathToRevalidate);

    return NextResponse.json({
      revalidated: true,
      path: pathToRevalidate,
      date: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error during revalidation:", error);
    return NextResponse.json(
      { message: "Error revalidating", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * 允许获取路由状态，但不执行重新验证
 */
export async function GET(request) {
  return NextResponse.json({
    message:
      "Revalidation endpoint active. Use POST method to trigger revalidation.",
    info: "Send a POST request with path and secret parameters",
  });
}
