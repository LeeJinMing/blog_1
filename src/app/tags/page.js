import Link from "next/link";
import ClientAdPlaceholder from "@/app/components/ClientAdPlaceholder";
import { getAllTags } from "@/lib/tags";
import styles from "./tags.module.css";

export const metadata = {
  title: "标签云 - 博客标签导航",
  description: "浏览所有文章标签，发现更多感兴趣的内容",
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
        <ClientAdPlaceholder size="leaderboard" position="header" />
      </div>

      <header className={styles.pageHeader}>
        <h1>标签云</h1>
        <p className={styles.subtitle}>按照主题浏览文章</p>
      </header>

      <div className={styles.tagCloudContainer}>
        {tags.length === 0 ? (
          <p className={styles.noTags}>暂无标签数据</p>
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
        <ClientAdPlaceholder size="rectangle" position="in-content" />
      </div>

      {/* 底部链接区域 */}
      <div className={styles.bottomLinks}>
        <h2>探索更多内容</h2>
        <div className={styles.linksGrid}>
          <Link href="/" className={styles.featureLink}>
            <span className={styles.linkIcon}>📰</span>
            <div className={styles.linkText}>
              <h3>最新文章</h3>
              <p>查看最新发布的内容</p>
            </div>
          </Link>

          <Link href="/categories" className={styles.featureLink}>
            <span className={styles.linkIcon}>📂</span>
            <div className={styles.linkText}>
              <h3>内容分类</h3>
              <p>按主题分类浏览</p>
            </div>
          </Link>

          <Link href="/about" className={styles.featureLink}>
            <span className={styles.linkIcon}>ℹ️</span>
            <div className={styles.linkText}>
              <h3>关于我们</h3>
              <p>了解更多</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 底部广告 */}
      <div className={styles.bottomAdContainer}>
        <ClientAdPlaceholder size="leaderboard" position="footer" />
      </div>
    </div>
  );
}
