"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

// Dynamic import of the AdPlaceholder component
const AdPlaceholder = dynamic(() => import("./AdPlaceholder"), {
  ssr: false,
  loading: () => <div style={{ height: "100px", width: "100%" }}></div>,
});

/**
 * Client component wrapper for AdPlaceholder
 */
export default function ClientAdPlaceholder({
  size = "leaderboard",
  position = "header",
  showLabel = true,
  theme = "default",
  id,
}) {
  // 检查是否应该显示广告
  // 通过环境变量控制广告显示
  const shouldShowAds = process.env.NEXT_PUBLIC_SHOW_ADS === "true";

  useEffect(() => {
    // 仅在客户端且允许显示广告时尝试加载AdSense广告
    if (shouldShowAds && typeof window !== "undefined") {
      try {
        // 若存在window.adsbygoogle则推送广告
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [shouldShowAds]);

  // 如果不显示广告，则返回null
  if (!shouldShowAds) {
    return null;
  }

  // 根据尺寸返回相应的AdSense广告单元
  const adSizes = {
    rectangle: { width: "300px", height: "250px" },
    leaderboard: { width: "728px", height: "90px" },
    banner: { width: "468px", height: "60px" },
    skyscraper: { width: "160px", height: "600px" },
    mobile: { width: "100%", height: "100px" },
  };

  const { width, height } = adSizes[size] || adSizes.rectangle;

  return (
    <div className={`ad-container ad-${position}`}>
      {showLabel && <div className="ad-label">广告</div>}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width, height }}
        data-ad-client="ca-pub-1911238866563211"
        data-ad-slot="1234567890" // 需要替换为您的实际广告单元ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
