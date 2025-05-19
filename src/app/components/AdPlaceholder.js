"use client";

import { useState } from "react";
import styles from "./AdPlaceholder.module.css";

/**
 * 广告占位符组件 - 可以在将来轻松替换为实际广告代码
 * @param {Object} props
 * @param {string} props.size - 广告尺寸: 'rectangle'(300x250), 'leaderboard'(728x90), 'banner'(468x60), 'skyscraper'(160x600)
 * @param {string} props.position - 广告位置: 'sidebar', 'in-article', 'header', 'footer'
 * @param {string} props.label - 是否显示"广告"标签
 * @param {Array} props.theme - 占位符颜色主题: 'light', 'dark', 'brand'
 */
export default function AdPlaceholder({
  size = "rectangle",
  position = "in-article",
  showLabel = true,
  theme = "light",
}) {
  // 添加状态表示该位置的广告是否可用
  const [isAvailable, setIsAvailable] = useState(true);

  // 根据尺寸确定占位符的宽高
  const dimensions = {
    rectangle: { width: 300, height: 250 },
    leaderboard: { width: 728, height: 90 },
    banner: { width: 468, height: 60 },
    skyscraper: { width: 160, height: 600 },
    mobile: { width: "100%", height: 100 },
  };

  const { width, height } = dimensions[size] || dimensions.rectangle;

  // 如果该位置没有广告可用，显示空白或返回null
  if (!isAvailable) return null;

  return (
    <div
      className={`${styles.adPlaceholder} ${styles[size]} ${styles[theme]} ${styles[position]}`}
      style={{ width, height }}
      role="complementary"
      aria-label="Advertisement placeholder"
    >
      {showLabel && <span className={styles.adLabel}>广告位</span>}
      <div className={styles.adContent}>
        <div className={styles.adInfo}>
          <p>广告位展示区</p>
          <p className={styles.adSize}>
            {typeof width === "number" ? `${width}×${height}` : "自适应"}
          </p>
        </div>
      </div>
    </div>
  );
}
