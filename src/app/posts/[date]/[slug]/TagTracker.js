"use client";

import { trackTagClick } from "@/lib/analytics";

/**
 * 可跟踪点击的标签组件
 */
export default function TagTracker({ tag, className }) {
  const handleClick = () => {
    trackTagClick(tag);
  };

  return (
    <span
      className={className}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {tag}
    </span>
  );
}
