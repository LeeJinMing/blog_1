import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://blog-2-rho.vercel.app";

  const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# 允许Google等主要搜索引擎爬取
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

# 禁止爬取敏感目录和文件
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /search?

# 允许爬取站点地图
Allow: /sitemap.xml
Allow: /ads.txt

# 限制爬取频率过高的机器人
User-agent: *
Crawl-delay: 1

# 禁止恶意爬虫和垃圾机器人
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: LinkpadBot
Disallow: /

User-agent: spbot
Disallow: /

# 站点地图位置
Sitemap: ${baseUrl}/sitemap.xml

# 主机信息
Host: ${baseUrl}`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
