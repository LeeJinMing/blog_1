import { NextResponse } from "next/server";
import { incomeStreamArticles } from "@/data/incomeStreamArticles";

export async function GET() {
  const baseUrl = "https://blog-2-rho.vercel.app";

  // 获取所有文章数据
  const articles = incomeStreamArticles;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- 主页 - 最高优先级 -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- 关于页面 -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 主要分类页面 -->
  <url>
    <loc>${baseUrl}/category/income-streams</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/category/money-making</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/category/investments</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/category/business</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/category/finance</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 文章页面 -->
  ${articles
    .map((article) => {
      const publishedDate = article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : new Date().toISOString();
      return `
  <url>
    <loc>${baseUrl}/post/${article.slug || article._id}</loc>
    <lastmod>${publishedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <news:news>
      <news:publication>
        <news:name>MoneyGuide</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishedDate}</news:publication_date>
      <news:title><![CDATA[${article.title}]]></news:title>
    </news:news>
  </url>`;
    })
    .join("")}

</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
