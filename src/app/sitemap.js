import { getPosts } from "@/lib/db";

/**
 * 生成网站的动态Sitemap
 * Next.js会自动处理这个文件并在/sitemap.xml端点提供XML格式
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  const baseUrl = "https://blog-1-seven-pi.vercel.app";

  try {
    // 静态页面 - 最重要的页面
    const staticUrls = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];

    // 尝试获取文章
    let postsUrls = [];
    try {
      const posts = await getPosts(20); // 只获取最新的20篇文章

      postsUrls = posts
        .filter((post) => post && post.createdAt && post.slug)
        .slice(0, 20)
        .map((post) => {
          const date = new Date(post.createdAt);
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
        });
    } catch (postsError) {
      console.error("Error fetching posts for sitemap:", postsError);
      // 如果获取文章失败，继续使用静态页面
    }

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
