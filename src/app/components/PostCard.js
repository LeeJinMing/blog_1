"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import styles from "./PostCard.module.css";

// 估算阅读时间
function calculateReadTime(content) {
  if (!content) return 1;
  const words = String(content).trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// 获取摘要
function getExcerpt(content, maxLength = 150) {
  if (!content) return "No summary available...";
  const cleanContent = String(content)
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim();

  if (cleanContent.length <= maxLength) return cleanContent;
  return cleanContent.substring(0, maxLength).trim() + "...";
}

export default function PostCard({ post }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!post) {
    return null;
  }

  // 格式化日期和URL
  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const getUrlSafeSlug = (slug) => {
    try {
      return slug.replace(/[^\w-]/g, (char) => encodeURIComponent(char));
    } catch (e) {
      return slug;
    }
  };

  const yyyymmdd = formatDateToYYYYMMDD(post.createdAt);
  const safeSlug = getUrlSafeSlug(post.slug);
  const postUrl = `/posts/${yyyymmdd}/${safeSlug}`;
  const formattedDate = dayjs(post.createdAt).format("MMMM D, YYYY");
  const readTime = calculateReadTime(post.content);
  const excerpt = post.summary || getExcerpt(post.content);

  return (
    <article className={styles.postCard}>
      <Link href={postUrl} className={styles.postLink}>
        {/* 左侧图片区域 */}
        <div className={styles.imageContainer}>
          <div
            className={styles.coverImage}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: "bold",
              textAlign: "center",
              padding: "1rem",
              height: "100%",
              width: "100%",
            }}
          >
            {post.title}
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div className={styles.content}>
          <header className={styles.header}>
            <h2 className={styles.title}>{post.title}</h2>

            <div className={styles.meta}>
              <time className={styles.date}>📅 {formattedDate}</time>
              <span className={styles.readTime}>⏱️ {readTime} min read</span>
            </div>
          </header>

          <div className={styles.excerpt}>{excerpt}</div>

          <footer className={styles.footer}>
            <span className={styles.readMore}>Read More →</span>

            {isClient && (
              <button className={styles.likeButton}>
                <span className={styles.heartIcon}>🤍</span>
                <span className={styles.likeCount}>0</span>
              </button>
            )}
          </footer>
        </div>
      </Link>
    </article>
  );
}
