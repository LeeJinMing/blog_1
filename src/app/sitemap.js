import { getPosts } from "@/lib/db";

/**
 * 生成网站的动态Sitemap
 * Next.js会自动处理这个文件并在/sitemap.xml端点提供XML格式
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  // 确保使用正确的生产域名
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app/"
  ).replace(/\/$/, "");

  // 验证baseUrl格式
  if (!baseUrl.startsWith("http")) {
    console.error("Invalid BASE_URL:", baseUrl);
    throw new Error("BASE_URL must start with http or https");
  }

  try {
    // 获取所有文章
    const posts = await getPosts(500);

    // 生成文章URL条目，添加数据验证
    const postsUrls = posts
      .filter((post) => post && post.createdAt && post.slug) // 过滤无效数据
      .map((post) => {
        try {
          // 从日期生成yyyymmdd格式
          const date = new Date(post.createdAt);

          // 验证日期有效性
          if (isNaN(date.getTime())) {
            console.warn(`Invalid date for post ${post.slug}:`, post.createdAt);
            return null;
          }

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const yyyymmdd = `${year}${month}${day}`;

          // 确保slug是URL安全的
          const safeSlug = encodeURIComponent(post.slug).replace(/%/g, "");

          // 创建URL并添加lastModified
          return {
            url: `${baseUrl}/posts/${yyyymmdd}/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt),
            changeFrequency: "weekly",
            priority: 0.8,
          };
        } catch (error) {
          console.error(`Error processing post ${post.slug}:`, error);
          return null;
        }
      })
      .filter(Boolean); // 移除null值

    // 创建分类页面URL条目
    const categories = [
      "politics-diplomacy",
      "business-economy",
      "tech-innovation",
      "international-relations",
      "culture-society",
    ];

    const categoriesUrls = categories.map((category) => ({
      url: `${baseUrl}/category/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // 创建标签页面URL条目
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

    const tagsUrls = tags.map((tag) => ({
      url: `${baseUrl}/tags/${tag}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

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
    const allUrls = [
      ...staticUrls,
      ...postsUrls,
      ...categoriesUrls,
      ...tagsUrls,
    ];

    // 验证所有URL
    const validUrls = allUrls.filter((urlEntry) => {
      if (!urlEntry || !urlEntry.url) {
        console.warn("Invalid URL entry:", urlEntry);
        return false;
      }

      try {
        new URL(urlEntry.url); // 验证URL格式
        return true;
      } catch (error) {
        console.warn("Invalid URL format:", urlEntry.url);
        return false;
      }
    });

    console.log(`Generated sitemap with ${validUrls.length} URLs`);
    return validUrls;
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // 返回基本的静态URL作为后备
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}
