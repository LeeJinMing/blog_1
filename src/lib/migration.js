/**
 * 标签系统迁移工具
 * 用于将现有文章的标签文本转换为标签ID
 */

import { convertTagTextsToIds, getTagIdByText } from "./tags";

/**
 * 将现有文章数据中的标签文本转换为标签ID
 * @param {Array} posts - 文章数组
 * @returns {Array} - 转换后的文章数组
 */
export function migratePostsToTagIds(posts) {
  if (!posts || !Array.isArray(posts)) return [];

  return posts.map((post) => {
    // 如果文章已经有tagIds字段，且没有tags字段或tags字段为空，则不需要迁移
    if (post.tagIds && (!post.tags || post.tags.length === 0)) {
      return post;
    }

    // 如果文章有tags字段，则将其转换为tagIds
    if (post.tags && post.tags.length > 0) {
      const tagIds = convertTagTextsToIds(post.tags);
      return {
        ...post,
        tagIds,
        tags: post.tags, // 保留原始标签文本以兼容旧代码
      };
    }

    // 如果文章既没有tagIds也没有tags，则返回原始文章
    return post;
  });
}

/**
 * 将单篇文章的标签文本转换为标签ID
 * @param {Object} post - 文章对象
 * @returns {Object} - 转换后的文章对象
 */
export function migratePostToTagIds(post) {
  if (!post) return post;

  // 如果文章已经有tagIds字段，且没有tags字段或tags字段为空，则不需要迁移
  if (post.tagIds && (!post.tags || post.tags.length === 0)) {
    return post;
  }

  // 如果文章有tags字段，则将其转换为tagIds
  if (post.tags && post.tags.length > 0) {
    const tagIds = convertTagTextsToIds(post.tags);
    return {
      ...post,
      tagIds,
      tags: post.tags, // 保留原始标签文本以兼容旧代码
    };
  }

  // 如果文章既没有tagIds也没有tags，则返回原始文章
  return post;
}

/**
 * 将标签ID转换回标签文本（用于兼容旧代码）
 * @param {Object} post - 文章对象
 * @returns {Object} - 转换后的文章对象
 */
export function ensurePostHasTagTexts(post) {
  if (!post) return post;

  // 如果文章有tagIds字段，但没有tags字段，则将tagIds转换为tags
  if (
    post.tagIds &&
    post.tagIds.length > 0 &&
    (!post.tags || post.tags.length === 0)
  ) {
    const tags = post.tagIds.map((tagId) => getTagTextById(tagId));
    return {
      ...post,
      tags,
    };
  }

  return post;
}

export default {
  migratePostsToTagIds,
  migratePostToTagIds,
  ensurePostHasTagTexts,
};
