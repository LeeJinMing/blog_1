import { MetadataRoute } from "next";
import { getPosts, formatDateForUrl, getUrlSafeSlug } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBase =
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";
  const baseUrl = rawBase.replace(/\/+$/, "");
  const now = new Date();

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/archives`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 固定分类入口（如需可改为动态）
  const categories = [
    "politics-diplomacy",
    "business-economy",
    "tech-innovation",
    "international-relations",
    "culture-society",
  ];
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 文章页面 - 从数据库读取
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPosts(500);
    const unique = new Map<
      string,
      {
        url: string;
        lastModified: Date;
        changeFrequency: "monthly";
        priority: number;
      }
    >();
    for (const post of posts) {
      if (!post?.slug || !post?.createdAt) continue;
      const dateStr = formatDateForUrl(post.createdAt);
      const slug = getUrlSafeSlug(post.slug);
      const loc = `${baseUrl}/posts/${dateStr}/${slug}`;
      const lastMod = new Date(post.updatedAt || post.createdAt);
      if (!unique.has(loc)) {
        unique.set(loc, {
          url: loc,
          lastModified: lastMod,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
    articlePages = Array.from(unique.values());
  } catch (e) {
    console.error("Sitemap posts fetch failed:", (e as Error).message);
  }

  const total = [...staticPages, ...categoryPages, ...articlePages];
  return total;
}

export const revalidate = 3600;
