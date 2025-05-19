import dayjs from "dayjs";
import Link from "next/link";
import { getPosts, formatDateForUrl, getUrlSafeSlug } from "@/lib/db";
import TagTracker from "./posts/[date]/[slug]/TagTracker";
import { trackSearch } from "@/lib/analytics";
import ClientAdPlaceholder from "./components/ClientAdPlaceholder";
import PostCard from "./components/PostCard";
import { Suspense } from "react";
import SidebarContainer from "./components/SidebarContainer";

// 修改 ISR 缓存策略，使用较短的缓存时间
// 原来设置为 1 周 (604800)，现在改为 30 分钟，以便更频繁地获取新数据
export const revalidate = 1800; // 30分钟 (60 * 30 秒)

export default async function HomePage() {
  const postsToDisplay = await getPosts(10);

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
