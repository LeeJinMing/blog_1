const https = require("https");

const urls = [
  "https://blog-1-seven-pi.vercel.app/sitemap.xml",
  "https://blog-1-seven-pi.vercel.app/sitemap.xml/",
  "https://blog-1-seven-pi.vercel.app/sitemap",
  "https://blog-1-seven-pi.vercel.app/",
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          url: url,
          status: res.statusCode,
          contentType: res.headers["content-type"],
          redirect: res.headers["location"],
          size: data.length,
        });
      });
    });

    req.on("error", (err) => {
      resolve({
        url: url,
        status: "ERROR",
        error: err.message,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url: url,
        status: "TIMEOUT",
      });
    });
  });
}

async function main() {
  console.log("🔍 Testing URL variations...\n");

  for (const url of urls) {
    const result = await testUrl(url);
    console.log(`URL: ${result.url}`);
    console.log(`Status: ${result.status}`);
    if (result.contentType) console.log(`Content-Type: ${result.contentType}`);
    if (result.redirect) console.log(`Redirect to: ${result.redirect}`);
    if (result.size) console.log(`Size: ${result.size} bytes`);
    if (result.error) console.log(`Error: ${result.error}`);
    console.log("-".repeat(60));
  }
}

main();
