const https = require("https");

const SITEMAP_URL = "https://blog-1-seven-pi.vercel.app/sitemap.xml";

// 模拟不同的User-Agent
const userAgents = [
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Googlebot/2.1 (+http://www.google.com/bot.html)",
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.99 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
];

async function testWithUserAgent(userAgent) {
  return new Promise((resolve) => {
    const options = {
      hostname: "blog-1-seven-pi.vercel.app",
      path: "/sitemap.xml",
      method: "GET",
      headers: {
        "User-Agent": userAgent,
        Accept: "application/xml,text/xml,*/*",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          userAgent: userAgent.split(" ")[0],
          status: res.statusCode,
          contentType: res.headers["content-type"],
          cacheControl: res.headers["cache-control"],
          contentLength: res.headers["content-length"] || data.length,
          lastModified: res.headers["last-modified"],
          etag: res.headers["etag"],
          server: res.headers["server"],
          xPoweredBy: res.headers["x-powered-by"],
          dataSize: data.length,
          isXML: data.includes("<?xml") && data.includes("<urlset"),
          urlCount: (data.match(/<url>/g) || []).length,
        });
      });
    });

    req.on("error", (err) => {
      resolve({
        userAgent: userAgent.split(" ")[0],
        status: "ERROR",
        error: err.message,
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        userAgent: userAgent.split(" ")[0],
        status: "TIMEOUT",
      });
    });

    req.end();
  });
}

async function main() {
  console.log("🤖 Testing sitemap with different User-Agents...\n");
  console.log(`Target URL: ${SITEMAP_URL}\n`);

  for (let i = 0; i < userAgents.length; i++) {
    const userAgent = userAgents[i];
    console.log(`Test ${i + 1}: ${userAgent.split(" ")[0]}`);
    console.log("-".repeat(80));

    const result = await testWithUserAgent(userAgent);

    console.log(`Status: ${result.status}`);

    if (result.status === 200) {
      console.log(`✅ Content-Type: ${result.contentType}`);
      console.log(`📏 Content-Length: ${result.contentLength}`);
      console.log(`🔒 Cache-Control: ${result.cacheControl || "Not set"}`);
      console.log(`⏰ Last-Modified: ${result.lastModified || "Not set"}`);
      console.log(`🏷️ ETag: ${result.etag || "Not set"}`);
      console.log(`🖥️ Server: ${result.server || "Not set"}`);
      console.log(`📊 URLs in sitemap: ${result.urlCount}`);
      console.log(`✅ Valid XML: ${result.isXML ? "Yes" : "No"}`);

      if (result.xPoweredBy) {
        console.log(`⚡ X-Powered-By: ${result.xPoweredBy}`);
      }
    } else if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    }

    console.log("\n");

    // 添加延迟避免被限流
    if (i < userAgents.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("🎯 Summary:");
  console.log(
    "- If all tests show status 200 with valid XML, the sitemap is working correctly"
  );
  console.log(
    "- If Googlebot tests fail but others succeed, there might be user-agent specific issues"
  );
  console.log("- Check Google Search Console for any specific error messages");
}

main();
