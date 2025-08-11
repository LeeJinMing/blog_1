/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://blog-1-seven-pi.vercel.app",
  generateRobotsTxt: true, // 自动生成robots.txt
  generateIndexSitemap: false, // 对于小网站不需要索引sitemap

  // 排除的路径
  exclude: [
    "/api/*",
    "/admin/*",
    "/settings/*",
    "/sitemap.xml", // 排除sitemap.xml自身避免循环引用
    "/_not-found",
    "/404",
    "/500",
  ],

  // 额外的路径（动态路由和分类页面）
  additionalPaths: async (config) => {
    const paths = [];

    // 添加分类页面
    const categories = [
      "politics-diplomacy",
      "business-economy",
      "tech-innovation",
      "international-relations",
      "culture-society",
    ];

    categories.forEach((category) => {
      paths.push({
        loc: `/category/${category}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    });

    // 添加所有文章页面
    try {
      // 尝试导入数据库文章
      const {
        getPosts,
        formatDateForUrl,
        getUrlSafeSlug,
      } = require("./src/lib/db");

      // 注意：构建时数据库可能不可用，添加错误处理
      const posts = await getPosts(200);

      if (Array.isArray(posts) && posts.length > 0) {
        posts
          .filter((post) => post?.createdAt && post?.slug?.trim())
          .forEach((post) => {
            const dateStr = formatDateForUrl(post.createdAt);
            const urlSafeSlug = getUrlSafeSlug(post.slug);

            paths.push({
              loc: `/posts/${dateStr}/${urlSafeSlug}`,
              changefreq: "monthly",
              priority: 0.8,
              lastmod: new Date(post.updatedAt || post.createdAt).toISOString(),
            });
          });

        console.log(`Added ${posts.length} articles to sitemap`);
      }
    } catch (error) {
      console.warn(
        "无法获取文章用于next-sitemap，将依赖动态sitemap:",
        error.message
      );

      // 添加一些示例文章路径作为fallback
      const sampleSlugs = [
        "ai-revolution-business-transformation-2025",
        "global-economy-trends-analysis-2025",
        "technology-innovation-investment-2025",
      ];

      sampleSlugs.forEach((slug) => {
        paths.push({
          loc: `/posts/20250810/${slug}`,
          changefreq: "monthly",
          priority: 0.8,
          lastmod: new Date().toISOString(),
        });
      });
    }

    return paths;
  },

  // robots.txt配置
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/settings/", "/_next/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/settings/"],
        crawlDelay: 0.5,
      },
    ],
    additionalSitemaps: ["https://blog-1-seven-pi.vercel.app/sitemap.xml"],
  },

  // 自定义转换
  transform: async (config, path) => {
    let priority = 0.7;
    let changefreq = "weekly";

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path.startsWith("/posts/")) {
      priority = 0.8;
      changefreq = "monthly";
    } else if (path.startsWith("/category/")) {
      priority = 0.9;
      changefreq = "weekly";
    } else if (path === "/archives") {
      priority = 0.8;
      changefreq = "weekly";
    } else if (path === "/categories") {
      priority = 0.8;
      changefreq = "weekly";
    } else if (path === "/tags") {
      priority = 0.7;
      changefreq = "weekly";
    } else if (path === "/about") {
      priority = 0.7;
      changefreq = "monthly";
    } else if (path === "/search") {
      priority = 0.6;
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
