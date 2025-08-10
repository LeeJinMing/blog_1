#!/usr/bin/env node

/**
 * 本地测试 sitemap 生成功能
 * 用于排查网站地图生成问题
 */

const path = require("path");
const { pathToFileURL } = require("url");
require("dotenv").config({ path: ".env.local" });

async function testSitemap() {
  console.log("🔍 开始测试 sitemap 生成...\n");

  // 检查环境变量
  console.log("📋 环境变量检查:");
  console.log(
    "- NEXT_PUBLIC_BASE_URL:",
    process.env.NEXT_PUBLIC_BASE_URL || "未设置"
  );
  console.log("- VERCEL_URL:", process.env.VERCEL_URL || "未设置");
  console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "已设置" : "未设置");
  console.log(
    "- MONGO_REMOTE_URL:",
    process.env.MONGO_REMOTE_URL ? "已设置" : "未设置"
  );
  console.log("");

  try {
    // 使用正确的文件URL格式导入 sitemap 函数
    const sitemapPath = path.join(process.cwd(), "src", "app", "sitemap.js");
    const sitemapFileUrl = pathToFileURL(sitemapPath).href;
    console.log("📁 导入路径:", sitemapPath);
    console.log("📁 文件URL:", sitemapFileUrl);

    const sitemapModule = await import(sitemapFileUrl);
    const sitemap = sitemapModule.default;

    console.log("⚡ 生成 sitemap...");
    const startTime = Date.now();

    const urls = await sitemap();

    const endTime = Date.now();
    console.log(`✅ Sitemap 生成成功! (耗时: ${endTime - startTime}ms)`);
    console.log(`📊 共生成 ${urls.length} 个URL\n`);

    // 分析URL类型
    const urlTypes = {
      static: 0,
      posts: 0,
      categories: 0,
      other: 0,
    };

    urls.forEach((url) => {
      if (url.url.includes("/posts/")) {
        urlTypes.posts++;
      } else if (url.url.includes("/category/")) {
        urlTypes.categories++;
      } else if (url.url.match(/\/(about|archives|tags|search|)$/)) {
        urlTypes.static++;
      } else {
        urlTypes.other++;
      }
    });

    console.log("📈 URL 类型分布:");
    console.log(`- 静态页面: ${urlTypes.static}`);
    console.log(`- 文章页面: ${urlTypes.posts}`);
    console.log(`- 分类页面: ${urlTypes.categories}`);
    console.log(`- 其他页面: ${urlTypes.other}`);
    console.log("");

    // 显示前几个URL作为示例
    console.log("🔗 示例 URLs (前10个):");
    urls.slice(0, 10).forEach((url, index) => {
      console.log(`${index + 1}. ${url.url}`);
      console.log(`   - 最后修改: ${url.lastModified}`);
      console.log(`   - 优先级: ${url.priority}`);
      console.log(`   - 更新频率: ${url.changeFrequency}`);
      console.log("");
    });

    // 验证URL格式
    console.log("🔍 URL 格式验证:");
    let validUrls = 0;
    let invalidUrls = 0;

    urls.forEach((url) => {
      try {
        new URL(url.url);
        validUrls++;
      } catch (error) {
        invalidUrls++;
        console.log(`❌ 无效URL: ${url.url}`);
      }
    });

    console.log(`✅ 有效URL: ${validUrls}`);
    console.log(`❌ 无效URL: ${invalidUrls}`);

    if (invalidUrls === 0) {
      console.log("\n🎉 所有 URL 格式都有效！");
    }

    // 模拟XML输出测试
    console.log("\n🔗 模拟 XML 输出测试:");
    const xmlUrls = urls
      .slice(0, 3)
      .map(
        (url) =>
          `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified.toISOString()}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
      )
      .join("\n");

    console.log(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
  <!-- ... 还有 ${urls.length - 3} 个 URL -->
</urlset>`);
  } catch (error) {
    console.error("❌ Sitemap 生成失败:");
    console.error("错误信息:", error.message);
    console.error("错误栈:", error.stack);
  }
}

// 运行测试
if (require.main === module) {
  testSitemap().catch(console.error);
}

module.exports = { testSitemap };
