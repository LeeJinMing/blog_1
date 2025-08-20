import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/posts/*", "/archives", "/categories/*", "/tags/*", "/search"],
        disallow: ["/api/auth/*", "/api/admin/*", "/api/private/*", "/admin/*", "/settings/*", "/_next/"],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/about", "/posts/*", "/archives", "/categories/*", "/tags/*", "/search"],
        disallow: ["/api/*", "/admin/*", "/settings/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

