/**
 * 检查 robots.txt 文件
 */

const https = require("https");

const ROBOTS_URL = "https://blog-1-seven-pi.vercel.app/robots.txt";

function testUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log("🤖 Checking robots.txt...");
  console.log(`URL: ${ROBOTS_URL}`);
  console.log("=" + "=".repeat(50));

  try {
    const result = await testUrl(ROBOTS_URL);

    console.log(`Status: ${result.statusCode}`);
    console.log(`Content-Type: ${result.headers["content-type"]}`);
    console.log("\nContent:");
    console.log("-".repeat(50));
    console.log(result.data);

    // 检查sitemap引用
    if (result.data.includes("sitemap.xml")) {
      console.log("\n✅ Sitemap reference found in robots.txt");
    } else {
      console.log("\n❌ No sitemap reference in robots.txt");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
