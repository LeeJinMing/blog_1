"use client";

import dynamic from "next/dynamic";

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

  // 如果不显示广告，则返回null
  if (!shouldShowAds) {
    return null;
  }

  return (
    <AdPlaceholder
      size={size}
      position={position}
      showLabel={showLabel}
      theme={theme}
      id={id}
    />
  );
}
