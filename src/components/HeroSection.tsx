'use client'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs with 2025 design */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/15 to-blue-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Modern Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(14,165,233,0.08)_1px,transparent_0)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Modern Badge with glass morphism */}
        <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-soft">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-glow"></div>
              <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
              AI-Powered Trending Money-Making Guides
            </span>
          </div>
        </div>

        {/* Main Heading with 2025 typography */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8">
          <span className="block text-gray-900 dark:text-white mb-2 animate-slide-up">
            Discover the Latest
          </span>
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Money Opportunities
          </span>
          <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-600 dark:text-gray-300 mt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Let AI unlock your wealth potential
          </span>
        </h1>

        {/* Enhanced Description */}
        <p className="mt-8 text-lg sm:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Based on <strong className="text-blue-600 dark:text-blue-400">Google Trends</strong> and real-time market data, our AI system curates the most promising
          <span className="relative">
            <span className="relative z-10 px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg">online income methods</span>
          </span>
          , passive income strategies, and entrepreneurial opportunities. Every guide is professionally verified with actionable implementation steps.
        </p>

        {/* Modern CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-scale-in" style={{ animationDelay: '0.8s' }}>
          <a
            href="#featured-articles"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-large hover:shadow-glow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="relative z-10 flex items-center space-x-2">
              <span>🚀 Explore Trending Guides</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>

          <a
            href="/category/passive-income"
            className="group px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white font-semibold rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center space-x-2">
              <span>💰 Passive Income Methods</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </a>
        </div>

        {/* Enhanced Stats with modern cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '1s' }}>
          <div className="group relative p-6 bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Methods</div>
            </div>
          </div>

          <div className="group relative p-6 bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">$7k+</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Monthly Income</div>
            </div>
          </div>

          <div className="group relative p-6 bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">24h</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Real-time Updates</div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Real-time AI Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Expert Verification</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>100k+ Success Stories</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
} 