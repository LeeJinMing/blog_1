"use client";

import dynamic from "next/dynamic";

// Dynamic import of the ShareButtons component
const ShareButtons = dynamic(() => import("./ShareButtons"), {
  ssr: false,
});

/**
 * Client component wrapper for ShareButtons
 */
export default function ClientShareButtons({
  title,
  url,
  summary,
  showIcons,
  direction,
}) {
  return (
    <ShareButtons
      title={title}
      url={url}
      summary={summary}
      showIcons={showIcons}
      direction={direction}
    />
  );
}
