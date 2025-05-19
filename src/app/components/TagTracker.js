"use client";

import { useRouter } from "next/navigation";
import { trackTagClick } from "@/lib/analytics";
import { getTagTextById } from "@/lib/tags";
import styles from "./TagTracker.module.css";

// 标签到分类的映射关系
const tagToCategory = {
  // 可以根据实际情况添加更多映射
  politics: "politics-diplomacy",
  diplomacy: "politics-diplomacy",
  government: "politics-diplomacy",
  election: "politics-diplomacy",
  policy: "politics-diplomacy",

  economy: "business-economy",
  finance: "business-economy",
  business: "business-economy",
  market: "business-economy",
  trade: "business-economy",
  enterprise: "business-economy",

  tech: "tech-innovation",
  innovation: "tech-innovation",
  technology: "tech-innovation",
  digital: "tech-innovation",
  ai: "tech-innovation",
  "future-trends": "tech-innovation",

  international: "international-relations",
  global: "international-relations",
  geopolitics: "international-relations",

  culture: "culture-society",
  society: "culture-society",
  arts: "culture-society",
  education: "culture-society",
  lifestyle: "culture-society",
};

// 根据标签ID获取适当的分类
function getCategorySlugForTag(tagId) {
  return tagToCategory[tagId] || "culture-society";
}

/**
 * 带有点击跟踪功能的标签组件
 * @param {Object} props
 * @param {string} props.tagId - 标签ID
 * @param {string} props.className - 可选的额外CSS类名
 * @param {boolean} props.showCount - 是否显示文章计数（如果提供）
 * @param {number} props.count - 标签对应的文章计数
 */
const TagTracker = ({ tagId, className = "", showCount = false, count }) => {
  const router = useRouter();
  const tagText = getTagTextById(tagId);
  const categorySlug = getCategorySlugForTag(tagId);

  // 处理标签点击
  const handleClick = (e) => {
    e.preventDefault();

    // 跟踪标签点击
    trackTagClick(tagId, tagText);

    // 导航到分类页面
    router.push(`/category/${categorySlug}`);
  };

  return (
    <a
      href={`/category/${categorySlug}`}
      onClick={handleClick}
      className={`${styles.tag} ${className}`}
      title={tagText}
    >
      {tagText}
      {showCount && count !== undefined && (
        <span className={styles.count}>({count})</span>
      )}
    </a>
  );
};

export default TagTracker;
