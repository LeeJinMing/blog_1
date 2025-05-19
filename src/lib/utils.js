/**
 * 工具函数库
 * 提供格式化日期、URL处理等通用功能
 */

/**
 * 确保 slug 对 URL 友好
 * @param {string} slug - 原始slug
 * @returns {string} - URL安全的slug
 */
export function getUrlSafeSlug(slug) {
  if (!slug) return "";

  try {
    // 我们不想完全编码 slug，因为那样会使 URL 变得难看
    // 相反，我们只替换特定的问题字符
    let safeSlug = slug;

    // 替换非URL安全字符（保留连字符和字母数字）
    safeSlug = safeSlug.replace(/[^\w-]/g, (char) => {
      return encodeURIComponent(char);
    });

    return safeSlug;
  } catch (e) {
    console.error("Error normalizing slug:", e);
    // 出错时返回原始 slug
    return slug;
  }
}

/**
 * 将日期格式化为 YYYYMMDD 格式
 * @param {string|Date} dateString - 日期字符串或日期对象
 * @returns {string} - 格式化后的日期字符串
 */
export function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * 将日期格式化为本地化的字符串
 * @param {string|Date} dateString - 日期字符串或日期对象
 * @param {string} format - 输出格式 ('short', 'medium', 'long')
 * @returns {string} - 格式化后的日期字符串
 */
export function formatDate(dateString, format = "medium") {
  try {
    const date = new Date(dateString);

    const options = {
      short: { month: "numeric", day: "numeric", year: "numeric" },
      medium: { month: "short", day: "numeric", year: "numeric" },
      long: { month: "long", day: "numeric", year: "numeric" },
    };

    return new Intl.DateTimeFormat("zh-CN", options[format]).format(date);
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
}

/**
 * 计算两个日期之间的差距
 * @param {string|Date} dateA - 第一个日期
 * @param {string|Date} dateB - 第二个日期
 * @returns {number} - 天数差距
 */
export function daysBetween(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB || new Date());
  const diff = Math.abs(a - b);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * 格式化相对时间（如"3天前"）
 * @param {string|Date} date - 日期
 * @returns {string} - 相对时间字符串
 */
export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " 年前";
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " 个月前";
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " 天前";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " 小时前";
  }

  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " 分钟前";
  }

  return "刚刚";
}
