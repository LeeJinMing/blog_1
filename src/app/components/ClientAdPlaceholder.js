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
  size,
  position,
  showLabel,
  theme,
}) {
  return (
    <AdPlaceholder
      size={size}
      position={position}
      showLabel={showLabel}
      theme={theme}
    />
  );
}
