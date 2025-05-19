import Link from "next/link";
import { FaTag, FaNewspaper, FaChartLine } from "react-icons/fa";
import ClientAdPlaceholder from "@/app/components/ClientAdPlaceholder";
import CategoryStyles from "@/app/components/CategoryStyles";

// 预定义的分类
const categories = [
  {
    slug: "politics-diplomacy",
    name: "政治与外交",
    description: "关于国内政治、国际外交关系的深度分析文章",
    icon: "🏛️",
    color: "#4a6da7",
  },
  {
    slug: "business-economy",
    name: "商业与经济",
    description: "商业趋势、经济分析和市场动态的精选内容",
    icon: "💹",
    color: "#4caf50",
  },
  {
    slug: "tech-innovation",
    name: "科技与创新",
    description: "探索最新科技趋势、创新发展和数字化转型的文章",
    icon: "🚀",
    color: "#2196f3",
  },
  {
    slug: "international-relations",
    name: "国际关系",
    description: "关注全球地缘政治、国际组织和跨国合作的深度报道",
    icon: "🌍",
    color: "#1a237e",
  },
  {
    slug: "culture-society",
    name: "文化与社会",
    description: "关于社会现象、文化变迁和人文思考的精彩内容",
    icon: "🎭",
    color: "#9c27b0",
  },
];

export const metadata = {
  title: "文章分类 | Insights Blog",
  description: "浏览我们的文章分类，发现您感兴趣的内容",
};

// 设置1周的缓存时间
export const revalidate = 604800;

export default function CategoriesPage() {
  return (
    <div className="categories-page home-layout">
      {/* 顶部横幅广告 */}
      <div className="top-ad-container">
        <ClientAdPlaceholder size="leaderboard" position="header" />
      </div>

      <section className="hero">
        <h1>文章分类</h1>
        <p className="subtitle">浏览我们的文章分类，发现您感兴趣的内容</p>
      </section>

      <div className="categories-container">
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.slug}
              className="category-card"
              style={{
                "--category-color": category.color,
              }}
            >
              <div className="category-icon">{category.icon}</div>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>

        {/* 中间广告 */}
        <div className="mid-content-ad">
          <ClientAdPlaceholder size="banner" position="in-article" />
        </div>

        <div className="other-pages">
          <div className="page-links">
            <Link href="/" className="page-link">
              <div className="page-link-icon">
                <FaNewspaper />
              </div>
              <div className="page-link-content">
                <h3>最新文章</h3>
                <p>查看我们的最新发布内容</p>
              </div>
            </Link>

            <Link href="/tags" className="page-link">
              <div className="page-link-icon">
                <FaTag />
              </div>
              <div className="page-link-content">
                <h3>标签云</h3>
                <p>按照特定标签浏览文章</p>
              </div>
            </Link>

            <Link href="/archive/2025" className="page-link">
              <div className="page-link-icon">
                <FaChartLine />
              </div>
              <div className="page-link-content">
                <h3>文章归档</h3>
                <p>按照时间线浏览历史文章</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 底部广告 */}
      <div className="bottom-ad-container">
        <ClientAdPlaceholder size="leaderboard" position="footer" />
      </div>

      {/* 引入客户端样式组件 */}
      <CategoryStyles />
    </div>
  );
}
