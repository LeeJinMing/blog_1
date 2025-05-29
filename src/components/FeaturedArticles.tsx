'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IPost } from '@/lib/models/Post';

interface PostResponse {
  success: boolean;
  data: IPost[];
  count: number;
}

// 简单的文章接口，用于备用数据
interface SimplePost {
  _id: string;
  title: string;
  excerpt?: string;
  summary?: string;
  content: string;
  category?: string;
  difficulty?: string;
  readTime?: string;
  income?: string;
  featured?: boolean;
  trending?: boolean;
  tags?: string[];
  publishedAt?: Date | string;
  author?: string;
  views?: number;
  image?: string;
}

// 备用文章数据，以防数据库连接失败
const fallbackArticles: SimplePost[] = [
  {
    _id: 'dividend-investing-passive-income-2025',
    title: 'Dividend Investing: Build $3000+ Monthly Passive Income in 2025',
    excerpt: 'Learn how to create a sustainable dividend portfolio that generates consistent monthly income. Discover high-yield dividend stocks, REITs, and dividend growth strategies.',
    summary: 'Learn how to create a sustainable dividend portfolio that generates consistent monthly income. Discover high-yield dividend stocks, REITs, and dividend growth strategies.',
    content: '',
    category: 'Income Streams',
    difficulty: 'Intermediate',
    readTime: '8 min read',
    income: '$3000+/month',
    featured: true,
    trending: true,
    tags: ['dividend investing', 'passive income', 'stocks'],
    publishedAt: '2024-12-15',
    author: 'Financial Expert',
    views: 15420
  },
  {
    _id: 'rental-property-income-guide-2025',
    title: 'Rental Property Investment: Generate $2500+ Monthly Cash Flow',
    excerpt: 'Complete guide to rental property investing. Learn how to find profitable properties, calculate cash flow, manage tenants, and scale your portfolio.',
    summary: 'Complete guide to rental property investing. Learn how to find profitable properties, calculate cash flow, manage tenants, and scale your portfolio.',
    content: '',
    category: 'Income Streams',
    difficulty: 'Advanced',
    readTime: '12 min read',
    income: '$2500+/month',
    featured: true,
    trending: false,
    tags: ['real estate', 'rental property', 'cash flow'],
    publishedAt: '2024-12-10',
    author: 'Real Estate Expert',
    views: 12890
  },
  {
    _id: 'online-course-creation-income-2025',
    title: 'Online Course Creation: Earn $5000+ Monthly Teaching Your Skills',
    excerpt: 'Transform your expertise into a profitable online course business. Learn course creation, marketing strategies, and scaling techniques.',
    summary: 'Transform your expertise into a profitable online course business. Learn course creation, marketing strategies, and scaling techniques.',
    content: '',
    category: 'Income Streams',
    difficulty: 'Intermediate',
    readTime: '10 min read',
    income: '$5000+/month',
    featured: true,
    trending: true,
    tags: ['online courses', 'education', 'passive income'],
    publishedAt: '2024-12-05',
    author: 'Education Expert',
    views: 18750
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    case "Intermediate":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    case "Advanced":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
  }
}

export function FeaturedArticles() {
  const [articles, setArticles] = useState<(IPost | SimplePost)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        // Fetch latest 3 articles
        const response = await fetch('/api/posts?limit=3');

        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const result: PostResponse = await response.json();

        if (result.success && result.data.length > 0) {
          setArticles(result.data);
        } else {
          // 如果数据库没有文章，使用备用数据
          console.log('No articles in database, using fallback data');
          setArticles(fallbackArticles);
        }
      } catch (err) {
        // 如果 API 调用失败，使用备用数据
        console.log('API call failed, using fallback data:', err);
        setArticles(fallbackArticles);
        setError(null); // 不显示错误，因为我们有备用数据
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  if (loading) {
    return (
      <div id="featured-articles" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft overflow-hidden animate-pulse"
          >
            <div className="h-56 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div id="featured-articles" className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">❌ Failed to Load Articles</div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div id="featured-articles" className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">No Articles Available</h3>
        <p className="text-gray-500 dark:text-gray-500">Check back later for new content.</p>
      </div>
    );
  }

  return (
    <div id="featured-articles" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <Link
          key={String(article._id)}
          href={`/post/${article._id}`}
          className="block"
        >
          <article
            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft hover:shadow-large transition-all duration-500 hover:scale-[1.02] overflow-hidden animate-slide-up cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image with modern overlay */}
            <div className="relative h-56 overflow-hidden rounded-t-3xl">
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-4xl">💰</div>
                </div>
              )}

              {/* Modern Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

              {/* Top Tags */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                {article.category && (
                  <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-semibold rounded-full border border-white/20">
                    {article.category}
                  </span>
                )}
                {article.difficulty && (
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getDifficultyColor(article.difficulty)}`}>
                    {article.difficulty}
                  </span>
                )}
              </div>

              {/* Views Counter */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{article.views || 0}</span>
                </div>
              </div>

              {/* Income Badge */}
              {article.income && (
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-lg">
                    💰 {article.income}
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {article.featured && (
                <div className="absolute bottom-4 right-4">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-semibold rounded-full shadow-lg">
                    ⭐ Featured
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {article.excerpt || article.summary || 'Discover proven strategies and methods to boost your income...'}
              </p>

              {/* Bottom Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })
                        : 'Recent'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{article.readTime || '5 min read'}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="group/btn flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300">
                  <span>Read</span>
                  <svg className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>
          </article>
        </Link>
      ))}
    </div>
  )
} 