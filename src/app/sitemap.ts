import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";

export const dynamic = "force-dynamic";

// 所有硬编码文章的ID列表
const hardcodedArticleIds = [
  // Income Streams 分类
  "dividend-investing-passive-income-2025",
  "rental-property-income-guide-2025",
  "online-course-creation-income-2025",
  "affiliate-marketing-income-streams-2025",
  "dropshipping-business-income-2025",
  "youtube-monetization-income-streams-2025",

  // AI Money 分类
  "ai-chatbot-business-income-2025",
  "ai-content-generation-business-2025",
  "ai-trading-bot-income-2025",

  // Investment 分类
  "stock-market-investing-beginners-2025",
  "cryptocurrency-investment-strategy-2025",
  "index-fund-investing-passive-wealth-2025",

  // E-commerce 分类
  "amazon-fba-business-guide-2025",
  "shopify-store-success-2025",
  "print-on-demand-business-2025",

  // Content Creation 分类
  "youtube-monetization-complete-guide-2025",
  "instagram-influencer-income-2025",
  "podcast-monetization-strategies-2025",

  // Skill Services 分类
  "freelance-consulting-business-2025",
  "online-tutoring-income-2025",
  "virtual-assistant-services-2025",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // 硬编码文章页面
  const hardcodedArticlePages: MetadataRoute.Sitemap = hardcodedArticleIds.map(
    (id) => ({
      url: `${baseUrl}/post/${id}`,
      lastModified: articleDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // 动态获取数据库文章页面
  let databaseArticlePages: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    // 获取所有已发布的文章，排除已经在硬编码列表中的文章
    const posts = await Post.find({
      slug: { $nin: hardcodedArticleIds }, // 排除硬编码文章，避免重复
    })
      .select("slug updatedAt createdAt")
      .sort({ createdAt: -1 })
      .exec();

    databaseArticlePages = posts.map((post) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt || articleDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    console.log(
      `Sitemap generated with ${hardcodedArticleIds.length} hardcoded articles and ${posts.length} database articles`
    );
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
    console.log("Using only hardcoded articles for sitemap");
  }

  return [...staticPages, ...hardcodedArticlePages, ...databaseArticlePages];
}
