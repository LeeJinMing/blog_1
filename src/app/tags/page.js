import Link from "next/link";
import { FaTag, FaHashtag, FaNewspaper } from "react-icons/fa";
import { getAllTags } from "../../lib/tags";
import styles from "./tags.module.css";

export const metadata = {
  title: "Tag Cloud - Blog Tag Navigation",
  description: "Browse all article tags to discover more interesting content",
};

// 设置页面重新验证间隔 - 2小时
export const revalidate = 7200;

export default function TagsPage() {
  // 直接使用静态标签数据，避免数据库查询
  const tags = getAllTags();

  return (
    <div className={styles.tagsPage}>
      {/* 顶部广告 */}
      <div className={styles.topAdContainer}>
        {/* ClientAdPlaceholder removed */}
      </div>

      <header className={styles.pageHeader}>
        <h1>Tag Cloud</h1>
        <p className={styles.subtitle}>Browse articles by topic</p>
      </header>

      <div className={styles.tagCloudContainer}>
        {tags.length === 0 ? (
          <p className={styles.noTags}>No tag data available</p>
        ) : (
          <div className={styles.tagCloud}>
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/category/${encodeURIComponent(tag.id)}`}
                className={styles.tagItem}
              >
                {tag.text}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 中间广告 */}
      <div className={styles.midAdContainer}>
        {/* ClientAdPlaceholder removed */}
      </div>

      {/* 底部链接区域 */}
      <div className={styles.bottomLinks}>
        <h2>Explore More Content</h2>
        <div className={styles.linksGrid}>
          <Link href="/" className={styles.featureLink}>
            <span className={styles.linkIcon}>📰</span>
            <div className={styles.linkText}>
              <h3>Latest Articles</h3>
              <p>View newly published content</p>
            </div>
          </Link>

          <Link href="/categories" className={styles.featureLink}>
            <span className={styles.linkIcon}>📂</span>
            <div className={styles.linkText}>
              <h3>Categories</h3>
              <p>Browse by topic</p>
            </div>
          </Link>

          <Link href="/about" className={styles.featureLink}>
            <span className={styles.linkIcon}>ℹ️</span>
            <div className={styles.linkText}>
              <h3>About Us</h3>
              <p>Learn more</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 底部广告 */}
      <div className={styles.bottomAdContainer}>
        {/* ClientAdPlaceholder removed */}
      </div>
    </div>
  );
}
