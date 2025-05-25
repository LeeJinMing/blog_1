import { getPosts } from "@/lib/db";

/**
 * 生成网站的动态Sitemap
 * Next.js会自动处理这个文件并在/sitemap.xml端点提供XML格式
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  const baseUrl = "https://blog-1-seven-pi.vercel.app";

  try {
    // 获取所有文章
    const posts = await getPosts(100); // 减少数量以避免超时

    // 生成文章URL条目
    const postsUrls = posts
      .filter((post) => post && post.createdAt && post.slug)
      .slice(0, 50) // 限制数量
      .map((post) => {
        try {
          const date = new Date(post.createdAt);
          if (isNaN(date.getTime())) {
            return null;
          }

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const yyyymmdd = `${year}${month}${day}`;

          return {
            url: `${baseUrl}/posts/${yyyymmdd}/${post.slug}`,
            lastModified: new Date(post.createdAt),
            changeFrequency: "weekly",
            priority: 0.8,
          };
        } catch (error) {
          console.error(`Error processing post ${post.slug}:`, error);
          return null;
        }
      })
      .filter(Boolean);

    // 静态页面
    const staticUrls = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
    ];

    // 合并所有URL
    const allUrls = [...staticUrls, ...postsUrls];

    console.log(`Generated sitemap with ${allUrls.length} URLs`);
    return allUrls;
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // 返回最基本的sitemap
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
