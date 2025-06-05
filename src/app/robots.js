/**
 * 生成网站的robots.txt文件
 * Next.js会自动处理这个文件并在/robots.txt端点提供内容
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots() {
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
