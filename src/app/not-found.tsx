import { Metadata } from 'next'
import Link from 'next/link'
import { BackButton } from '@/components/BackButton'

export const metadata: Metadata = {
  title: '页面未找到 - MoneyGuide',
  description: '抱歉，您访问的页面不存在。返回首页查看最新的赚钱指南和投资策略。',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 返回按钮 */}
        <div className="mb-8 text-left">
          <BackButton />
        </div>

        {/* 404 错误图标 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            404
          </div>
          <div className="text-6xl mb-6">😔</div>
        </div>

        {/* 错误信息 */}
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          页面未找到
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          抱歉，您访问的页面不存在或已被移动。<br />
          但别担心，我们有很多精彩的内容等您发现！
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">🏠</span>
            返回首页
          </Link>

          <Link
            href="/category/income-streams"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">💰</span>
            浏览赚钱方法
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">📞</span>
            联系我们
          </Link>
        </div>

        {/* 推荐内容 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            💡 推荐内容
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🎯 热门分类
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <Link href="/category/income-streams" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    被动收入策略
                  </Link>
                </li>
                <li>
                  <Link href="/category/investments" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    投资理财指南
                  </Link>
                </li>
                <li>
                  <Link href="/category/business" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    创业商业模式
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔥 热门文章
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <Link href="/post/dividend-investing-guide" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    股息投资完整指南
                  </Link>
                </li>
                <li>
                  <Link href="/post/rental-property-investment" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    房地产租赁投资
                  </Link>
                </li>
                <li>
                  <Link href="/post/online-course-creation" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    在线课程创建指南
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO友好的额外信息 */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            如果您认为这是一个错误，请
            <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">联系我们</Link>
            。我们会尽快解决问题。
          </p>
        </div>
      </div>
    </div>
  )
} 