import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";

export const dynamic = "force-dynamic";

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

  // 动态获取所有文章页面
  let articlePages: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    // 获取所有已发布的文章
    const posts = await Post.find({})
      .select("slug updatedAt createdAt")
      .sort({ createdAt: -1 })
      .exec();

    articlePages = posts.map((post) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt || articleDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    console.log(`Sitemap generated with ${posts.length} articles`);
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);

    // 如果数据库连接失败，使用备用的硬编码文章
    const fallbackArticleIds = [
      "dividend-investing-passive-income-2025",
      "rental-property-income-guide-2025",
      "online-course-creation-income-2025",
      "affiliate-marketing-income-streams-2025",
      "dropshipping-business-income-2025",
      "youtube-monetization-income-streams-2025",
    ];

    articlePages = fallbackArticleIds.map((id) => ({
      url: `${baseUrl}/post/${id}`,
      lastModified: articleDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    console.log("Using fallback articles for sitemap");
  }

  return [...staticPages, ...articlePages];
}
