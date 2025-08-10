import { NextRequest, NextResponse } from "next/server";
import { getPosts, formatDateForUrl, getUrlSafeSlug } from "../../../lib/db";

/**
 * API路由兜底方案 - 用于验证sitemap内容
 * 仅在调试阶段使用，生产环境应该移除
 */
export async function GET(request: NextRequest) {
  try {
    const rawBaseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";
    const baseUrl = rawBaseUrl.replace(/\/+$/, "");
    const currentDate = new Date().toISOString();

    // 构建XML内容
    const staticUrls = [
      `<url><loc>${baseUrl}</loc><lastmod>${currentDate}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${baseUrl}/about</loc><lastmod>${currentDate}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
      `<url><loc>${baseUrl}/archives</loc><lastmod>${currentDate}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      `<url><loc>${baseUrl}/tags</loc><lastmod>${currentDate}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`,
      `<url><loc>${baseUrl}/categories</loc><lastmod>${currentDate}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`,
      `<url><loc>${baseUrl}/search</loc><lastmod>${currentDate}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    ];

    let postUrls: string[] = [];
    let categoryUrls: string[] = [];

    try {
      const posts = await getPosts(200);

      if (Array.isArray(posts) && posts.length > 0) {
        postUrls = posts
          .filter((post) => post?.createdAt && post?.slug?.trim())
          .map((post) => {
            const dateStr = formatDateForUrl(post.createdAt);
            const urlSafeSlug = getUrlSafeSlug(post.slug);
            const lastMod = new Date(
              post.updatedAt || post.createdAt
            ).toISOString();

            return `<url><loc>${baseUrl}/posts/${dateStr}/${urlSafeSlug}</loc><lastmod>${lastMod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
          });

        const categories = [
          "Business Analysis",
          "Technology",
          "Investment",
          "AI",
          "Market Trends",
        ];
        categoryUrls = categories.map((category) => {
          const categorySlug = encodeURIComponent(
            category.toLowerCase().replace(/\s+/g, "-")
          );
          return `<url><loc>${baseUrl}/category/${categorySlug}</loc><lastmod>${currentDate}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`;
        });
      }
    } catch (error) {
      console.error("Error fetching posts for API sitemap:", error);
    }

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls, ...categoryUrls].join("\n")}
</urlset>`;

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error in API sitemap route:", error);

    // 返回最小化的sitemap
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${(
      process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app"
    ).replace(
      /\/+$/,
      ""
    )}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
</urlset>`;

    return new NextResponse(fallbackXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  }
}
