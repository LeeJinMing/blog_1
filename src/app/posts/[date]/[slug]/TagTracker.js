"use client";

import { trackTagClick } from "@/lib/analytics";
import { getTagTextById } from "@/lib/tags";

/**
 * 可跟踪点击的标签组件
 */
export default function TagTracker({ tagId, className }) {
  const tagText = getTagTextById(tagId);

  const handleClick = () => {
    trackTagClick(tagId, tagText);
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
      title={tagText}
    >
      {tagText}
    </span>
  );
}
