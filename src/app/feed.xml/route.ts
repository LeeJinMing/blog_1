import { NextResponse } from "next/server";
import { getPosts, formatDateForUrl, getUrlSafeSlug } from "@/lib/db";

export const revalidate = 1800;

export async function GET() {
  const rawBase = process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";
  const baseUrl = rawBase.replace(/\/+$/, "");

  try {
    const posts = await getPosts(20);
    const items = posts
      .filter((p) => p?.slug && p?.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20)
      .map((p) => {
        const dateStr = formatDateForUrl(p.createdAt);
        const slug = getUrlSafeSlug(p.slug);
        const link = `${baseUrl}/posts/${dateStr}/${slug}`;
        const pubDate = new Date(p.createdAt).toUTCString();
        return `
<item>
  <title><![CDATA[${p.title}]]></title>
  <link>${link}</link>
  <guid>${link}</guid>
  <pubDate>${pubDate}</pubDate>
  <description><![CDATA[${p.summary || ""}]]></description>
</item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Insights Blog RSS</title>
    <link>${baseUrl}</link>
    <description>Latest articles from Insights Blog</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=1800, s-maxage=1800",
      },
    });
  } catch (e) {
    return new NextResponse("Service Unavailable", { status: 503 });
  }
}


