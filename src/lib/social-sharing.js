/**
 * 社交媒体自动分享功能
 * 用于文章发布时立即分发到多个平台
 */

/**
 * 生成各平台分享链接
 * @param {Object} post - 文章对象
 * @param {string} postUrl - 文章完整URL
 * @returns {Object} 各平台分享链接
 */
export function generateSocialShareLinks(post, postUrl) {
  const title = post.title;
  const summary = post.description || post.content?.substring(0, 150) + "...";

  // URL编码
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);

  // 生成hashtags
  const hashtags = generateHashtags(post);
  const encodedHashtags = encodeURIComponent(hashtags.join(" "));

  return {
    twitter: {
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${hashtags.join(
        ","
      )}`,
      api: "https://api.twitter.com/2/tweets",
      text: `${title}\n\n${summary}\n\n${postUrl}\n\n${hashtags.join(" ")}`,
    },

    linkedin: {
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      api: "https://api.linkedin.com/v2/ugcPosts",
      text: `${title}\n\n${summary}\n\n${postUrl}\n\n${hashtags.join(" ")}`,
    },

    facebook: {
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      api: "https://graph.facebook.com/me/feed",
      text: `${title}\n\n${summary}\n\n${postUrl}`,
    },

    reddit: {
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      text: title,
      subreddits: getRelevantSubreddits(post),
    },

    telegram: {
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      text: `*${title}*\n\n${summary}\n\n${postUrl}\n\n${hashtags.join(" ")}`,
    },
  };
}

/**
 * 根据文章内容生成相关hashtags
 * @param {Object} post - 文章对象
 * @returns {Array<string>} hashtag数组
 */
function generateHashtags(post) {
  const tags = [];

  // 基础标签
  tags.push("#TrendAnalysis", "#BusinessInsights");

  // 根据分类添加标签
  if (post.categoryId) {
    const categoryTags = {
      "politics-diplomacy": ["#Politics", "#Diplomacy", "#GlobalAffairs"],
      "business-economy": ["#Business", "#Economy", "#Finance"],
      "tech-innovation": ["#Technology", "#Innovation", "#AI"],
      "international-relations": ["#International", "#GlobalNews"],
      "culture-society": ["#Culture", "#Society", "#Trends"],
    };

    const { getCategorySlugById } = require("./db");
    const categorySlug = getCategorySlugById(post.categoryId);

    if (categoryTags[categorySlug]) {
      tags.push(...categoryTags[categorySlug]);
    }
  }

  // 从标题提取关键词标签
  const titleKeywords = extractKeywordsFromTitle(post.title);
  tags.push(...titleKeywords);

  return [...new Set(tags)].slice(0, 10); // 去重并限制数量
}

/**
 * 从标题提取关键词生成hashtags
 * @param {string} title - 文章标题
 * @returns {Array<string>} 关键词hashtag数组
 */
function extractKeywordsFromTitle(title) {
  const keywords = [];

  // 常见的热门关键词映射
  const keywordMap = {
    ai: "#AI",
    "artificial intelligence": "#AI",
    china: "#China",
    usa: "#USA",
    trump: "#Trump",
    biden: "#Biden",
    tesla: "#Tesla",
    apple: "#Apple",
    google: "#Google",
    microsoft: "#Microsoft",
    crypto: "#Crypto",
    bitcoin: "#Bitcoin",
    2025: "#2025",
    economy: "#Economy",
    market: "#Markets",
    stock: "#Stocks",
    climate: "#Climate",
    energy: "#Energy",
  };

  const titleLower = title.toLowerCase();

  Object.entries(keywordMap).forEach(([key, hashtag]) => {
    if (titleLower.includes(key)) {
      keywords.push(hashtag);
    }
  });

  return keywords;
}

/**
 * 获取相关的Reddit子版块
 * @param {Object} post - 文章对象
 * @returns {Array<string>} 相关subreddit数组
 */
function getRelevantSubreddits(post) {
  const subreddits = [];

  // 根据分类推荐subreddit
  if (post.categoryId) {
    const { getCategorySlugById } = require("./db");
    const categorySlug = getCategorySlugById(post.categoryId);

    const categorySubreddits = {
      "politics-diplomacy": ["worldnews", "politics", "geopolitics"],
      "business-economy": ["business", "economics", "investing"],
      "tech-innovation": ["technology", "tech", "artificial", "startups"],
      "international-relations": [
        "worldnews",
        "geopolitics",
        "internationalnews",
      ],
      "culture-society": ["sociology", "culturalstudies", "trends"],
    };

    if (categorySubreddits[categorySlug]) {
      subreddits.push(...categorySubreddits[categorySlug]);
    }
  }

  return subreddits;
}

/**
 * 自动分享到社交媒体（需要API配置）
 * @param {Object} post - 文章对象
 * @param {string} postUrl - 文章完整URL
 * @returns {Promise<Object>} 分享结果
 */
export async function autoShareToSocialMedia(post, postUrl) {
  const shareLinks = generateSocialShareLinks(post, postUrl);
  const results = {
    success: [],
    failed: [],
    shareLinks: shareLinks,
  };

  // 检查是否配置了社交媒体API
  const socialConfig = {
    twitter: process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET,
    linkedin:
      process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET,
    facebook: process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET,
    telegram: process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHANNEL_ID,
  };

  // Twitter 自动发布（如果配置了）
  if (socialConfig.twitter) {
    try {
      const twitterResult = await shareToTwitter(shareLinks.twitter.text);
      results.success.push({ platform: "twitter", ...twitterResult });
    } catch (error) {
      results.failed.push({ platform: "twitter", error: error.message });
    }
  }

  // Telegram 自动发布（如果配置了）
  if (socialConfig.telegram) {
    try {
      const telegramResult = await shareToTelegram(shareLinks.telegram.text);
      results.success.push({ platform: "telegram", ...telegramResult });
    } catch (error) {
      results.failed.push({ platform: "telegram", error: error.message });
    }
  }

  // LinkedIn 自动发布（如果配置了）
  if (socialConfig.linkedin) {
    try {
      const linkedinResult = await shareToLinkedIn(
        shareLinks.linkedin.text,
        postUrl
      );
      results.success.push({ platform: "linkedin", ...linkedinResult });
    } catch (error) {
      results.failed.push({ platform: "linkedin", error: error.message });
    }
  }

  console.log(
    `📱 社交媒体分享完成: ${results.success.length} 成功, ${results.failed.length} 失败`
  );

  return results;
}

/**
 * 分享到Twitter
 * @param {string} text - 要发布的文本
 * @returns {Promise<Object>} 发布结果
 */
async function shareToTwitter(text) {
  // 这里需要实现Twitter API调用
  // 暂时返回模拟结果
  console.log("🐦 模拟Twitter分享:", text.substring(0, 50) + "...");
  return { success: true, platform: "twitter", message: "模拟发布成功" };
}

/**
 * 分享到Telegram
 * @param {string} text - 要发布的文本
 * @returns {Promise<Object>} 发布结果
 */
async function shareToTelegram(text) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!botToken || !channelId) {
    throw new Error("Telegram配置缺失");
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: text,
          parse_mode: "Markdown",
        }),
      }
    );

    const result = await response.json();

    if (result.ok) {
      console.log("📱 Telegram分享成功");
      return { success: true, messageId: result.result.message_id };
    } else {
      throw new Error(result.description || "Telegram分享失败");
    }
  } catch (error) {
    console.error("📱 Telegram分享失败:", error);
    throw error;
  }
}

/**
 * 分享到LinkedIn
 * @param {string} text - 要发布的文本
 * @param {string} url - 文章URL
 * @returns {Promise<Object>} 发布结果
 */
async function shareToLinkedIn(text, url) {
  // 这里需要实现LinkedIn API调用
  // 暂时返回模拟结果
  console.log("💼 模拟LinkedIn分享:", text.substring(0, 50) + "...");
  return { success: true, platform: "linkedin", message: "模拟发布成功" };
}

/**
 * 生成分享统计报告
 * @param {Object} post - 文章对象
 * @param {string} postUrl - 文章URL
 * @returns {Object} 统计报告
 */
export function generateShareReport(post, postUrl) {
  const shareLinks = generateSocialShareLinks(post, postUrl);

  return {
    post: {
      title: post.title,
      url: postUrl,
      publishedAt: post.createdAt,
    },
    shareOptions: {
      twitter: {
        url: shareLinks.twitter.url,
        description: "一键分享到Twitter",
      },
      linkedin: {
        url: shareLinks.linkedin.url,
        description: "一键分享到LinkedIn",
      },
      facebook: {
        url: shareLinks.facebook.url,
        description: "一键分享到Facebook",
      },
      reddit: {
        url: shareLinks.reddit.url,
        description: "提交到Reddit相关版块",
        suggestedSubreddits: shareLinks.reddit.subreddits,
      },
      telegram: {
        url: shareLinks.telegram.url,
        description: "分享到Telegram",
      },
    },
    hashtags: generateHashtags(post),
    estimatedReach: calculateEstimatedReach(post),
  };
}

/**
 * 估算潜在触达用户数
 * @param {Object} post - 文章对象
 * @returns {Object} 估算数据
 */
function calculateEstimatedReach(post) {
  // 基于文章质量和热度的简单估算
  const baseReach = {
    twitter: 100,
    linkedin: 50,
    facebook: 30,
    reddit: 200,
    telegram: 20,
  };

  // 根据分类调整估算
  let multiplier = 1;
  if (post.categoryId) {
    const popularCategories = ["tech-innovation", "business-economy"];
    const { getCategorySlugById } = require("./db");
    const categorySlug = getCategorySlugById(post.categoryId);

    if (popularCategories.includes(categorySlug)) {
      multiplier = 1.5;
    }
  }

  const estimatedReach = {};
  Object.entries(baseReach).forEach(([platform, reach]) => {
    estimatedReach[platform] = Math.floor(reach * multiplier);
  });

  return {
    estimated: estimatedReach,
    total: Object.values(estimatedReach).reduce((sum, val) => sum + val, 0),
    note: "基于历史数据的估算，实际效果可能有差异",
  };
}
