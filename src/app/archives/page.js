import Link from "next/link";
import ClientAdPlaceholder from "@/app/components/ClientAdPlaceholder";
import { FaCalendarAlt, FaChartBar, FaClock } from "react-icons/fa";
import GlobalLayout from "@/app/components/GlobalLayout";
import styles from "./archives.module.css";
import { getPosts } from "@/lib/db";
import dayjs from "dayjs";

export const metadata = {
  title: "Article Archives | Insights Blog",
  description: "Browse our articles by publication date and timeline",
};

// 设置页面重新验证间隔 - 2小时
export const revalidate = 7200;

export default async function ArchivesPage() {
  // 获取所有文章
  const posts = await getPosts(500);

  // 按年份和月份对文章进行分组
  const archivesByYear = {};

  posts.forEach((post) => {
    const date = dayjs(post.createdAt);
    const year = date.format("YYYY");
    const month = date.format("MMMM"); // 完整月份名称

    if (!archivesByYear[year]) {
      archivesByYear[year] = {};
    }

    if (!archivesByYear[year][month]) {
      archivesByYear[year][month] = [];
    }

    archivesByYear[year][month].push(post);
  });

  // 获取年份并排序（降序）
  const years = Object.keys(archivesByYear).sort((a, b) => b - a);

  return (
    <GlobalLayout>
      <section className={styles.hero}>
        <h1>Article Archives</h1>
        <p className={styles.subtitle}>
          Browse our articles by publication date and timeline
        </p>
      </section>

      <div className={styles.archivesContainer}>
        {/* 顶部广告 */}
        <div className={styles.topAdContainer}>
          <ClientAdPlaceholder size="leaderboard" position="header" />
        </div>

        <div className={styles.archiveContent}>
          {years.length === 0 ? (
            <p className={styles.noArchives}>No archived articles available</p>
          ) : (
            <>
              {years.map((year) => (
                <div key={year} className={styles.yearSection}>
                  <h2 className={styles.yearHeading}>{year}</h2>

                  {Object.keys(archivesByYear[year]).map((month) => (
                    <div
                      key={`${year}-${month}`}
                      className={styles.monthSection}
                    >
                      <h3 className={styles.monthHeading}>
                        <FaCalendarAlt className={styles.monthIcon} />
                        {month}
                        <span className={styles.articleCount}>
                          ({archivesByYear[year][month].length} articles)
                        </span>
                      </h3>

                      <ul className={styles.articleList}>
                        {archivesByYear[year][month].map((post) => {
                          const date = dayjs(post.createdAt);
                          const formattedDate = date.format("YYYY-MM-DD");
                          const yyyymmdd = date.format("YYYYMMDD");

                          return (
                            <li key={post._id} className={styles.articleItem}>
                              <span className={styles.articleDate}>
                                {date.format("MMM DD")}
                              </span>
                              <Link
                                href={`/posts/${yyyymmdd}/${post.slug}`}
                                className={styles.articleLink}
                              >
                                {post.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>

        {/* 中间广告 */}
        <div className={styles.midAdContainer}>
          <ClientAdPlaceholder size="rectangle" position="in-content" />
        </div>

        {/* 底部链接区域 */}
        <div className={styles.bottomLinks}>
          <h2>Explore More Content</h2>
          <div className={styles.linksGrid}>
            <Link href="/" className={styles.featureLink}>
              <span className={styles.linkIcon}>
                <FaClock />
              </span>
              <div className={styles.linkText}>
                <h3>Latest Articles</h3>
                <p>View newly published content</p>
              </div>
            </Link>

            <Link href="/categories" className={styles.featureLink}>
              <span className={styles.linkIcon}>
                <FaChartBar />
              </span>
              <div className={styles.linkText}>
                <h3>Categories</h3>
                <p>Browse by topic</p>
              </div>
            </Link>

            <Link href="/tags" className={styles.featureLink}>
              <span className={styles.linkIcon}>
                <FaCalendarAlt />
              </span>
              <div className={styles.linkText}>
                <h3>Tags</h3>
                <p>Browse by tag</p>
              </div>
            </Link>
          </div>
        </div>

        {/* 底部广告 */}
        <div className={styles.bottomAdContainer}>
          <ClientAdPlaceholder size="leaderboard" position="footer" />
        </div>
      </div>
    </GlobalLayout>
  );
}
