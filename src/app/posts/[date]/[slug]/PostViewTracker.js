"use client";

import { useEffect, useState } from "react";
import { trackPostView } from "@/lib/analytics";

/**
 * 组件用于追踪文章浏览量
 * 在客户端组件中使用useEffect钩子追踪浏览量
 * 每当组件加载（即用户访问文章）时，发送一个API请求增加浏览量
 */
export default function PostViewTracker({ postId, slug }) {
  const [hasTracked, setHasTracked] = useState(false);
  const [viewCount, setViewCount] = useState(null);

  useEffect(() => {
    if (!postId || hasTracked) return;

    const sessionKey = `viewed-${postId}`;
    const hasViewedInSession = sessionStorage.getItem(sessionKey);

    if (hasViewedInSession) {
      // 获取当前文章的浏览量但不递增
      fetchViewCount();
      return;
    }

    // 设置一个合理的延迟来确保用户真的在阅读文章
    const timer = setTimeout(() => {
      incrementViewCount();
    }, 5000); // 5秒后认为用户真正阅读

    return () => clearTimeout(timer);
  }, [postId, hasTracked]);

  // 获取当前浏览量
  const fetchViewCount = async () => {
    try {
      const response = await fetch(`/api/views?id=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setViewCount(data.views);
      }
    } catch (error) {
      console.error("Failed to fetch view count:", error);
    }
  };

  // 递增浏览量
  const incrementViewCount = async () => {
    try {
      const response = await fetch("/api/views/increment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, slug }),
      });

      if (response.ok) {
        const data = await response.json();
        setViewCount(data.views);

        // 在会话中标记该文章已被浏览
        sessionStorage.setItem(`viewed-${postId}`, "true");
        setHasTracked(true);
      }
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
  };

  return (
    <>
      {/* 这是一个不可见的组件，仅用于跟踪浏览量 */}
      {viewCount !== null && (
        <div className="hidden">{`Article views: ${viewCount}`}</div>
      )}
    </>
  );
}
