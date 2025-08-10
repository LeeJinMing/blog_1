"use client";

import { useEffect } from "react";

/**
 * 简化的Google AdSense广告组件
 * 只用于展示Google AdSense Auto Ads
 * 注意：不调用adsbygoogle.push({})，因为layout中已有enable_page_level_ads配置
 */
export default function ClientAdPlaceholder({
  size = "leaderboard",
  position = "header",
  showLabel = true,
}) {
  // 移除useEffect中的adsbygoogle.push调用
  // 因为在layout.js中已经有enable_page_level_ads配置
  // Google AdSense Auto Ads会自动处理广告展示

  // 根据尺寸设置广告单元的样式
  const adSizes = {
    rectangle: { width: "300px", height: "250px" },
    leaderboard: { width: "728px", height: "90px" },
    banner: { width: "468px", height: "60px" },
    skyscraper: { width: "160px", height: "600px" },
    mobile: { width: "100%", height: "100px" },
  };

  const { width, height } = adSizes[size] || adSizes.rectangle;

  return (
    <div className={`ad-container ad-${position}`} style={{ margin: "20px 0" }}>
      {showLabel && (
        <div
          className="ad-label"
          style={{
            fontSize: "12px",
            color: "#666",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Advertisement
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width,
          height,
          backgroundColor: "transparent",
        }}
        data-ad-client="ca-pub-1911238866563211"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
