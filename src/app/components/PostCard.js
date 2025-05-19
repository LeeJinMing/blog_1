"use client";

import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import TagTracker from "@/app/posts/[date]/[slug]/TagTracker";
import FallbackCover from "./FallbackCover";
import styles from "./PostCard.module.css";
import { getTagTextById } from "@/lib/tags";

// 估算阅读时间（每分钟200字）
function calculateReadTime(content) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes); // 最少1分钟
}

// 生成文章封面图片
function getCoverImage(post) {
  // 如果文章有指定封面图，使用它
  if (post.coverImage) {
    return post.coverImage;
  }

  // 根据标签或标题选择默认封面
  const defaultImages = {
    政治: "/images/covers/politics.svg",
    经济: "/images/covers/economy.svg",
    科技: "/images/covers/tech.svg",
    国际: "/images/covers/international.svg",
    社会: "/images/covers/society.svg",
    default: "/images/covers/default.svg",
  };

  // 查找匹配的标签
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

  // 查找标题中的关键词
  for (const [key, url] of Object.entries(defaultImages)) {
    if (post.title.includes(key)) {
      return url;
    }
  }

  // 如果没有匹配，使用默认封面
  return defaultImages.default;
}

export default function PostCard({ post, showImage = true }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // 初始值设为0，在useEffect中更新
  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [useFallbackFormat, setUseFallbackFormat] = useState(false); // 添加状态控制是否使用备用格式

  // 在客户端初始化状态
  useEffect(() => {
    setIsClient(true);
    // 从localStorage获取点赞状态
    const cachedLiked = localStorage.getItem(`liked_${post._id}`);
    if (cachedLiked === "true") {
      setLiked(true);
    }

    // 设置初始点赞数
    const initialLikes = post.likes || 10; // 使用固定值替代随机数
    setLikeCount(initialLikes);
  }, [post._id, post.likes]);

  // 处理图片加载错误
  const handleImageError = () => {
    if (!useFallbackFormat) {
      // 如果SVG加载失败，尝试使用JPG
      setUseFallbackFormat(true);
    } else {
      // 如果JPG也失败，设置错误状态
      setImageError(true);
    }
  };

  // 获取图片URL，根据需要尝试JPG格式
  const getImageUrl = () => {
    let url = imageError
      ? getCoverImage({ ...post, title: "失败" })
      : getCoverImage(post);

    // 如果需要使用备用格式，将SVG替换为JPG
    if (useFallbackFormat && url.endsWith(".svg")) {
      return url.replace(".svg", ".jpg");
    }

    return url;
  };

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
      console.error("Error normalizing slug:", e);
      return slug;
    }
  };

  const yyyymmdd = formatDateToYYYYMMDD(post.createdAt);
  const safeSlug = getUrlSafeSlug(post.slug);
  const postUrl = `/posts/${yyyymmdd}/${safeSlug}`;
  const formattedDate = dayjs(post.createdAt).format("YYYY-MM-DD");
  const readTime = calculateReadTime(post.content);

  // 处理赞操作
  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!liked) {
      setLiked(true);
      setLikeCount(likeCount + 1);

      // 记录点赞操作
      try {
        // 实际项目中可以调用API记录点赞
        localStorage.setItem(`liked_${post._id}`, "true");
      } catch (error) {
        console.error("Error saving like:", error);
      }
    }
  };

  // 处理标题，确保标题不会太长
  const formatTitle = (title) => {
    // 如果标题超过50个字符，截断并添加省略号
    if (title && title.length > 70) {
      return `${title.substring(0, 70)}...`;
    }
    return title;
  };

  // 仅在客户端渲染完整内容
  if (!isClient) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <article className={styles.card}>
      {showImage && (
        <div className={styles.imageContainer}>
          <Link href={postUrl} className={styles.imageLink}>
            {imageError ? (
              // 当所有图片加载失败时，使用备用封面
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
            {formatTitle(post.title)}
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
            <span>{readTime} 分钟阅读</span>
          </div>

          {post.views && (
            <div className={styles.views}>
              <span className={styles.icon}>👁️</span>
              <span>{post.views} 阅读</span>
            </div>
          )}
        </div>

        {post.tagIds && post.tagIds.length > 0 && (
          <div className={styles.tags}>
            {post.tagIds.slice(0, 3).map((tagId, index) => (
              <TagTracker key={index} tagId={tagId} className={styles.tag} />
            ))}
          </div>
        )}

        <p className={styles.summary}>
          {post.summary ||
            post.content?.substring(0, 150) + "..." ||
            "No summary available for this article."}
        </p>

        <div className={styles.footer}>
          <Link href={postUrl} className={styles.readMore}>
            继续阅读 →
          </Link>

          <button
            onClick={handleLike}
            className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
            aria-label="点赞"
          >
            <span className={styles.likeIcon}>{liked ? "❤️" : "🤍"}</span>
            <span className={styles.likeCount}>{likeCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
