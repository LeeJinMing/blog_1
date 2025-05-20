"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function AnalyticsWrapper() {
  const [analyticsReady, setAnalyticsReady] = useState(false);

  // Google Analytics ID从环境变量获取
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // 检查analytics是否加载完成
  useEffect(() => {
    const checkAnalytics = () => {
      if (typeof window !== "undefined" && window.va) {
        setAnalyticsReady(true);
        console.log("Vercel Analytics initialized");
      }
    };

    // 立即检查
    checkAnalytics();

    // 设置一个短暂的延迟再次检查，以防脚本延迟加载
    const timeout = setTimeout(checkAnalytics, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handleBeforeSend = (event) => {
    try {
      // 可以在这里自定义事件处理逻辑
      // 例如：添加自定义属性、过滤特定事件等
      if (process.env.NODE_ENV === "development") {
        console.log("Analytics event:", event);
      }
      return event;
    } catch (error) {
      console.error("Error in beforeSend handler:", error);
      // 即使处理出错，也返回原始事件以确保跟踪继续
      return event;
    }
  };

  return (
    <>
      {/* Google Analytics - 只有在有ID时才加载 */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {/* Vercel Analytics */}
      <Analytics
        mode="auto"
        debug={process.env.NODE_ENV === "development"}
        beforeSend={handleBeforeSend}
      />
    </>
  );
}
