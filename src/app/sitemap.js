import { getPosts } from "@/lib/db";

/**
 * 生成网站的动态Sitemap
 * Next.js会自动处理这个文件并在/sitemap.xml端点提供XML格式
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
  ).replace(/\/$/, "");

  // 获取所有文章
  const posts = await getPosts(500);

  // 生成文章URL条目
  const postsUrls = posts.map((post) => {
    // 从日期生成yyyymmdd格式
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const yyyymmdd = `${year}${month}${day}`;

    // 创建URL并添加lastModified
    return {
      url: `${baseUrl}/posts/${yyyymmdd}/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  // 创建分类页面URL条目
  const categories = [
    "politics-diplomacy",
    "business-economy",
    "tech-innovation",
    "international-relations",
    "culture-society",
  ];

  const categoriesUrls = categories.map((category) => {
    return {
      url: `${baseUrl}/category/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  // 创建标签页面URL条目
  // 简化起见，这里只包含一些主要标签
  const tags = [
    "tech",
    "ai",
    "future-trends",
    "politics",
    "economy",
    "business",
    "finance",
    "market",
    "international",
    "global",
  ];

  const tagsUrls = tags.map((tag) => {
    return {
      url: `${baseUrl}/tags/${tag}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    };
  });

  // 创建静态页面URL条目
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/archives`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // 合并所有URL条目
  return [...staticUrls, ...postsUrls, ...categoriesUrls, ...tagsUrls];
}
