import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://blog-1-seven-pi.vercel.app";
  const currentDate = new Date();

  console.log("🗺️ 生成动态sitemap开始...");

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

  // 示例文章页面 - 暂时不从数据库获取
  const sampleSlugs = [
    "ai-revolution-business-transformation-2025",
    "global-economy-trends-analysis-2025",
    "technology-innovation-investment-2025",
  ];

  const articlePages: MetadataRoute.Sitemap = sampleSlugs.map((slug) => ({
    url: `${baseUrl}/posts/20250810/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const totalPages = [...staticPages, ...categoryPages, ...articlePages];

  console.log(`🗺️ 动态sitemap生成完成: ${totalPages.length} 个条目`);
  console.log(`   - 静态页面: ${staticPages.length}`);
  console.log(`   - 分类页面: ${categoryPages.length}`);
  console.log(`   - 文章页面: ${articlePages.length}`);

  return totalPages;
}

// 设置重新验证时间
export const revalidate = 3600; // 1小时重新验证
