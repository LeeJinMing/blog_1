"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./EnhancedSidebar.module.css";
import { trackClick } from "@/lib/analytics";
import { getAllTags, getTagTextById } from "@/lib/tags";

// 热门文章数据，实际应用中可以从API获取
const popularPosts = [
  {
    id: "1",
    title: "人工智能如何改变我们的未来",
    slug: "20230801/how-ai-will-change-our-future",
    date: "2023-08-01",
    viewCount: 1250,
  },
  {
    id: "2",
    title: "全球经济趋势分析：2023年下半年展望",
    slug: "20230715/global-economy-trends-outlook-2023",
    date: "2023-07-15",
    viewCount: 980,
  },
  {
    id: "3",
    title: "可持续发展：企业社会责任的新趋势",
    slug: "20230620/sustainable-development-corporate-social-responsibility",
    date: "2023-06-20",
    viewCount: 780,
  },
];

// 标签数据，使用ID而不是文本
const defaultTags = [
  { id: "ai", count: 42 },
  { id: "economy", count: 38 },
  { id: "technology", count: 35 },
  { id: "investment", count: 29 },
  { id: "global-affairs", count: 26 },
  { id: "sustainable-development", count: 24 },
  { id: "innovation", count: 22 },
  { id: "finance", count: 21 },
  { id: "business-strategy", count: 18 },
  { id: "leadership", count: 17 },
  { id: "climate-change", count: 16 },
  { id: "trends", count: 15 },
];

const EnhancedSidebar = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [popularTags, setPopularTags] = useState(defaultTags);

  // 初始化时从标签系统获取标签
  useEffect(() => {
    // 获取所有标签并添加默认的计数
    const allTags = getAllTags().map((tag) => ({
      id: tag.id,
      text: tag.text,
      count: Math.floor(Math.random() * 40) + 10, // 随机计数，实际应用中应从API获取
    }));

    // 限制显示的标签数量
    setPopularTags(allTags.slice(0, 12));
  }, []);

  // 处理订阅表单提交
  const handleSubscribe = (e) => {
    e.preventDefault();
    setError("");

    // 验证电子邮件
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("请输入有效的电子邮件地址");
      return;
    }

    // 这里可以添加实际的API调用来处理订阅
    console.log("订阅电子邮件:", email);
    trackClick("subscribe-button", "subscription", email);

    // 模拟成功响应
    setSubscribed(true);
  };

  // 处理标签点击
  const handleTagClick = (tagId, tagText) => {
    trackClick(`tag-${tagId}`, "sidebar-tag", tagText);
  };

  // 处理文章点击
  const handleArticleClick = (postId, title) => {
    trackClick(`popular-post-${postId}`, "sidebar-popular-post", title);
  };

  return (
    <aside className={styles.sidebar}>
      {/* 订阅表单部分 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>订阅通讯</h3>
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
            <p className={styles.subscribeText}>
              获取最新的见解和分析，直接发送到您的收件箱
            </p>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="您的电子邮件"
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.subscribeButton}>
                订阅
              </button>
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
        ) : (
          <div className={styles.successMessage}>
            <p>
              <span className={styles.checkmark}>✓</span> 感谢您的订阅！
            </p>
            <p>我们已将确认邮件发送到您的邮箱。</p>
          </div>
        )}
      </section>

      {/* 热门文章部分 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>热门文章</h3>
        <ul className={styles.popularPostsList}>
          {popularPosts.map((post) => (
            <li key={post.id} className={styles.popularPostItem}>
              <Link
                href={`/posts/${post.slug}`}
                className={styles.popularPostLink}
                onClick={() => handleArticleClick(post.id, post.title)}
              >
                <span className={styles.popularPostTitle}>{post.title}</span>
                <div className={styles.popularPostMeta}>
                  <span className={styles.popularPostDate}>{post.date}</span>
                  <span className={styles.popularPostViews}>
                    {post.viewCount} 次阅读
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 标签云部分 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>探索话题</h3>
        <div className={styles.tagCloud}>
          {popularTags.map((tag) => {
            const tagText = tag.text || getTagTextById(tag.id);
            return (
              <Link
                key={tag.id}
                href={`/category/${encodeURIComponent(tag.id)}`}
                className={`${styles.tagItem} ${
                  styles[
                    `tagSize${Math.min(
                      5,
                      Math.max(1, Math.ceil(tag.count / 10))
                    )}`
                  ]
                }`}
                onClick={() => handleTagClick(tag.id, tagText)}
              >
                {tagText}
                <span className={styles.tagCount}>{tag.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 关于博客部分 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>关于本博客</h3>
        <div className={styles.aboutBlog}>
          <p>
            这个博客致力于提供深入的分析和前沿的见解，涵盖技术、商业和全球事务等领域。
          </p>
          <Link href="/about" className={styles.aboutLink}>
            了解更多 →
          </Link>
        </div>
      </section>
    </aside>
  );
};

export default EnhancedSidebar;
