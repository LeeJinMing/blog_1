import { MetadataRoute } from "next";

// 硬编码的 Income Streams 文章 IDs
const incomeStreamArticleIds = [
  "dividend-investing-passive-income-2025",
  "rental-property-income-guide-2025",
  "online-course-creation-income-2025",
  "affiliate-marketing-income-streams-2025",
  "dropshipping-business-income-2025",
  "youtube-monetization-income-streams-2025",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://blog-2-rho.vercel.app";

  // 使用固定日期而不是动态日期
  const currentDate = new Date("2025-01-09");
  const articleDate = new Date("2025-01-08");

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/category/money-making`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/income-streams`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Income Streams 文章页面
  const incomeStreamPages: MetadataRoute.Sitemap = incomeStreamArticleIds.map(
    (id) => ({
      url: `${baseUrl}/post/${id}`,
      lastModified: articleDate,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  return [...staticPages, ...incomeStreamPages];
}
