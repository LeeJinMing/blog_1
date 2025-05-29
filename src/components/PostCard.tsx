import Link from 'next/link';
import { IPost } from '@/lib/models/Post';

interface PostCardProps {
  post: IPost | any; // 使用any来避免类型复杂性
  href: string;
  className?: string;
}

export function PostCard({ post, href, className = '' }: PostCardProps) {
  return (
    <Link href={href} className={`block ${className}`}>
      <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group">
        {/* 文章图片 */}
        {post.image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* 标签叠加 */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {post.featured && (
                <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                  ⭐ Featured
                </span>
              )}
              {post.trending && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                  🔥 Trending
                </span>
              )}
            </div>
          </div>
        )}

        <div className="p-6">
          {/* 分类和难度 */}
          <div className="flex items-center gap-3 mb-3">
            {post.category && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium rounded-full">
                {post.category}
              </span>
            )}
            {post.difficulty && (
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${post.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' :
                  post.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' :
                    'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                }`}>
                {post.difficulty}
              </span>
            )}
          </div>

          {/* 文章标题 */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* 文章摘要 */}
          {post.excerpt && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* 收入信息 */}
          {post.income && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <span className="text-lg">💰</span>
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  Income Potential:
                </span>
                <span className="text-sm font-bold text-green-900 dark:text-green-100">
                  {post.income}
                </span>
              </div>
            </div>
          )}

          {/* 文章元数据 */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              {post.readTime && (
                <span className="flex items-center space-x-1">
                  <span>⏱️</span>
                  <span>{post.readTime}</span>
                </span>
              )}
              {post.views && (
                <span className="flex items-center space-x-1">
                  <span>👁️</span>
                  <span>{post.views.toLocaleString()}</span>
                </span>
              )}
            </div>
            {post.publishedAt && (
              <span className="text-xs">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
} 