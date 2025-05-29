'use client';

import { useState, useEffect } from 'react';
import { IPost } from '@/lib/models/Post';
import Link from 'next/link';

interface PostResponse {
  success: boolean;
  data: IPost[];
  count: number;
}

export default function MoneyMakingPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts?limit=50');

        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const result: PostResponse = await response.json();

        if (result.success) {
          setPosts(result.data);
        } else {
          throw new Error('API returned error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 text-xl mb-4">❌ Loading Failed</div>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">📚 All Articles</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Browse all featured articles and discover more money-making opportunities and methods
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Found {posts.length} articles
          </div>
        </div>

        {/* Article list */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📝</div>
            <h3 className="text-xl text-gray-600 dark:text-gray-300 mb-2">No Articles Yet</h3>
            <p className="text-gray-500 dark:text-gray-400">There are no articles in the database yet. Please add some content first.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={String(post._id)}
                href={`/post/${post._id}`}
                className="block"
              >
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                  {/* Article image */}
                  {post.image && (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category and difficulty tags */}
                    <div className="flex items-center gap-2 mb-3">
                      {post.category && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full">
                          {post.category}
                        </span>
                      )}
                      {post.difficulty && (
                        <span className={`px-2 py-1 text-xs rounded-full ${post.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' :
                          post.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' :
                            'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                          }`}>
                          {post.difficulty}
                        </span>
                      )}
                      {post.featured && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Article title */}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>

                    {/* Article excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Income information */}
                    {post.income && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-sm text-green-800 dark:text-green-300">
                          💰 Expected Income: <span className="font-semibold">{post.income}</span>
                        </div>
                      </div>
                    )}

                    {/* Article metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        {post.author && (
                          <span>👤 {post.author}</span>
                        )}
                        {post.readTime && (
                          <span>⏱️ {post.readTime}</span>
                        )}
                        {post.views !== undefined && (
                          <span>👁️ {post.views}</span>
                        )}
                      </div>
                      <div>
                        {post.publishedAt && (
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString('en-US')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Back to home button */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
} 