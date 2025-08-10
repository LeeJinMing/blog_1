import { MetadataRoute } from "next";

/**
 * Generate robots.txt file for the website
 * Next.js MetadataRoute format
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

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
        ],
        disallow: [
          "/api/auth/*",
          "/api/admin/*",
          "/api/private/*",
          "/admin/*",
          "/settings/*",
          "/_next/",
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
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
