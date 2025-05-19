/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // 添加 webpack 配置，处理 MongoDB 模块依赖
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端构建时，用空对象替代 Node.js 模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        "fs/promises": false,
        child_process: false,
      };
    }
    return config;
  },

  // 使用正确格式的Turbopack配置
  // 在Turbopack中，我们不使用alias禁用模块
  // 而是依赖于webpack配置处理这些Node.js模块
};

module.exports = nextConfig;
