/**
 * 标签系统模块
 * 提供标签ID和文本之间的映射关系以及相关的工具函数
 */

// 标签映射表 - ID 到文本
const tagMap = {
  tech: "科技",
  ai: "AI",
  "future-trends": "未来趋势",
  politics: "政治",
  economy: "经济",
  business: "商业",
  finance: "金融",
  market: "市场",
  trade: "贸易",
  enterprise: "企业",
  international: "国际",
  global: "全球",
  diplomacy: "外交",
  geopolitics: "地缘政治",
  culture: "文化",
  society: "社会",
  arts: "艺术",
  education: "教育",
  lifestyle: "生活方式",
  innovation: "创新",
  technology: "技术",
  digital: "数字",
  government: "政府",
  election: "选举",
  policy: "政策",
};

// 反向映射表 - 文本到ID
const reverseTagMap = Object.entries(tagMap).reduce((acc, [id, text]) => {
  acc[text] = id;
  return acc;
}, {});

/**
 * 根据标签ID获取标签文本
 * @param {string} tagId - 标签ID
 * @returns {string} - 标签文本，如果不存在则返回原ID
 */
export function getTagTextById(tagId) {
  return tagMap[tagId] || tagId;
}

/**
 * 根据标签文本获取标签ID
 * @param {string} tagText - 标签文本
 * @returns {string} - 标签ID，如果不存在则生成一个基于文本的ID
 */
export function getTagIdByText(tagText) {
  // 如果在映射表中存在，直接返回
  if (reverseTagMap[tagText]) {
    return reverseTagMap[tagText];
  }

  // 否则，生成一个基于文本的ID (将文本转换为小写，并替换非字母数字字符为连字符)
  return tagText
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * 将标签ID数组转换为标签文本数组
 * @param {string[]} tagIds - 标签ID数组
 * @returns {string[]} - 标签文本数组
 */
export function convertTagIdsToTexts(tagIds) {
  if (!tagIds || !Array.isArray(tagIds)) return [];
  return tagIds.map((id) => getTagTextById(id));
}

/**
 * 将标签文本数组转换为标签ID数组
 * @param {string[]} tagTexts - 标签文本数组
 * @returns {string[]} - 标签ID数组
 */
export function convertTagTextsToIds(tagTexts) {
  if (!tagTexts || !Array.isArray(tagTexts)) return [];
  return tagTexts.map((text) => getTagIdByText(text));
}

/**
 * 获取所有可用的标签
 * @returns {Array<{id: string, text: string}>} - 标签数组
 */
export function getAllTags() {
  return Object.entries(tagMap).map(([id, text]) => ({
    id,
    text,
  }));
}

export default {
  getTagTextById,
  getTagIdByText,
  convertTagIdsToTexts,
  convertTagTextsToIds,
  getAllTags,
};
