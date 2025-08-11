import { MetadataRoute } from "next";
import { getPosts, formatDateForUrl, getUrlSafeSlug } from "../lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://blog-1-seven-pi.vercel.app";
  const currentDate = new Date();

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
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
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tags`,
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

  // 分类页面
  const categories = [
    "politics-diplomacy",
    "business-economy",
    "tech-innovation",
    "international-relations",
    "culture-society",
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 文章页面 - 添加超时和错误处理
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    console.log("🔍 开始获取文章用于动态sitemap...");

    // 设置超时Promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("数据库查询超时")), 15000); // 15秒超时
    });

    // 获取文章
    const postsPromise = getPosts(200);
    const posts = (await Promise.race([postsPromise, timeoutPromise])) as any[];

    console.log(`📊 从数据库获取到 ${posts.length} 篇文章`);

    if (Array.isArray(posts) && posts.length > 0) {
      articlePages = posts
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

      console.log(`✅ 文章页面: ${articlePages.length} 篇`);
    }
  } catch (error) {
    console.warn("⚠️ 无法从数据库获取文章用于sitemap:", error);
    console.log("📝 使用示例文章");

    // 添加示例文章作为fallback
    const sampleSlugs = [
      "ai-revolution-business-transformation-2025",
      "global-economy-trends-analysis-2025",
      "technology-innovation-investment-2025",
    ];

    articlePages = sampleSlugs.map((slug) => ({
      url: `${baseUrl}/posts/20250810/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  }

  const totalPages = [...staticPages, ...categoryPages, ...articlePages];

  console.log(`🗺️ 动态sitemap生成完成: ${totalPages.length} 个条目`);
  console.log(`   - 静态页面: ${staticPages.length}`);
  console.log(`   - 分类页面: ${categoryPages.length}`);
  console.log(`   - 文章页面: ${articlePages.length}`);

  return totalPages;
}

// 设置重新验证时间
export const revalidate = 3600; // 1小时重新验证
