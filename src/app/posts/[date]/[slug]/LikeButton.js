"use client";

import { useState, useEffect } from "react";
import styles from "./LikeButton.module.css";

export default function LikeButton({ postId, slug }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 在组件加载时获取点赞状态和数量
  useEffect(() => {
    if (!postId) return;

    // 检查用户是否已经点赞
    const hasLiked = localStorage.getItem(`liked_${postId}`);
    if (hasLiked === "true") {
      setLiked(true);
    }

    // 获取点赞数
    async function fetchLikes() {
      setLoading(true);
      try {
        const response = await fetch(`/api/likes?id=${postId}`);
        if (response.ok) {
          const data = await response.json();
          setLikeCount(data.likes);
        }
      } catch (error) {
        console.error("Failed to fetch like count:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLikes();
  }, [postId]);

  // 处理点赞操作
  const handleLike = async () => {
    if (liked || !postId) return;

    try {
      const response = await fetch("/api/likes/increment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, slug }),
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(true);
        setLikeCount(data.likes);
        // 在本地存储中记录点赞状态
        localStorage.setItem(`liked_${postId}`, "true");
      }
    } catch (error) {
      console.error("Failed to like article:", error);
    }
  };

  return (
    <div className={styles.likeContainer}>
      <button
        onClick={handleLike}
        disabled={liked || loading}
        className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
        aria-label={liked ? "Liked" : "Like this article"}
      >
        <span className={styles.heartIcon}>{liked ? "❤️" : "🤍"}</span>
      </button>
      <span className={styles.likeCount}>{loading ? "..." : likeCount}</span>
    </div>
  );
}
