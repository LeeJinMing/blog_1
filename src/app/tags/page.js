import Link from "next/link";
import ClientAdPlaceholder from "@/app/components/ClientAdPlaceholder";
import { getAllTags } from "@/lib/tags";

export const metadata = {
  title: "标签云 - 博客标签导航",
  description: "浏览所有文章标签，发现更多感兴趣的内容",
};

// 设置页面重新验证间隔 - 2小时
export const revalidate = 7200;

export default function TagsPage() {
  // 直接使用静态标签数据，避免数据库查询
  const tags = getAllTags();

  return (
    <div className="tags-page">
      {/* 顶部广告 */}
      <div className="top-ad-container">
        <ClientAdPlaceholder size="leaderboard" position="header" />
      </div>

      <header className="page-header">
        <h1>标签云</h1>
        <p className="subtitle">按照主题浏览文章</p>
      </header>

      <div className="tag-cloud-container">
        {tags.length === 0 ? (
          <p className="no-tags">暂无标签数据</p>
        ) : (
          <div className="tag-cloud">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/category/${encodeURIComponent(tag.id)}`}
                className="tag-item"
              >
                {tag.text}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 中间广告 */}
      <div className="mid-ad-container">
        <ClientAdPlaceholder size="rectangle" position="in-content" />
      </div>

      {/* 底部链接区域 */}
      <div className="bottom-links">
        <h2>探索更多内容</h2>
        <div className="links-grid">
          <Link href="/" className="feature-link">
            <span className="link-icon">📰</span>
            <div className="link-text">
              <h3>最新文章</h3>
              <p>查看最新发布的内容</p>
            </div>
          </Link>

          <Link href="/categories" className="feature-link">
            <span className="link-icon">📂</span>
            <div className="link-text">
              <h3>内容分类</h3>
              <p>按主题分类浏览</p>
            </div>
          </Link>

          <Link href="/about" className="feature-link">
            <span className="link-icon">ℹ️</span>
            <div className="link-text">
              <h3>关于我们</h3>
              <p>了解更多</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 底部广告 */}
      <div className="bottom-ad-container">
        <ClientAdPlaceholder size="leaderboard" position="footer" />
      </div>

      <style jsx>{`
        .tags-page {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .subtitle {
          color: #666;
          margin-top: 0.5rem;
        }

        .tag-cloud-container {
          margin: 2rem 0;
        }

        .tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .tag-item {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #f3f4f6;
          color: #333;
          border-radius: 20px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .tag-item:hover {
          background-color: #e2e4e7;
          transform: translateY(-2px);
        }

        .tag-count {
          font-size: 0.8em;
          margin-left: 0.4rem;
          color: #666;
        }

        .mid-ad-container,
        .bottom-ad-container {
          margin: 3rem 0;
          text-align: center;
        }

        .bottom-links {
          margin: 3rem 0;
          text-align: center;
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .feature-link {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }

        .feature-link:hover {
          background-color: #e9ecef;
          transform: translateY(-3px);
        }

        .link-icon {
          font-size: 2rem;
          margin-right: 1rem;
        }

        .link-text h3 {
          margin: 0 0 0.3rem 0;
          font-size: 1.2rem;
        }

        .link-text p {
          margin: 0;
          color: #666;
        }

        .no-tags {
          text-align: center;
          color: #666;
          padding: 3rem 0;
        }

        @media (max-width: 768px) {
          .links-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
