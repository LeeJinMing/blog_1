'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { AdManager } from '@/components/AdManager';
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

  // 分割内容以插入广告
  const contentParts = post.content ? post.content.split('\n\n') : [];
  const totalParagraphs = contentParts.length;
  const adPositions = {
    first: Math.floor(totalParagraphs * 0.2), // 20%位置
    second: Math.floor(totalParagraphs * 0.5), // 50%位置
    third: Math.floor(totalParagraphs * 0.8)   // 80%位置
  };

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
              {post.trending && (
                <span className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm font-medium rounded-full">
                  🔥 Trending
                </span>
              )}
            </div>

            {/* 文章标题 */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* 文章摘要 */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* 收入信息 */}
            {post.income && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">💰</div>
                  <div>
                    <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                      Expected Income Potential
                    </div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {post.income}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 文章元数据 */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700 pb-8 mb-8">
              {post.author && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">👤</span>
                  <span>{post.author}</span>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📅</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
              {post.readTime && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⏱️</span>
                  <span>{post.readTime}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-lg">👁️</span>
                <span>{views.toLocaleString()} views</span>
              </div>
            </div>

            {/* 文章图片 */}
            {post.image && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>
            )}
          </div>

          {/* 文章内容 - 动态插入广告 */}
          <div className="px-8 sm:px-12 pb-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-5">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-2">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic mb-6 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
                      {children}
                    </pre>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* 文章中间广告 */}
            <div className="my-12">
              <AdManager
                adType="native"
                position="middle"
                size="large"
                className="animate-fade-in"
              />
            </div>

            {/* 文章结论部分 */}
            {post.conclusion && (
              <>
                <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="text-3xl mr-3">🎯</span>
                    Conclusion
                  </h3>
                  <div className="prose prose-lg dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.conclusion}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* 结论后广告 */}
                <div className="my-12">
                  <AdManager
                    adType="native"
                    position="bottom"
                    size="large"
                    className="animate-fade-in"
                  />
                </div>
              </>
            )}

            {/* 文章标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
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
            adType="native"
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
            adType="native"
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

          {/* 侧边栏底部广告 */}
          <div className="mt-6">
            <AdManager
              adType="native"
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