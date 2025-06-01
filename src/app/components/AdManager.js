"use client";

import { useEffect, useState } from "react";

// 广告配置 - blog_1专用
export const AD_CONFIG = {
  // Native Banner 配置
  NATIVE: {
    SCRIPT_URL:
      "//traverseseven.com/700ea3e86e07b32845dc284c7138afa9/invoke.js",
    CONTAINER_ID: "container-700ea3e86e07b32845dc284c7138afa9",
    SCRIPT_ID: "traverse-seven-native-script-blog1",
  },
  // Popunder 配置 (从后台获取)
  POPUNDER: {
    SCRIPT_URL: "//traverseseven.com/POPUNDER_ID/invoke.js", // 需要替换为实际ID
    CONTAINER_ID: "container-POPUNDER_ID",
    SCRIPT_ID: "traverse-seven-popunder-script-blog1",
  },
};

// 违规内容关键词检测
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

// 广告内容监控函数
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
  adType = "native",
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

    // 加载对应的广告脚本
    loadAdScript(adType);
  }, [adType]);

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

  // 开发环境显示
  if (isDevelopment) {
    return (
      <div className={`ad-wrapper ${className}`}>
        {showLabel && (
          <div className="ad-label">
            <div className="ad-label-inner">
              <span className="ad-label-text">
                💰 Sponsored Content ({adType} - {position}) - DEV MODE
              </span>
            </div>
          </div>
        )}

        <div className="ad-container-dev">
          <div className="ad-dev-content">
            <div className="ad-dev-icon">
              <span>📱</span>
            </div>
            <p className="ad-dev-title">
              {adType.toUpperCase()} Ad - {position} position
            </p>
            <p className="ad-dev-subtitle">
              Development Environment - Content Filtering Active
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 错误处理
  if (hasError || isBlocked) {
    return null; // 静默失败，不影响用户体验
  }

  // 只渲染 Native Banner（Popunder 是自动的）
  if (adType === "popunder") {
    return null; // Popunder 不需要容器
  }

  // 根据尺寸调整样式类
  const sizeClass = `ad-size-${size}`;
  const positionClass = `ad-position-${position}`;

  return (
    <div className={`ad-wrapper ${className} ${positionClass}`}>
      {showLabel && (
        <div className="ad-label">
          <div className="ad-label-inner">
            <span className="ad-label-text">💰 Sponsored Content</span>
          </div>
        </div>
      )}

      <div className={`ad-container ${containerClass} ${sizeClass}`}>
        <div id={AD_CONFIG.NATIVE.CONTAINER_ID} className="ad-content">
          {!isLoaded && (
            <div className="ad-loading">
              <div className="ad-loading-inner">
                <div className="ad-loading-dots">
                  <div className="ad-loading-dot"></div>
                  <div className="ad-loading-dot"></div>
                  <div className="ad-loading-dot"></div>
                </div>
                <p className="ad-loading-text">Loading sponsored content...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .ad-wrapper {
          width: 100%;
          margin: 0 auto;
        }

        .ad-position-top {
          margin-bottom: 2rem;
        }

        .ad-position-middle {
          margin: 2rem 0;
        }

        .ad-position-bottom {
          margin-top: 2rem;
        }

        .ad-position-sidebar {
          margin-bottom: 1.5rem;
        }

        .ad-position-footer {
          margin-top: 1.5rem;
        }

        .ad-label {
          text-align: center;
          margin-bottom: 1rem;
        }

        .ad-label-inner {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          background-color: rgba(243, 244, 246, 0.8);
          border: 1px solid rgba(229, 231, 235, 0.8);
          backdrop-filter: blur(8px);
        }

        .ad-label-text {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(107, 114, 128, 1);
        }

        .ad-container {
          background-color: white;
          border-radius: 1rem;
          border: 1px solid rgba(229, 231, 235, 1);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .ad-container:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .ad-content {
          width: 100%;
          display: block;
          text-align: center;
        }

        .ad-size-small .ad-content {
          min-height: 150px;
        }

        .ad-size-medium .ad-content {
          min-height: 200px;
        }

        .ad-size-large .ad-content {
          min-height: 300px;
        }

        .ad-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 4rem 0;
        }

        .ad-loading-inner {
          text-align: center;
        }

        .ad-loading-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .ad-loading-dot {
          width: 0.75rem;
          height: 0.75rem;
          background-color: rgba(96, 165, 250, 1);
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .ad-loading-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .ad-loading-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        .ad-loading-text {
          font-size: 0.875rem;
          color: rgba(107, 114, 128, 1);
          margin: 0;
        }

        .ad-container-dev {
          background-color: rgba(239, 246, 255, 1);
          border-radius: 1rem;
          border: 1px solid rgba(191, 219, 254, 1);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
        }

        .ad-dev-content {
          text-align: center;
        }

        .ad-dev-icon {
          width: 3rem;
          height: 3rem;
          margin: 0 auto 0.75rem;
          background-color: rgba(219, 234, 254, 1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .ad-dev-title {
          font-size: 0.875rem;
          color: rgba(29, 78, 216, 1);
          margin: 0 0 0.25rem 0;
        }

        .ad-dev-subtitle {
          font-size: 0.75rem;
          color: rgba(37, 99, 235, 1);
          margin: 0;
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @media (prefers-color-scheme: dark) {
          .ad-label-inner {
            background-color: rgba(55, 65, 81, 0.8);
            border-color: rgba(75, 85, 99, 0.8);
          }

          .ad-label-text {
            color: rgba(156, 163, 175, 1);
          }

          .ad-container {
            background-color: rgba(31, 41, 55, 1);
            border-color: rgba(75, 85, 99, 1);
          }

          .ad-loading-text {
            color: rgba(156, 163, 175, 1);
          }

          .ad-container-dev {
            background-color: rgba(30, 58, 138, 0.2);
            border-color: rgba(59, 130, 246, 0.5);
          }

          .ad-dev-icon {
            background-color: rgba(30, 64, 175, 0.8);
          }

          .ad-dev-title {
            color: rgba(96, 165, 250, 1);
          }

          .ad-dev-subtitle {
            color: rgba(147, 197, 253, 1);
          }
        }
      `}</style>
    </div>
  );
}

// 简化版原生广告组件（向后兼容）
export function NativeAd({ className = "" }) {
  return (
    <AdManager
      adType="native"
      position="middle"
      className={className}
      showLabel={true}
      size="medium"
    />
  );
}
