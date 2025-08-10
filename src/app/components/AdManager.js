"use client";

import { useState, useEffect } from "react";

/**
 * 简化的广告管理器 - 只支持Google AdSense Auto Ads
 * Google AdSense Auto Ads会自动在页面中插入广告，无需手动配置
 */
export function AdManager({
  position = "middle",
  className = "",
  showLabel = true,
  size = "medium",
}) {
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // 检查是否为开发环境
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("localhost");

    setIsDevelopment(isDev);
  }, []);

  // 开发环境显示占位符
  if (isDevelopment) {
    return (
      <div
        className={`ad-container ${className}`}
        style={{
          margin: "20px 0",
          padding: "20px",
          border: "2px dashed #ddd",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div
          style={{
            color: "#666",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          💰 Google AdSense Auto Ads ({position}) - 开发模式
        </div>
        <div style={{ color: "#999", fontSize: "12px" }}>
          生产环境中，Google AdSense会自动在此位置显示广告
        </div>
      </div>
    );
  }

  // 生产环境 - Google AdSense Auto Ads会自动填充合适的位置
  return (
    <div className={`ad-wrapper ${className}`} style={{ margin: "20px 0" }}>
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
          广告
        </div>
      )}

      {/* Google AdSense Auto Ads占位区域 */}
      <div
        className="google-adsense-placeholder"
        style={{
          minHeight: size === "small" ? "100px" : "250px",
          width: "100%",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Google AdSense Auto Ads会自动在适当的位置插入广告 */}
      </div>
    </div>
  );
}

// 保持向后兼容的接口
export function NativeAd({ className = "" }) {
  return <AdManager className={className} position="native" />;
}

export default AdManager;
