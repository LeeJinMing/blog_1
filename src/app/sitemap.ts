import { MetadataRoute } from "next";
import { getPosts, formatDateForUrl, getUrlSafeSlug } from "../lib/db";

/**
 * Generate dynamic sitemap for the website
 * Next.js MetadataRoute format - returns only URL list for XML generation
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 使用环境变量中的域名，确保一致性，并移除尾随斜杠
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const currentDate = new Date();

  // 静态页面URLs
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/archives`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    // 获取所有文章
    const posts = await getPosts(200);

    if (Array.isArray(posts) && posts.length > 0) {
      // 文章页面URLs
      const postsUrls: MetadataRoute.Sitemap = posts
        .filter((post) => post?.createdAt && post?.slug?.trim())
        .map((post) => {
          const dateStr = formatDateForUrl(post.createdAt);
          const urlSafeSlug = getUrlSafeSlug(post.slug);

          return {
            url: `${baseUrl}/posts/${dateStr}/${urlSafeSlug}`,
            lastModified: new Date(post.updatedAt || post.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.8,
          };
        });

      // 分类页面URLs
      const categories = [
        "Business Analysis",
        "Technology",
        "Investment",
        "AI",
        "Market Trends",
      ];
      const categoryUrls: MetadataRoute.Sitemap = categories.map(
        (category) => ({
          url: `${baseUrl}/category/${encodeURIComponent(
            category.toLowerCase().replace(/\s+/g, "-")
          )}`,
          lastModified: currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        })
      );

      return [...staticUrls, ...postsUrls, ...categoryUrls];
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  // 出错时返回静态页面
  return staticUrls;
}
