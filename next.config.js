/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基于blog2成功配置的关键设置
  poweredByHeader: false,
  trailingSlash: false,

  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // 添加安全和性能头
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "img-src 'self' https: data: blob:; default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https:; connect-src 'self' https:;",
          },
        ],
      },
      // 站点地图专用headers - 按技术规范要求
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // 覆盖全局CSP，确保GSC解析不受任何策略影响
          {
            key: "Content-Security-Policy",
            value: "default-src 'none'",
          },
        ],
      },
      // robots.txt专用headers
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
        ],
      },
      // RSS Feed headers
      {
        source: "/feed.xml",
        headers: [
          { key: "Content-Type", value: "application/rss+xml; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=1800, s-maxage=1800",
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
      // 图标路由专用headers - 防止与sitemap冲突
      {
        source: "/icon",
        headers: [
          {
            key: "Content-Type",
            value: "image/png",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
        ],
      },
      {
        source: "/apple-icon",
        headers: [
          {
            key: "Content-Type",
            value: "image/png",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
        ],
      },
    ];
  },

  // 简化的 webpack 配置
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端构建时，用空对象替代 Node.js 模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // MongoDB 兼容性 fallbacks
        dns: false,
        net: false,
        tls: false,
        fs: false,
        "fs/promises": false,
        child_process: false,
        "timers/promises": false,
        // 其他 Node.js 模块 fallbacks
        os: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        zlib: false,
      };
    }
    return config;
  },

  // 实验性功能
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
