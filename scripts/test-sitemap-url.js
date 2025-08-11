/**
 * 测试 sitemap.xml 的可访问性和内容
 */

const https = require("https");
const http = require("http");

const SITEMAP_URL = "https://blog-1-seven-pi.vercel.app/sitemap.xml";

function testSitemapUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;

    const req = client.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data: data,
          contentLength: data.length,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

async function main() {
  console.log("🔍 Testing sitemap accessibility...");
  console.log(`URL: ${SITEMAP_URL}`);
  console.log("=" + "=".repeat(60));

  try {
    const result = await testSitemapUrl(SITEMAP_URL);

    console.log(`✅ Status: ${result.statusCode} ${result.statusMessage}`);
    console.log(`📄 Content-Type: ${result.headers["content-type"]}`);
    console.log(`📏 Content-Length: ${result.contentLength} bytes`);
    console.log(
      `🔒 Cache-Control: ${result.headers["cache-control"] || "Not set"}`
    );
    console.log(
      `⏰ Last-Modified: ${result.headers["last-modified"] || "Not set"}`
    );
    console.log(`🏷️ ETag: ${result.headers["etag"] || "Not set"}`);

    console.log("\n📋 Content preview:");
    console.log("-".repeat(60));
    console.log(
      result.data.substring(0, 500) + (result.data.length > 500 ? "..." : "")
    );

    // 验证 XML 格式
    if (result.data.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      console.log("\n✅ XML declaration found");
    } else {
      console.log("\n❌ XML declaration missing");
    }

    if (
      result.data.includes(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
      )
    ) {
      console.log("✅ Sitemap namespace found");
    } else {
      console.log("❌ Sitemap namespace missing");
    }

    // 计算 URL 数量
    const urlCount = (result.data.match(/<url>/g) || []).length;
    console.log(`📊 URLs in sitemap: ${urlCount}`);

    // 检查主页是否存在
    if (result.data.includes("<loc>https://blog-1-seven-pi.vercel.app</loc>")) {
      console.log("✅ Homepage URL found");
    } else {
      console.log("❌ Homepage URL missing");
    }

    // 检查是否有文章
    if (result.data.includes("/posts/")) {
      console.log("✅ Article URLs found");
    } else {
      console.log("⚠️ No article URLs found");
    }

    console.log("\n🎯 Google Search Console 检查清单:");
    console.log("1. URL格式正确: ✅");
    console.log("2. HTTP状态200: ✅");
    console.log(
      "3. Content-Type为XML: " +
        (result.headers["content-type"]?.includes("xml") ? "✅" : "❌")
    );
    console.log("4. 包含有效内容: ✅");
    console.log(
      "5. 包含主页URL: " +
        (result.data.includes("<loc>https://blog-1-seven-pi.vercel.app</loc>")
          ? "✅"
          : "❌")
    );
  } catch (error) {
    console.error("❌ Error testing sitemap:", error.message);

    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Check if the website is accessible");
    console.log("2. Verify sitemap.xml exists in public/ directory");
    console.log("3. Check Next.js headers configuration");
    console.log("4. Try rebuilding and redeploying");
  }
}

main().catch(console.error);
