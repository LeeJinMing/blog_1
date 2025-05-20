/**
 * Tag system module
 * Provides mapping between tag IDs and text, and related utility functions
 */

// Tag mapping table - ID to text
const tagMap = {
  tech: "Technology",
  ai: "AI",
  "future-trends": "Future Trends",
  politics: "Politics",
  economy: "Economy",
  business: "Business",
  finance: "Finance",
  market: "Market",
  trade: "Trade",
  enterprise: "Enterprise",
  international: "International",
  global: "Global",
  diplomacy: "Diplomacy",
  geopolitics: "Geopolitics",
  culture: "Culture",
  society: "Society",
  arts: "Arts",
  education: "Education",
  lifestyle: "Lifestyle",
  innovation: "Innovation",
  technology: "Technology",
  digital: "Digital",
  government: "Government",
  election: "Election",
  policy: "Policy",
};

// Reverse mapping table - text to ID
const reverseTagMap = Object.entries(tagMap).reduce((acc, [id, text]) => {
  acc[text] = id;
  return acc;
}, {});

/**
 * Get tag text by tag ID
 * @param {string} tagId - Tag ID
 * @returns {string} - Tag text, or original ID if not found
 */
export function getTagTextById(tagId) {
  return tagMap[tagId] || tagId;
}

/**
 * Get tag ID by tag text
 * @param {string} tagText - Tag text
 * @returns {string} - Tag ID, or generate one based on text if not found
 */
export function getTagIdByText(tagText) {
  // If exists in mapping table, return directly
  if (reverseTagMap[tagText]) {
    return reverseTagMap[tagText];
  }

  // Otherwise, generate an ID based on text (convert to lowercase, replace non-alphanumeric chars with hyphens)
  return tagText
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * Convert an array of tag IDs to an array of tag texts
 * @param {string[]} tagIds - Array of tag IDs
 * @returns {string[]} - Array of tag texts
 */
export function convertTagIdsToTexts(tagIds) {
  if (!tagIds || !Array.isArray(tagIds)) return [];
  return tagIds.map((id) => getTagTextById(id));
}

/**
 * Convert an array of tag texts to an array of tag IDs
 * @param {string[]} tagTexts - Array of tag texts
 * @returns {string[]} - Array of tag IDs
 */
export function convertTagTextsToIds(tagTexts) {
  if (!tagTexts || !Array.isArray(tagTexts)) return [];
  return tagTexts.map((text) => getTagIdByText(text));
}

/**
 * Get all available tags
 * @returns {Array<{id: string, text: string}>} - Array of tags
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
