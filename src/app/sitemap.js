import { getPosts } from "../lib/db";

/**
 * Generate dynamic sitemap for the website
 * Next.js automatically handles this file and provides XML format at /sitemap.xml endpoint
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";
  const currentDate = new Date();

  try {
    // Static pages - most important pages
    const staticUrls = [
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
        url: `${baseUrl}/tags`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.6,
      },
      {
        url: `${baseUrl}/categories`,
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

    // Try to get articles
    let postsUrls = [];
    try {
      const posts = await getPosts(50); // Get latest 50 articles for better coverage

      postsUrls = posts
        .filter((post) => post && post.createdAt && post.slug)
        .slice(0, 50)
        .map((post) => {
          const date = new Date(post.createdAt);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const yyyymmdd = `${year}${month}${day}`;

          // Calculate priority based on post age
          const daysSincePublished = Math.floor(
            (currentDate - date) / (1000 * 60 * 60 * 24)
          );
          let priority = 0.8;
          if (daysSincePublished > 365) priority = 0.5;
          else if (daysSincePublished > 180) priority = 0.6;
          else if (daysSincePublished > 30) priority = 0.7;

          return {
            url: `${baseUrl}/posts/${yyyymmdd}/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt),
            changeFrequency: daysSincePublished < 30 ? "weekly" : "monthly",
            priority: priority,
          };
        });
    } catch (postsError) {
      console.error("Error fetching posts for sitemap:", postsError);
      // If getting articles fails, continue with static pages
    }

    // Add category pages if we have posts
    let categoryUrls = [];
    if (postsUrls.length > 0) {
      const categories = [
        "Business Analysis",
        "Technology",
        "Investment",
        "AI",
        "Market Trends",
      ];
      categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/category/${encodeURIComponent(
          category.toLowerCase().replace(/\s+/g, "-")
        )}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.6,
      }));
    }

    const allUrls = [...staticUrls, ...postsUrls, ...categoryUrls];
    console.log(
      `Generated sitemap with ${allUrls.length} URLs (${staticUrls.length} static, ${postsUrls.length} posts, ${categoryUrls.length} categories)`
    );
    return allUrls;
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return most basic sitemap
    return [
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
    ];
  }
}
