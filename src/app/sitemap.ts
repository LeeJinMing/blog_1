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

  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/category/money-making`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/income-streams`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // Income Streams 文章页面
  const incomeStreamPages = incomeStreamArticleIds.map((id) => ({
    url: `${baseUrl}/post/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...incomeStreamPages];
}
