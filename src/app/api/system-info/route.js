import { NextResponse } from "next/server";
import pkg from "next/package.json"; // 获取 Next.js 版本

/**
 * API 路由：获取系统信息
 * 提供 Next.js 和 Node.js 版本等信息
 */
export async function GET() {
  try {
    const systemInfo = {
      nextVersion: pkg.version || "unknown",
      nodeVersion: process.version || "unknown",
      environment: process.env.NODE_ENV || "development",
      serverTime: new Date().toISOString(),
    };

    return NextResponse.json(systemInfo);
  } catch (error) {
    console.error("Error fetching system info:", error);
    return NextResponse.json(
      { error: "Failed to fetch system information" },
      { status: 500 }
    );
  }
}
