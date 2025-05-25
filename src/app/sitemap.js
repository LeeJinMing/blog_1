import { getPosts } from "@/lib/db";

/**
 * Generate dynamic sitemap for the website
 * Next.js automatically handles this file and provides XML format at /sitemap.xml endpoint
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  const baseUrl = "https://blog-1-seven-pi.vercel.app";

  try {
    // Static pages - most important pages
    const staticUrls = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];

    // Try to get articles
    let postsUrls = [];
    try {
      const posts = await getPosts(20); // Only get latest 20 articles

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
      // If getting articles fails, continue with static pages
    }

    const allUrls = [...staticUrls, ...postsUrls];
    console.log(`Generated sitemap with ${allUrls.length} URLs`);
    return allUrls;
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return most basic sitemap
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
