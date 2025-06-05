/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用实验性功能
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // 图片优化配置
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com"],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1年缓存
  },

  // 编译优化
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 安全和SEO头部配置
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 安全头部
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // 缓存控制
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // 静态资源缓存
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // API路由缓存
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=43200",
          },
        ],
      },
    ];
  },

  // URL重写配置
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      // 添加ads.txt重写
      {
        source: "/ads.txt",
        destination: "/api/ads-txt",
      },
    ];
  },

  // 重定向配置（可以用于SEO优化旧链接）
  async redirects() {
    return [
      // 示例：重定向旧的URL结构到新的
      // {
      //   source: '/old-path/:slug',
      //   destination: '/post/:slug',
      //   permanent: true,
      // },
    ];
  },

  // 启用gzip压缩
  compress: true,

  // 输出配置
  output: "standalone",

  // PoweredBy头部移除（安全考虑）
  poweredByHeader: false,

  // 生成ETag（缓存优化）
  generateEtags: true,

  // 页面扩展名
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // Webpack配置优化
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加分析器（仅在生产环境）
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
