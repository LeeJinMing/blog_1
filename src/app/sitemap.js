import { getPosts, formatDateForUrl, getUrlSafeSlug } from "../lib/db";

/**
 * URL验证函数
 */
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generate dynamic sitemap for the website
 * Next.js automatically handles this file and provides XML format at /sitemap.xml endpoint
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap() {
  // 确保 baseUrl 始终有效
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://blog-1-seven-pi.vercel.app";

  const currentDate = new Date();

  try {
    // Static pages - always available
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

    // Try to get articles with better error handling
    let postsUrls = [];
    try {
      console.log("Fetching posts for sitemap...");
      const posts = await getPosts(200); // 从50增加到200，确保包含所有176篇文章

      if (Array.isArray(posts) && posts.length > 0) {
        postsUrls = posts
          .filter((post) => {
            // 更严格的数据验证
            return (
              post &&
              post.createdAt &&
              post.slug &&
              typeof post.slug === "string" &&
              post.slug.trim().length > 0 &&
              typeof post.createdAt === "string"
            );
          })
          .slice(0, 200) // 确保不超过200篇文章
          .map((post) => {
            try {
              const dateStr = formatDateForUrl(post.createdAt);
              const urlSafeSlug = getUrlSafeSlug(post.slug);
              const postUrl = `${baseUrl}/posts/${dateStr}/${urlSafeSlug}`;

              // URL格式验证
              if (!isValidUrl(postUrl)) {
                console.warn(`⚠️ 跳过无效URL: ${postUrl}`);
                return null;
              }

              return {
                url: postUrl,
                lastModified: new Date(post.updatedAt || post.createdAt),
                changeFrequency: "monthly",
                priority: 0.8,
              };
            } catch (urlError) {
              console.error(`❌ 生成文章URL失败:`, {
                slug: post.slug,
                createdAt: post.createdAt,
                error: urlError.message,
              });
              return null;
            }
          })
          .filter(Boolean); // 移除null值

        console.log(
          `✅ Successfully processed ${postsUrls.length} posts for sitemap`
        );
      } else {
        console.warn("⚠️ No valid posts found for sitemap generation");
      }
    } catch (postsError) {
      console.error("Error fetching posts for sitemap:", postsError);
      // 不再静默失败，而是记录详细错误信息
      console.error("Stack trace:", postsError.stack);
    }

    // Add category pages only if we have posts
    let categoryUrls = [];
    if (postsUrls.length > 0) {
      const categories = [
        "Business Analysis",
        "Technology",
        "Investment",
        "AI",
        "Market Trends",
      ];

      categoryUrls = categories
        .map((category) => {
          try {
            return {
              url: `${baseUrl}/category/${encodeURIComponent(
                category.toLowerCase().replace(/\s+/g, "-")
              )}`,
              lastModified: currentDate,
              changeFrequency: "weekly",
              priority: 0.6,
            };
          } catch (categoryError) {
            console.error(
              `Error processing category ${category}:`,
              categoryError
            );
            return null;
          }
        })
        .filter(Boolean);
    }

    const allUrls = [...staticUrls, ...postsUrls, ...categoryUrls];

    // 验证所有URL的有效性
    const validUrls = allUrls.filter((urlObj) => {
      try {
        new URL(urlObj.url); // 验证URL格式
        return urlObj.url && urlObj.lastModified && urlObj.priority;
      } catch (urlError) {
        console.error(`Invalid URL found: ${urlObj.url}`, urlError);
        return false;
      }
    });

    console.log(
      `Generated sitemap with ${validUrls.length} valid URLs (${staticUrls.length} static, ${postsUrls.length} posts, ${categoryUrls.length} categories)`
    );

    // 确保至少返回静态页面
    return validUrls.length > 0 ? validUrls : staticUrls;
  } catch (error) {
    console.error("Critical error generating sitemap:", error);
    console.error("Stack trace:", error.stack);

    // 返回最基础但确保有效的网站地图
    const fallbackUrls = [
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

    // 验证fallback URLs
    return fallbackUrls.filter((urlObj) => {
      try {
        new URL(urlObj.url);
        return true;
      } catch {
        return false;
      }
    });
  }
}
