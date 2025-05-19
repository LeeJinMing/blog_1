import { redirect } from "next/navigation";
import { getTagTextById } from "@/lib/tags";

// 标签到分类的映射关系
const tagToCategory = {
  // 可以根据实际情况添加更多映射
  政治: "politics-diplomacy",
  外交: "politics-diplomacy",
  经济: "business-economy",
  金融: "business-economy",
  商业: "business-economy",
  科技: "tech-innovation",
  创新: "tech-innovation",
  技术: "tech-innovation",
  AI: "tech-innovation",
  国际: "international-relations",
  全球: "international-relations",
  文化: "culture-society",
  社会: "culture-society",
  艺术: "culture-society",
  教育: "culture-society",
};

// 根据标签获取适当的分类
function getCategorySlugForTag(tagId) {
  // 获取标签文本
  const tagText = getTagTextById(tagId);

  // 遍历映射查找匹配
  for (const [key, value] of Object.entries(tagToCategory)) {
    if (tagText.includes(key)) {
      return value;
    }
  }

  // 默认返回第一个分类
  return "culture-society";
}

export default function TagRedirectPage({ params }) {
  const tagId = params.tagId;

  // 获取适当的分类
  const categorySlug = getCategorySlugForTag(tagId);

  // 重定向到分类页面
  redirect(`/category/${categorySlug}`);

  // 下面的代码永远不会执行，只是保留以便将来参考
  return null;
}
