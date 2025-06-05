import { NextResponse } from "next/server";

export async function GET() {
  // Google AdSense ads.txt 内容
  const adsTxt = `google.com, pub-1911238866563211, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(adsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
