/**
 * 生成网站的robots.txt文件
 * Next.js会自动处理这个文件并在/robots.txt端点提供内容
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/settings/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
