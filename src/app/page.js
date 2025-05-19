import dayjs from "dayjs";
import Link from "next/link";
import { findManyPosts } from "@/lib/mongo";
import TagTracker from "./posts/[date]/[slug]/TagTracker";
import { trackSearch } from "@/lib/analytics";
import ClientAdPlaceholder from "./components/ClientAdPlaceholder";
import PostCard from "./components/PostCard";
import { Suspense } from "react";
import SidebarContainer from "./components/SidebarContainer";

// 为页面启用 ISR
// 使用较长的缓存时间，或者false表示永久缓存，这里设置为1周
export const revalidate = 604800; // 1周（60 * 60 * 24 * 7秒）

// Format date to YYYYMMDD for URL
function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

// Ensure a URL-safe slug by encoding only the necessary characters
function getUrlSafeSlug(slug) {
  try {
    // We don't want to fully encode the slug as it makes URLs ugly
    // Instead, we'll only replace specific problematic characters
    let safeSlug = slug;

    // Replace non-URL safe characters (keeping hyphens and alphanumerics)
    safeSlug = safeSlug.replace(/[^\w-]/g, (char) => {
      return encodeURIComponent(char);
    });

    return safeSlug;
  } catch (e) {
    console.error("Error normalizing slug:", e);
    // Fallback to the original slug if there's an error
    return slug;
  }
}

// 将MongoDB文档序列化为普通对象
function serializePost(post) {
  if (!post) return null;

  return {
    ...post,
    _id: post._id.toString(), // 将ObjectId转换为字符串
    createdAt:
      post.createdAt instanceof Date
        ? post.createdAt.toISOString()
        : post.createdAt,
  };
}

export default async function HomePage() {
  const postsFromDb = await findManyPosts("posts", 10);

  // 序列化所有文章
  const postsToDisplay = postsFromDb.map(serializePost);

  return (
    <div className="home-layout">
      {/* 顶部横幅广告 */}
      <div className="top-ad-container">
        <ClientAdPlaceholder size="leaderboard" position="header" />
      </div>

      <section className="hero">
        <h1>Insights and Analysis</h1>
        <p className="subtitle">
          Thoughtful perspectives on global affairs, business trends, and
          emerging technologies.
        </p>
      </section>

      <div className="content-with-sidebar">
        <section className="post-list">
          {postsToDisplay.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {/* 文章列表中间的广告 */}
          {postsToDisplay.length > 5 && (
            <div className="mid-content-ad">
              <ClientAdPlaceholder size="banner" position="in-article" />
            </div>
          )}
        </section>

        {/* 侧边栏部分 - 使用增强的侧边栏组件 */}
        <aside className="sidebar">
          <div className="sticky-sidebar">
            {/* 侧边栏顶部广告 */}
            <div className="sidebar-ad">
              <ClientAdPlaceholder
                size="rectangle"
                position="sidebar"
                theme="brand"
              />
            </div>

            {/* 使用客户端SidebarContainer */}
            <Suspense
              fallback={
                <div className="sidebar-loading">加载侧边栏内容...</div>
              }
            >
              <SidebarContainer />
            </Suspense>

            {/* 侧边栏中部广告 */}
            <div className="sidebar-ad">
              <ClientAdPlaceholder size="skyscraper" position="sidebar" />
            </div>
          </div>
        </aside>
      </div>

      {/* 底部广告 */}
      <div className="bottom-ad-container">
        <ClientAdPlaceholder size="leaderboard" position="footer" />
      </div>
    </div>
  );
}
