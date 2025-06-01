import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://blog-2-rho.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/api/posts*",
          "/api/articles*",
          "/api/sitemap*",
          "/api/robots*",
        ],
        disallow: [
          "/api/auth/*",
          "/api/admin/*",
          "/api/private/*",
          "/_next/static/chunks/*",
          "/admin/*",
          "/private/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/api/posts*",
          "/api/articles*",
          "/api/sitemap*",
          "/api/robots*",
        ],
        disallow: [
          "/api/auth/*",
          "/api/admin/*",
          "/api/private/*",
          "/admin/*",
          "/private/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
