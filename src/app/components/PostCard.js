"use client";

import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import FallbackCover from "./FallbackCover";
import styles from "./PostCard.module.css";
import { getTagTextById } from "@/lib/tags";

// Estimate reading time (200 words per minute)
function calculateReadTime(content) {
  if (!content) return 1;
  // 确保内容是字符串类型
  const contentStr = String(content);
  const words = contentStr.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes); // Minimum 1 minute
}

// Generate article cover image based on content
function getCoverImage(post) {
  // If the article has a specified cover image, use it
  if (post.coverImage) {
    return post.coverImage;
  }

  // Choose default cover based on tags or title keywords
  // 只使用实际存在的图片文件
  const defaultImages = {
    AI: "/images/covers/tech.svg", // AI相关使用tech图片
    Technology: "/images/covers/tech.svg",
    Business: "/images/covers/economy.svg", // Business使用economy图片
    Economy: "/images/covers/economy.svg",
    Healthcare: "/images/covers/society.svg", // Healthcare使用society图片
    Fashion: "/images/covers/society.svg", // Fashion使用society图片
    Sustainable: "/images/covers/society.svg", // Sustainable使用society图片
    Investment: "/images/covers/economy.svg", // Investment使用economy图片
    India: "/images/covers/international.svg", // India使用international图片
    Global: "/images/covers/international.svg", // Global使用international图片
    Politics: "/images/covers/politics.svg",
    International: "/images/covers/international.svg",
    Society: "/images/covers/society.svg",
    Tech: "/images/covers/tech.svg",
    default: "/images/covers/default.svg",
  };

  // Find matching tags
  if (post.tagIds && post.tagIds.length > 0) {
    for (const tagId of post.tagIds) {
      const tagText = getTagTextById(tagId);
      for (const [key, url] of Object.entries(defaultImages)) {
        if (tagText.toLowerCase().includes(key.toLowerCase())) {
          return url;
        }
      }
    }
  }

  // Find keywords in the title
  const title = post.title.toLowerCase();
  for (const [key, url] of Object.entries(defaultImages)) {
    if (title.includes(key.toLowerCase())) {
      return url;
    }
  }

  // If no match, use default cover
  return defaultImages.default;
}

// Extract excerpt from content
function getExcerpt(content, maxLength = 150) {
  if (!content) return "";
  const contentStr = String(content);
  // Remove markdown headers and formatting
  const cleanContent = contentStr
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
    .trim();

  if (cleanContent.length <= maxLength) return cleanContent;
  return cleanContent.substring(0, maxLength).trim() + "...";
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
  const formattedDate = dayjs(post.createdAt).format("MMMM D, YYYY");
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

  // Get excerpt for display
  const excerpt = post.summary || getExcerpt(post.content);

  return (
    <article
      className={styles.postCard}
      itemScope
      itemType="https://schema.org/Article"
    >
      <Link href={postUrl} className={styles.postLink}>
        {showImage && (
          <div className={styles.imageContainer}>
            {imageError ? (
              <FallbackCover title={post.title} />
            ) : (
              <Image
                src={getImageUrl()}
                alt={`Cover image for ${post.title}`}
                width={400}
                height={200}
                className={styles.coverImage}
                onError={handleImageError}
                loading="lazy"
                itemProp="image"
              />
            )}
          </div>
        )}

        <div className={styles.content}>
          <header className={styles.header}>
            <h2 className={styles.title} itemProp="headline">
              {post.title}
            </h2>

            <div className={styles.meta}>
              <time
                dateTime={dayjs(post.createdAt).format("YYYY-MM-DD")}
                className={styles.date}
                itemProp="datePublished"
              >
                {formattedDate}
              </time>
              <span className={styles.readTime}>{readTime} min read</span>
            </div>
          </header>

          <div className={styles.excerpt} itemProp="description">
            {excerpt}
          </div>

          {post.tagIds && post.tagIds.length > 0 && (
            <div className={styles.tags} itemProp="keywords">
              {post.tagIds.slice(0, 3).map((tagId) => {
                const tagText = getTagTextById(tagId);
                return (
                  <span key={tagId} className={styles.tag}>
                    {tagText}
                  </span>
                );
              })}
            </div>
          )}

          <footer className={styles.footer}>
            <span className={styles.readMore}>Read full article →</span>

            {isClient && (
              <button
                onClick={handleLike}
                className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
                aria-label={`Like this article. Currently ${likeCount} likes`}
              >
                <span className={styles.heartIcon}>{liked ? "❤️" : "🤍"}</span>
                <span className={styles.likeCount}>{likeCount}</span>
              </button>
            )}
          </footer>
        </div>
      </Link>
    </article>
  );
}
