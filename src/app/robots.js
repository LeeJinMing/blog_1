/**
 * Generate robots.txt file for the website
 * Next.js automatically handles this file and provides content at /robots.txt endpoint
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots() {
  // 确保与 sitemap.js 使用相同的 baseUrl 逻辑
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/posts/*",
          "/archives",
          "/categories/*",
          "/tags/*",
          "/search",
          "/api/search*",
        ],
        disallow: [
          "/api/auth/*",
          "/api/admin/*",
          "/api/private/*",
          "/admin/*",
          "/settings/*",
          "/_next/static/chunks/*",
          "/_next/",
          "/api/db/*",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/about",
          "/posts/*",
          "/archives",
          "/categories/*",
          "/tags/*",
          "/search",
        ],
        disallow: ["/api/*", "/admin/*", "/settings/*"],
        crawlDelay: 0.5,
      },
      {
        userAgent: "Bingbot",
        allow: [
          "/",
          "/about",
          "/posts/*",
          "/archives",
          "/categories/*",
          "/tags/*",
        ],
        disallow: ["/api/*", "/admin/*", "/settings/*"],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
