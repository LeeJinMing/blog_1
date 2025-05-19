"use client";

import { useRouter } from "next/navigation";
import { trackTagClick } from "@/lib/analytics";
import styles from "./TagTracker.module.css";

/**
 * 带有点击跟踪功能的标签组件
 * @param {Object} props
 * @param {string} props.tag - 标签文本
 * @param {string} props.className - 可选的额外CSS类名
 * @param {boolean} props.showCount - 是否显示文章计数（如果提供）
 * @param {number} props.count - 标签对应的文章计数
 */
const TagTracker = ({ tag, className = "", showCount = false, count }) => {
  const router = useRouter();

  // 处理标签点击
  const handleClick = (e) => {
    e.preventDefault();

    // 跟踪标签点击
    trackTagClick(tag);

    // 导航到标签页
    router.push(`/tags/${encodeURIComponent(tag)}`);
  };

  return (
    <a
      href={`/tags/${encodeURIComponent(tag)}`}
      onClick={handleClick}
      className={`${styles.tag} ${className}`}
    >
      {tag}
      {showCount && count !== undefined && (
        <span className={styles.count}>({count})</span>
      )}
    </a>
  );
};

export default TagTracker;
