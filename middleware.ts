import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 排除sitemap.xml，让它由Next.js的headers配置处理
  if (request.nextUrl.pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  // 排除robots.txt
  if (request.nextUrl.pathname === "/robots.txt") {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // 设置HTML优化头
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
