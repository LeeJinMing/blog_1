import { NextResponse } from "next/server";
import { getPosts, formatDateForUrl, getUrlSafeSlug } from "@/lib/db";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  const rawBase =
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";
  const baseUrl = rawBase.replace(/\/+$/, "");
  const nowIso = new Date().toISOString();

  // Static entries
  const staticUrls = [
    `<url><loc>${baseUrl}</loc><lastmod>${nowIso}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${baseUrl}/about</loc><lastmod>${nowIso}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${baseUrl}/archives</loc><lastmod>${nowIso}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${baseUrl}/categories</loc><lastmod>${nowIso}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`,
    `<url><loc>${baseUrl}/tags</loc><lastmod>${nowIso}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`,
    `<url><loc>${baseUrl}/search</loc><lastmod>${nowIso}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
  ];

  let postUrls: string[] = [];
  try {
    const posts = await getPosts(500);
    const seen = new Set<string>();
    for (const p of posts) {
      if (!p?.slug || !p?.createdAt) continue;
      const dateStr = formatDateForUrl(p.createdAt);
      const slug = getUrlSafeSlug(p.slug);
      const loc = `${baseUrl}/posts/${dateStr}/${slug}`;
      if (seen.has(loc)) continue;
      seen.add(loc);
      const lastMod = new Date(p.updatedAt || p.createdAt).toISOString();
      postUrls.push(
        `<url><loc>${loc}</loc><lastmod>${lastMod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
      );
    }
  } catch (e) {
    // keep static only
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...staticUrls, ...postUrls].join("\n") +
    `\n</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      // 与 blog_2 对齐
      "X-Robots-Tag": "noindex",
    },
  });
}
