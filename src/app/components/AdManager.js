"use client";

import { useEffect, useState } from "react";

// ==========================================
// 🚫 第三方广告系统已禁用 - THIRD-PARTY ADS DISABLED
// ==========================================
// 注意：以下代码已被注释禁用，仅保留Google AdSense Auto Ads
// Note: The following code has been commented out, only Google AdSense Auto Ads remain active

/*
// 广告配置 - blog_1专用 - 已禁用
export const AD_CONFIG = {
  // Native Banner 配置 - 已禁用
  NATIVE: {
    SCRIPT_URL:
      "//traverseseven.com/700ea3e86e07b32845dc284c7138afa9/invoke.js",
    CONTAINER_ID: "container-700ea3e86e07b32845dc284c7138afa9",
    SCRIPT_ID: "traverse-seven-native-script-blog1",
  },
  // Popunder 配置 (从后台获取) - 已禁用
  POPUNDER: {
    SCRIPT_URL: "//traverseseven.com/POPUNDER_ID/invoke.js", // 需要替换为实际ID
    CONTAINER_ID: "container-POPUNDER_ID",
    SCRIPT_ID: "traverse-seven-popunder-script-blog1",
  },
};
*/

// ==========================================
// ✅ 仅使用Google AdSense Auto Ads
// ==========================================

// 违规内容关键词检测 - 保留用于Google AdSense内容合规
const BLOCKED_KEYWORDS = [
  // 赌博相关
  "casino",
  "gambling",
  "poker",
  "bet",
  "slots",
  "jackpot",
  "lottery",
  "blackjack",
  "roulette",
  "baccarat",
  "betting",
  "wager",
  // 成人约会相关
  "dating",
  "hookup",
  "singles",
  "meet girls",
  "find girls",
  "adult",
  "sexy",
  "hot girls",
  "beautiful girls",
  "meet women",
  "your area",
  // 加密货币赌博
  "btc casino",
  "crypto casino",
  "bitcoin gambling",
  "usdt casino",
];

// 广告内容监控函数 - 保留用于Google AdSense合规监控
const monitorAdContent = (containerId) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        const container = document.getElementById(containerId);
        if (container) {
          const adContent = container.textContent?.toLowerCase() || "";
          const adHtml = container.innerHTML?.toLowerCase() || "";

          // 检查是否包含违规关键词
          const hasBlockedContent = BLOCKED_KEYWORDS.some(
            (keyword) => adContent.includes(keyword) || adHtml.includes(keyword)
          );

          if (hasBlockedContent) {
            console.warn(
              "🚨 Blocked potentially violating ad content:",
              containerId
            );
            // 隐藏违规广告
            container.style.display = "none";
            // 记录违规事件
            if (typeof gtag !== "undefined") {
              gtag("event", "ad_violation_blocked", {
                ad_container: containerId,
                violation_type: "content_policy",
              });
            }
          }
        }
      }
    });
  });

  const container = document.getElementById(containerId);
  if (container) {
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  return observer;
};

export function AdManager({
  adType = "google_adsense", // 默认使用Google AdSense
  position = "middle",
  className = "",
  containerClass = "",
  showLabel = true,
  size = "medium",
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // 检查开发环境
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("localhost");

    setIsDevelopment(isDev);

    if (isDev) return;

    // 🚫 第三方广告加载已禁用
    // ✅ 现在只使用Google AdSense Auto Ads（在layout.js中配置）
    /*
    // 加载对应的广告脚本 - 已禁用
    loadAdScript(adType);
    */

    // ✅ Google AdSense Auto Ads会自动处理广告展示
    setIsLoaded(true);
  }, [adType]);

  /*
  // 🚫 第三方广告脚本加载函数 - 已禁用
  const loadAdScript = (type) => {
    if (type === "native" || type === "both") {
      loadScript(AD_CONFIG.NATIVE);
    }
    if (type === "popunder" || type === "both") {
      // Popunder 通常自动触发，不需要容器
      loadScript(AD_CONFIG.POPUNDER);
    }
  };

  const loadScript = (config) => {
    const existingScript = document.getElementById(config.SCRIPT_ID);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = config.SCRIPT_ID;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = config.SCRIPT_URL;

      script.onload = () => {
        setIsLoaded(true);
        setHasError(false);

        // 启动内容监控
        setTimeout(() => {
          const observer = monitorAdContent(config.CONTAINER_ID);

          // 定期检查广告内容
          const contentChecker = setInterval(() => {
            const container = document.getElementById(config.CONTAINER_ID);
            if (container && container.children.length > 0) {
              const content = container.textContent?.toLowerCase() || "";
              const hasViolation = BLOCKED_KEYWORDS.some((keyword) =>
                content.includes(keyword)
              );

              if (hasViolation) {
                setIsBlocked(true);
                container.style.display = "none";
                clearInterval(contentChecker);
              }
            }
          }, 2000);

          // 10秒后停止检查
          setTimeout(() => clearInterval(contentChecker), 10000);
        }, 1000);
      };

      script.onerror = () => {
        setHasError(true);
        setIsLoaded(false);
      };

      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  };
  */

  // 开发环境显示
  if (isDevelopment) {
    return (
      <div className={`ad-wrapper ${className}`}>
        {showLabel && (
          <div className="ad-label">
            <div className="ad-label-inner">
              <span className="ad-label-text">
                💰 Google AdSense Auto Ads ({position}) - DEV MODE
              </span>
            </div>
          </div>
        )}
        <div
          className={`ad-placeholder ${containerClass}`}
          style={{
            background: "linear-gradient(45deg, #f0f0f0, #e0e0e0)",
            minHeight: size === "small" ? "100px" : "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #ccc",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#666",
            margin: "20px 0",
          }}
        >
          🚫 Third-party ads disabled | ✅ Google AdSense Auto Ads only
        </div>
      </div>
    );
  }

  // 生产环境 - 现在只显示占位符，Google AdSense Auto Ads会自动填充
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

      {/* ✅ Google AdSense Auto Ads占位区域 */}
      <div
        className={`google-adsense-placeholder ${containerClass}`}
        style={{
          minHeight: size === "small" ? "100px" : "250px",
          width: "100%",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Google AdSense Auto Ads会自动在这个区域插入广告 */}
        <div
          style={{
            color: "#ccc",
            fontSize: "12px",
            opacity: 0.5,
          }}
        >
          {/* AdSense Auto Ads Space */}
        </div>
      </div>

      {/* 🚫 第三方广告容器已禁用 */}
      {/*
      <div id={adType === "native" ? AD_CONFIG.NATIVE.CONTAINER_ID : null}>
        {isBlocked && (
          <div className="blocked-ad-notice">
            ⚠️ 广告内容已被过滤 (违反内容政策)
          </div>
        )}
        {hasError && (
          <div className="ad-error-notice">
            ❌ 广告加载失败，请刷新页面重试
          </div>
        )}
      </div>
      */}
    </div>
  );
}

// ✅ 保留原有接口，但改为使用Google AdSense
export function NativeAd({ className = "" }) {
  return (
    <AdManager
      adType="google_adsense"
      position="content"
      size="medium"
      className={className}
      showLabel={true}
    />
  );
}
