/**
 * Google Indexing API 通知路由
 * 用于手动或自动触发索引通知
 */

import { NextResponse } from "next/server";
import {
  notifyGoogleIndex,
  notifyGoogleIndexBatch,
  notifyPostPublished,
  validateIndexingConfig,
} from "../../../lib/google-indexing";

// 验证API密钥（可选的安全措施）
function validateApiKey(request) {
  const apiKey = request.headers.get("X-API-Key");
  const expectedKey = process.env.INTERNAL_API_KEY;

  if (expectedKey && apiKey !== expectedKey) {
    return false;
  }
  return true;
}

/**
 * POST /api/notify-google
 * 通知Google索引特定URL或文章
 */
export async function POST(request) {
  try {
    // 验证API密钥（如果配置了）
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    // 验证Google Indexing API配置
    const isConfigValid = await validateIndexingConfig();
    if (!isConfigValid) {
      return NextResponse.json(
        {
          error: "Google Indexing API 未配置或配置无效",
          hint: "请在环境变量中设置 GOOGLE_SERVICE_ACCOUNT_KEY",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { type, url, urls, postId } = body;

    let result;

    switch (type) {
      case "single_url":
        if (!url) {
          return NextResponse.json(
            { error: "缺少必需的参数: url" },
            { status: 400 }
          );
        }
        result = await notifyGoogleIndex(url);
        break;

      case "batch_urls":
        if (!urls || !Array.isArray(urls)) {
          return NextResponse.json(
            { error: "缺少必需的参数: urls (数组)" },
            { status: 400 }
          );
        }
        result = await notifyGoogleIndexBatch(urls);
        break;

      case "post_published":
        if (!postId) {
          return NextResponse.json(
            { error: "缺少必需的参数: postId" },
            { status: 400 }
          );
        }

        // 从数据库获取文章信息
        const { getPostById } = await import("../../../lib/db");
        const post = await getPostById(postId);

        if (!post) {
          return NextResponse.json({ error: "文章不存在" }, { status: 404 });
        }

        result = await notifyPostPublished(post);
        break;

      default:
        return NextResponse.json(
          {
            error: "无效的通知类型",
            validTypes: ["single_url", "batch_urls", "post_published"],
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      type,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Google索引通知API错误:", error);

    return NextResponse.json(
      {
        error: "服务器内部错误",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notify-google
 * 获取Google Indexing API状态和配置信息
 */
export async function GET(request) {
  try {
    // 验证API密钥（如果配置了）
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const isConfigValid = await validateIndexingConfig();

    const status = {
      configured: isConfigValid,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      endpoints: {
        singleUrl: {
          method: "POST",
          body: { type: "single_url", url: "https://example.com" },
        },
        batchUrls: {
          method: "POST",
          body: {
            type: "batch_urls",
            urls: ["https://example.com/1", "https://example.com/2"],
          },
        },
        postPublished: {
          method: "POST",
          body: { type: "post_published", postId: "文章ID" },
        },
      },
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error("获取Google索引API状态错误:", error);

    return NextResponse.json(
      {
        error: "服务器内部错误",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
