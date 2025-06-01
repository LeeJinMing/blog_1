import { Metadata } from 'next';
import { PostCard } from '../../../components/PostCard';
import { BackButton } from '@/components/BackButton';
import { Breadcrumb, BreadcrumbGenerators } from '@/components/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { AdManager } from '@/components/AdManager';
import { incomeStreamArticles } from '@/data/incomeStreamArticles';

// 分类映射
const categoryMap: Record<string, string> = {
  'money-making': 'Money Making',
  'income-streams': 'Income Streams',
  'investments': 'Investments',
  'business': 'Business',
  'finance': 'Finance',
};

// 获取分类文章
function getCategoryPosts(category: string): any[] {
  switch (category) {
    case 'income-streams':
      return incomeStreamArticles;
    case 'money-making':
      // 这里可以添加其他分类的文章
      return [];
    default:
      return [];
  }
}

// 动态生成 metadata
export async function generateMetadata({
  params
}: {
  params: { category: string }
}): Promise<Metadata> {
  const categoryName = categoryMap[params.category] || 'Category';
  const posts = getCategoryPosts(params.category);

  const title = `${categoryName} - Money Making Strategies | MoneyGuide`;
  const description = `Discover proven ${categoryName.toLowerCase()} strategies and methods. ${posts.length} expert guides to help you build wealth and achieve financial freedom.`;

  return {
    title,
    description,
    keywords: [`${categoryName.toLowerCase()}`, 'money making', 'passive income', 'wealth building', 'financial freedom'],
    openGraph: {
      title,
      description,
      url: `https://blog-2-rho.vercel.app/category/${params.category}`,
      siteName: 'MoneyGuide',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: `${categoryName} - MoneyGuide`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.svg'],
    },
    alternates: {
      canonical: `https://blog-2-rho.vercel.app/category/${params.category}`,
    },
  };
}

export default function CategoryPage({
  params
}: {
  params: { category: string }
}) {
  const categoryName = categoryMap[params.category] || 'Category';
  const posts = getCategoryPosts(params.category);

  // 生成面包屑
  const breadcrumbItems = BreadcrumbGenerators.forCategory(categoryName, params.category);
  const breadcrumbJsonLdItems = [
    { name: 'Home', url: 'https://blog-2-rho.vercel.app' },
    ...breadcrumbItems.map(item => ({
      name: item.name,
      url: `https://blog-2-rho.vercel.app${item.href}`
    }))
  ];

  // 计算广告插入位置
  const midPoint = Math.floor(posts.length / 2);

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 返回按钮 */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* 面包屑导航 */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* 分类顶部广告 */}
          <div className="mb-8">
            <AdManager
              adType="native"
              position="top"
              size="large"
              className="animate-fade-in"
            />
          </div>

          {/* 分类头部 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {categoryName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {posts.length > 0
                ? `Explore ${posts.length} proven strategies and expert guides in ${categoryName.toLowerCase()}.`
                : `Discover expert strategies and guides in ${categoryName.toLowerCase()}.`
              }
            </p>
          </div>

          {/* 文章列表 */}
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: any, index: number) => (
                  <div key={post._id}>
                    <PostCard
                      post={post}
                      href={`/post/${post.slug || post._id}`}
                    />

                    {/* 在文章列表中间插入广告 */}
                    {index === midPoint && posts.length > 6 && (
                      <div className="col-span-full my-8">
                        <AdManager
                          adType="native"
                          position="middle"
                          size="large"
                          className="animate-fade-in"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 文章列表后广告 */}
              <div className="mt-12">
                <AdManager
                  adType="native"
                  position="bottom"
                  size="medium"
                  className="animate-fade-in"
                />
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're working on adding more content to this category. Check back soon!
                </p>
              </div>

              {/* 空页面广告 */}
              <div className="mt-8">
                <AdManager
                  adType="native"
                  position="middle"
                  size="large"
                  className="animate-fade-in"
                />
              </div>
            </>
          )}

          {/* 分类统计 */}
          {posts.length > 0 && (
            <>
              <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {posts.length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Expert Guides
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {posts.filter((p: any) => p.income).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Income Opportunities
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {posts.filter((p: any) => p.difficulty === 'Beginner').length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Beginner Friendly
                    </div>
                  </div>
                </div>
              </div>

              {/* 统计信息后广告 */}
              <div className="mt-12">
                <AdManager
                  adType="native"
                  position="footer"
                  size="large"
                  className="animate-fade-in"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 