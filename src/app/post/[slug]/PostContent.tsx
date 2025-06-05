'use client';

import { useState, useEffect } from 'react';
import { AdManager } from '@/components/AdManager';
import { EnhancedArticleRenderer } from '@/components/EnhancedArticleRenderer';
import 'highlight.js/styles/github-dark.css';

interface PostContentProps {
  post: any;
}

export function PostContent({ post }: PostContentProps) {
  const [views, setViews] = useState(post.views || 0);

  useEffect(() => {
    // 更新文章浏览量
    const updateViews = async () => {
      try {
        const response = await fetch(`/api/posts/${post.slug || post._id}`, {
          method: 'GET',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.views) {
            setViews(result.data.views);
          }
        }
      } catch (error) {
        console.error('Failed to update views:', error);
      }
    };

    updateViews();
  }, [post.slug, post._id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* 主要内容区域 */}
      <div className="lg:col-span-3">
        {/* 文章顶部广告 */}
        <div className="mb-8">
          <AdManager
            adType="native"
            position="top"
            size="large"
            className="animate-fade-in"
          />
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* 文章头部 */}
          <div className="p-8 sm:p-12">
            {/* 标签和分类 */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {post.category && (
                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium rounded-full">
                  📚 {post.category}
                </span>
              )}
              {post.difficulty && (
                <span className={`px-4 py-2 text-sm font-medium rounded-full ${post.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' :
                  post.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' :
                    'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                  }`}>
                  🎯 {post.difficulty}
                </span>
              )}
              {post.featured && (
                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-sm font-medium rounded-full">
                  ⭐ Featured
                </span>
              )}
              {post.income && (
                <span className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-sm font-medium rounded-full">
                  💰 {post.income}
                </span>
              )}
            </div>

            {/* 标题 */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* 摘要 */}
            {post.summary && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8 border border-blue-100 dark:border-blue-800">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Key Takeaways
                </h2>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            )}

            {/* 文章元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className="mr-2">👤</span>
                <span>{post.author || 'MoneyGuide Team'}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    : 'Recently Published'
                  }
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">👁️</span>
                <span>{views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⏱️</span>
                <span>{post.readTime || '5 min read'}</span>
              </div>
            </div>

            {/* 使用增强版文章渲染器 - 包含智能广告插入 */}
            <div className="prose-container">
              <EnhancedArticleRenderer
                content={post.content || ''}
                enableAds={true}
                adPositions={{
                  first: 0.25,   // 在文章25%位置插入广告
                  second: 0.6,   // 在文章60%位置插入广告
                  third: 0.85    // 在文章85%位置插入广告
                }}
              />
            </div>

            {/* 文章结论部分 */}
            {post.conclusion && (
              <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
                  <span className="mr-3">🎯</span>
                  Final Thoughts
                </h2>
                <p className="text-green-800 dark:text-green-200 text-lg leading-relaxed">
                  {post.conclusion}
                </p>
              </div>
            )}

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* 文章底部广告 */}
        <div className="mt-8">
          <AdManager
            adType="google_display"
            position="bottom"
            size="large"
            className="animate-fade-in"
          />
        </div>
      </div>

      {/* 侧边栏 */}
      <div className="lg:col-span-1 space-y-6">
        {/* 侧边栏顶部广告 */}
        <div className="sticky top-24">
          <AdManager
            adType="google_display"
            position="sidebar"
            size="medium"
            className="animate-fade-in mb-6"
          />

          {/* 相关文章或其他侧边栏内容 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💡 Quick Tips
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• Bookmark this article for future reference</p>
              <p>• Share with friends who might find this helpful</p>
              <p>• Subscribe to our newsletter for more tips</p>
            </div>
          </div>

          {/* 广告合规提示 */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">🛡️</span>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                Ad Compliance
              </h4>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Our ads are monitored for compliance with Google AdSense policies.
            </p>
          </div>

          {/* 侧边栏底部广告 */}
          <div className="mt-6">
            <AdManager
              adType="google_display"
              position="sidebar"
              size="small"
              className="animate-fade-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 