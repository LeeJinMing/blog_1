"use client";

import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import FallbackCover from "./FallbackCover";
import styles from "./PostCard.module.css";
import { getTagTextById } from "@/lib/tags";

// 添加标题翻译映射
const titleTranslations = {
  网红经济赋能者佳品: "Creator Economy Empowerment",
  现象与营销新纪元: "Phenomenon and New Era of Marketing",
  "网红经济赋能者佳品：Valeria Marquez现象与营销新纪元":
    "Creator Economy Empowerment: Valeria Marquez Phenomenon and New Era of Marketing",
};

// 翻译中文标题为英文
function translateTitle(title) {
  // 检查完整标题是否有翻译
  if (titleTranslations[title]) {
    return titleTranslations[title];
  }

  // 检查是否是带冒号的格式，分别翻译两部分
  if (title.includes("：") || title.includes(":")) {
    const separator = title.includes("：") ? "：" : ":";
    const parts = title.split(separator);

    const translatedParts = parts.map((part) => {
      const trimmedPart = part.trim();
      return titleTranslations[trimmedPart] || trimmedPart;
    });

    return translatedParts.join(": ");
  }

  return title;
}

// Estimate reading time (200 words per minute)
function calculateReadTime(content) {
  if (!content) return 1;
  // 确保内容是字符串类型
  const contentStr = String(content);
  const words = contentStr.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes); // Minimum 1 minute
}

// Generate article cover image
function getCoverImage(post) {
  // If the article has a specified cover image, use it
  if (post.coverImage) {
    return post.coverImage;
  }

  // Choose default cover based on tags or title
  const defaultImages = {
    Politics: "/images/covers/politics.svg",
    Economy: "/images/covers/economy.svg",
    Technology: "/images/covers/tech.svg",
    International: "/images/covers/international.svg",
    Society: "/images/covers/society.svg",
    default: "/images/covers/default.svg",
  };

  // Find matching tags
  if (post.tagIds && post.tagIds.length > 0) {
    for (const tagId of post.tagIds) {
      const tagText = getTagTextById(tagId);
      for (const [key, url] of Object.entries(defaultImages)) {
        if (tagText.includes(key)) {
          return url;
        }
      }
    }
  }

  // Find keywords in the title
  for (const [key, url] of Object.entries(defaultImages)) {
    if (post.title.includes(key)) {
      return url;
    }
  }

  // If no match, use default cover
  return defaultImages.default;
}

export default function PostCard({ post, showImage = true }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [useFallbackFormat, setUseFallbackFormat] = useState(false);

  // 初始化状态
  useEffect(() => {
    setIsClient(true);

    // 检查当前用户是否已点赞过该文章
    const cachedLiked = localStorage.getItem(`liked_${post._id}`);
    if (cachedLiked === "true") {
      setLiked(true);
    }

    // 从API获取文章点赞数据
    async function fetchLikes() {
      try {
        const response = await fetch(`/api/likes?id=${post._id}`);
        if (response.ok) {
          const data = await response.json();
          setLikeCount(data.likes);
        }
      } catch (error) {
        console.error("Failed to fetch likes:", error);
        // 如果获取失败，使用文章中的likes属性，如果没有则为0
        setLikeCount(post.likes || 0);
      }
    }

    fetchLikes();
  }, [post._id, post.likes]);

  // Handle image loading error
  const handleImageError = () => {
    if (!useFallbackFormat) {
      // If SVG fails to load, try JPG
      setUseFallbackFormat(true);
    } else {
      // If JPG also fails, set error state
      setImageError(true);
    }
  };

  // Get image URL, try JPG format if needed
  const getImageUrl = () => {
    let url = imageError
      ? getCoverImage({ ...post, title: "Failed" })
      : getCoverImage(post);

    // If fallback format is needed, replace SVG with JPG
    if (useFallbackFormat && url.endsWith(".svg")) {
      return url.replace(".svg", ".jpg");
    }

    return url;
  };

  // Format date and URL
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
      console.error("Error normalizing slug:", e);
      return slug;
    }
  };

  const yyyymmdd = formatDateToYYYYMMDD(post.createdAt);
  const safeSlug = getUrlSafeSlug(post.slug);
  const postUrl = `/posts/${yyyymmdd}/${safeSlug}`;
  const formattedDate = dayjs(post.createdAt).format("YYYY-MM-DD");
  const readTime = calculateReadTime(post.content);

  // 处理点赞操作
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!liked) {
      try {
        // 发送请求到点赞API
        const response = await fetch("/api/likes/increment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: post._id, slug: post.slug }),
        });

        if (response.ok) {
          const data = await response.json();
          // 更新UI状态
          setLiked(true);
          setLikeCount(data.likes);
          // 在localStorage中记录已点赞状态
          localStorage.setItem(`liked_${post._id}`, "true");
        }
      } catch (error) {
        console.error("Failed to like post:", error);
      }
    }
  };

  // Handle title, ensure title is not too long
  const formatTitle = (title) => {
    // If title is longer than 50 characters, truncate and add ellipsis
    if (title && title.length > 70) {
      return `${title.substring(0, 70)}...`;
    }
    return title;
  };

  // Only render full content on client
  if (!isClient) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <article className={styles.card}>
      {showImage && (
        <div className={styles.imageContainer}>
          <Link href={postUrl} className={styles.imageLink}>
            {imageError ? (
              // When all image loading fails, use fallback cover
              <FallbackCover
                title={post.title}
                category={post.tags?.[0] || "default"}
                width={800}
                height={400}
              />
            ) : (
              <Image
                src={getImageUrl()}
                alt={post.title}
                width={800}
                height={400}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={handleImageError}
                priority={true}
                unoptimized={true}
              />
            )}
          </Link>
        </div>
      )}

      <div className={styles.content}>
        <Link href={postUrl}>
          <h2 className={styles.title} title={post.title}>
            {formatTitle(translateTitle(post.title))}
          </h2>
        </Link>

        <div className={styles.meta}>
          <time
            dateTime={dayjs(post.createdAt).format("YYYY-MM-DD")}
            className={styles.date}
          >
            {formattedDate}
          </time>

          <div className={styles.readTime}>
            <span className={styles.icon}>⏱️</span>
            <span>{readTime} min read</span>
          </div>

          {post.views && (
            <div className={styles.views}>
              <span className={styles.icon}>👁️</span>
              <span>{post.views} views</span>
            </div>
          )}
        </div>

        <p className={styles.summary}>
          {post.summary ||
            (post.content
              ? String(post.content).substring(0, 150) + "..."
              : "") ||
            "No summary available for this article."}
        </p>

        <div className={styles.footer}>
          <Link href={postUrl} className={styles.readMore}>
            Continue Reading →
          </Link>

          <button
            onClick={handleLike}
            className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
            aria-label="Like"
          >
            <span className={styles.likeIcon}>{liked ? "❤️" : "🤍"}</span>
            <span className={styles.likeCount}>{likeCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
