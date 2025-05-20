"use client";

import { useRouter } from "next/navigation";
import { trackTagClick } from "@/lib/analytics";
import { getTagTextById } from "@/lib/tags";
import styles from "./TagTracker.module.css";

// 额外的标签文本翻译（如果某些标签ID不在标准映射中）
const extraTagTranslations = {
  "valeria-marquez": "Valeria Marquez",
  kol: "Key Opinion Leader",
  "creator-economy": "Creator Economy",
  "influencer-marketing": "Influencer Marketing",
};

// 中英文双语显示的标签
const bilingualTags = {
  tech: "Technology 技术",
  ai: "AI 人工智能",
  "future-trends": "Future Trends 未来趋势",
  politics: "Politics 政治",
  economy: "Economy 经济",
  business: "Business 商业",
  finance: "Finance 金融",
  market: "Market 市场",
  trade: "Trade 贸易",
  enterprise: "Enterprise 企业",
  international: "International 国际",
  global: "Global 全球",
  diplomacy: "Diplomacy 外交",
  geopolitics: "Geopolitics 地缘政治",
  culture: "Culture 文化",
  society: "Society 社会",
  arts: "Arts 艺术",
  education: "Education 教育",
  lifestyle: "Lifestyle 生活方式",
  innovation: "Innovation 创新",
  technology: "Technology 技术",
  digital: "Digital 数字",
  government: "Government 政府",
  election: "Election 选举",
  policy: "Policy 政策",
  "valeria-marquez": "Valeria Marquez",
  kol: "Key Opinion Leader KOL",
  "creator-economy": "Creator Economy 创作者经济",
  "influencer-marketing": "Influencer Marketing 网红营销",
};

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

// 获取标签显示文本 - 同时支持中英文
function getTranslatedTagText(tagId) {
  // 首先尝试从双语映射获取
  if (bilingualTags[tagId]) {
    return bilingualTags[tagId];
  }

  // 尝试从标准映射获取
  const standardText = getTagTextById(tagId);

  // 如果标准文本不是标签ID本身，说明在标签映射中找到了对应文本
  if (standardText !== tagId) {
    return standardText;
  }

  // 如果在额外翻译中有对应，使用额外翻译
  if (extraTagTranslations[tagId]) {
    return extraTagTranslations[tagId];
  }

  // 尝试格式化标签ID作为显示文本
  return tagId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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
  const tagText = getTranslatedTagText(tagId);
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
