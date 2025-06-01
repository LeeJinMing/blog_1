import { Metadata } from 'next'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedArticles } from '@/components/FeaturedArticles'
import { CategoryGrid } from '@/components/CategoryGrid'
import { Newsletter } from '@/components/Newsletter'
import { NativeAd } from '@/components/NativeAd'

export const metadata: Metadata = {
  title: 'MoneyGuide - Professional Online Entrepreneurship and Passive Income Blog',
  description: 'Discover proven online money-making methods, passive income strategies, and entrepreneurial opportunities. Expert guides on dividend investing, rental properties, online courses, affiliate marketing, and more. Start building multiple income streams today.',
  keywords: 'passive income,online money making,entrepreneurship,side hustle,financial freedom,dividend investing,rental property investment,affiliate marketing,online courses,dropshipping,YouTube monetization,income streams,wealth building,investment strategies',
  authors: [{ name: 'MoneyGuide Team' }],
  creator: 'MoneyGuide',
  publisher: 'MoneyGuide',
  robots: 'index, follow',
  openGraph: {
    title: 'MoneyGuide - Build Multiple Income Streams & Achieve Financial Freedom',
    description: 'Expert guides on passive income, online business, and wealth building strategies. Learn from proven methods that generate $1000-$5000+ monthly income.',
    url: 'https://blog-2-rho.vercel.app',
    siteName: 'MoneyGuide',
    images: [
      {
        url: 'https://blog-2-rho.vercel.app/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'MoneyGuide - Professional Income Generation Strategies',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneyGuide - Build Multiple Income Streams & Achieve Financial Freedom',
    description: 'Expert guides on passive income, online business, and wealth building strategies. Learn proven methods that generate $1000-$5000+ monthly.',
    images: ['https://blog-2-rho.vercel.app/og-image.svg'],
  },
  alternates: {
    canonical: 'https://blog-2-rho.vercel.app',
  },
  other: {
    'google-site-verification': 'your-google-verification-code', // 替换为实际的验证码
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Full height */}
      <HeroSection />

      {/* Content area - Add top spacing for fixed navbar */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Featured Articles Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">🔥 Trending</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Featured<span className="gradient-text"> Money Guides</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Based on real-time data analysis and verified success stories, carefully selected practical money-making methods
              </p>
            </div>

            <FeaturedArticles />

            {/* View All Button */}
            <div className="text-center mt-16 animate-fade-in">
              <a
                href="/category/money-making"
                className="inline-flex items-center space-x-2 btn-primary group"
              >
                <span>View All Articles</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Native Advertisement Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <NativeAd className="animate-fade-in" />
          </div>
        </section>

        {/* Category Grid Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-950/30 dark:to-purple-950/30">
          <div className="mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50">
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300">📂 Categories</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Explore<span className="gradient-text"> Income Streams</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                From passive income to active entrepreneurship, from investment to skill monetization - comprehensive coverage of all income opportunities
              </p>
            </div>

            <CategoryGrid />
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <Newsletter />
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

          <div className="relative mx-auto max-w-7xl">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Our<span className="text-yellow-400"> Track Record</span>
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Numbers don't lie - let our results speak for our professional expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Success Stories", value: "50,000+", icon: "👥" },
                { label: "Average Income", value: "$3,500", icon: "💰" },
                { label: "Articles Published", value: "1,200+", icon: "📚" },
                { label: "Success Rate", value: "89%", icon: "🎯" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                  <div className="text-blue-100 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
} 