import { Suspense } from "react";
import { findManyPosts } from "@/lib/mongo";
import Link from "next/link";
import PostCard from "@/app/components/PostCard";
import ClientAdPlaceholder from "@/app/components/ClientAdPlaceholder";

// 预定义的分类
const categories = {
  "politics-diplomacy": {
    name: "政治与外交",
    description: "关于国内政治、国际外交关系的深度分析文章",
  },
  "business-economy": {
    name: "商业与经济",
    description: "商业趋势、经济分析和市场动态的精选内容",
  },
  "tech-innovation": {
    name: "科技与创新",
    description: "探索最新科技趋势、创新发展和数字化转型的文章",
  },
  "international-relations": {
    name: "国际关系",
    description: "关注全球地缘政治、国际组织和跨国合作的深度报道",
  },
  "culture-society": {
    name: "文化与社会",
    description: "关于社会现象、文化变迁和人文思考的精彩内容",
  },
};

// 为页面启用增量静态再生成 (ISR)
// 使用较长的缓存时间，如1周
export const revalidate = 604800; // 1周（60 * 60 * 24 * 7秒）

// 序列化文章对象
function serializePost(post) {
  if (!post) return null;

  return {
    ...post,
    _id: post._id.toString(),
    createdAt:
      post.createdAt instanceof Date
        ? post.createdAt.toISOString()
        : post.createdAt,
  };
}

// 根据分类标签筛选文章
async function getCategoryPosts(slug) {
  // 获取所有文章
  const allPosts = await findManyPosts("posts", 50);

  // 如果分类不存在，返回空数组
  if (!categories[slug]) {
    return [];
  }

  // 将分类slug转换为分类名称，用于匹配
  const categoryName = categories[slug].name;
  const keywordsByCategory = {
    "politics-diplomacy": ["政治", "外交", "政府", "选举", "政策"],
    "business-economy": ["经济", "商业", "金融", "市场", "贸易", "企业"],
    "tech-innovation": ["科技", "创新", "技术", "数字", "AI", "人工智能"],
    "international-relations": ["国际", "全球", "外交", "地缘政治"],
    "culture-society": ["文化", "社会", "艺术", "教育", "生活方式"],
  };

  const keywords = keywordsByCategory[slug] || [];

  // 筛选出包含相关标签或关键词的文章
  const filteredPosts = allPosts.filter((post) => {
    // 检查文章标签
    if (post.tags && post.tags.length > 0) {
      for (const tag of post.tags) {
        // 检查标签是否包含分类名称
        if (tag.includes(categoryName)) return true;

        // 检查标签是否包含相关关键词
        for (const keyword of keywords) {
          if (tag.includes(keyword)) return true;
        }
      }
    }

    // 检查标题是否包含分类名称或关键词
    if (post.title) {
      if (post.title.includes(categoryName)) return true;

      for (const keyword of keywords) {
        if (post.title.includes(keyword)) return true;
      }
    }

    return false;
  });

  return filteredPosts.map(serializePost);
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const posts = await getCategoryPosts(slug);
  const category = categories[slug] || {
    name: "未知分类",
    description: "找不到该分类的信息",
  };

  return (
    <div className="category-page home-layout">
      {/* 顶部横幅广告 */}
      <div className="top-ad-container">
        <ClientAdPlaceholder size="leaderboard" position="header" />
      </div>

      <section className="hero">
        <h1>{category.name}</h1>
        <p className="subtitle">{category.description}</p>
      </section>

      <div className="content-with-sidebar">
        <section className="post-list">
          {posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}

              {/* 文章列表中间的广告 */}
              {posts.length > 5 && (
                <div className="mid-content-ad">
                  <ClientAdPlaceholder size="banner" position="in-article" />
                </div>
              )}
            </>
          ) : (
            <div className="no-posts">
              <p>该分类下暂无文章。</p>
              <Link href="/" className="back-link">
                返回首页
              </Link>
            </div>
          )}
        </section>

        {/* 侧边栏部分 */}
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

            {/* 分类列表 */}
            <div className="sidebar-section">
              <h3>所有分类</h3>
              <div className="popular-topics">
                {Object.entries(categories).map(([slug, cat]) => (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className="popular-topic"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

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
