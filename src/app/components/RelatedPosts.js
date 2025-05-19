"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

// 格式化日期为URL格式
function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

// URL安全的slug处理
function getUrlSafeSlug(slug) {
  if (!slug) return "";

  try {
    let safeSlug = slug;
    safeSlug = safeSlug.replace(/[^\w-]/g, (char) => {
      return encodeURIComponent(char);
    });
    return safeSlug;
  } catch (e) {
    console.error("Error normalizing slug:", e);
    return slug;
  }
}

/**
 * 相关文章组件 - 根据当前文章的标签显示相关推荐
 * @param {Object} currentPost - 当前文章
 * @param {Array} currentPost.tagIds - 当前文章的标签ID数组
 * @param {string} currentPost._id - 当前文章ID，用于排除自己
 */
export default function RelatedPosts({ currentPost }) {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false); // 用于跟踪是否已经发起过请求

  useEffect(() => {
    async function fetchRelatedPosts() {
      if (
        !currentPost ||
        !currentPost.tagIds ||
        currentPost.tagIds.length === 0 ||
        fetchedRef.current
      ) {
        setRelatedPosts([]);
        setLoading(false);
        return;
      }

      fetchedRef.current = true; // 标记已经发起过请求

      try {
        // 获取带有相同标签的文章
        const tagIds = encodeURIComponent(currentPost.tagIds.join(","));
        const response = await fetch(
          `/api/related?tags=${tagIds}&exclude=${currentPost._id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch related posts");
        }

        const data = await response.json();
        setRelatedPosts(data.slice(0, 3)); // 最多显示3篇相关文章
      } catch (error) {
        console.error("Error fetching related posts:", error);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedPosts();
  }, [currentPost]);

  // 如果没有相关文章，则不渲染
  if (!loading && relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="related-posts-container">
      <h3 className="related-posts-title">相关推荐</h3>

      {loading ? (
        <div className="related-posts-loading">
          <p>Loading related articles...</p>
        </div>
      ) : (
        <div className="related-posts-grid">
          {relatedPosts.map((post) => {
            const yyyymmdd = formatDateToYYYYMMDD(post.createdAt);
            const safeSlug = getUrlSafeSlug(post.slug);
            const postUrl = `/posts/${yyyymmdd}/${safeSlug}`;
            const formattedDate = dayjs(post.createdAt).format("MMM D, YYYY");

            return (
              <div key={post._id} className="related-post-card">
                <Link href={postUrl}>
                  <h4>{post.title}</h4>
                </Link>
                <div className="related-post-meta">
                  <time dateTime={dayjs(post.createdAt).format("YYYY-MM-DD")}>
                    {formattedDate}
                  </time>
                </div>
                <p className="related-post-excerpt">
                  {post.summary
                    ? post.summary.length > 120
                      ? `${post.summary.slice(0, 120)}...`
                      : post.summary
                    : "No summary available."}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
