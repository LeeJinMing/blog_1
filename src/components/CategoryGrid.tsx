'use client'

import Link from 'next/link'

const categories = [
  {
    id: 1,
    name: 'AI Money',
    description: 'Leverage artificial intelligence technology to create income',
    icon: '🤖',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
    articles: 156,
    avgIncome: '$1100',
    href: '/category/ai-money'
  },
  {
    id: 2,
    name: 'Income Streams',
    description: 'Build automated income stream systems',
    icon: '💰',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30',
    articles: 248,
    avgIncome: '$2100',
    href: '/category/income-streams'
  },
  {
    id: 3,
    name: 'Investment',
    description: 'Smart investing and wealth building',
    icon: '📈',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30',
    articles: 189,
    avgIncome: '$3500',
    href: '/category/investment'
  },
  {
    id: 4,
    name: 'E-commerce',
    description: 'Online store and platform operations',
    icon: '🛒',
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30',
    articles: 203,
    avgIncome: '$2500',
    href: '/category/ecommerce'
  },
  {
    id: 5,
    name: 'Content Creation',
    description: 'Monetize through content creation',
    icon: '✍️',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
    articles: 175,
    avgIncome: '$1700',
    href: '/category/content-creation'
  },
  {
    id: 6,
    name: 'Skill Services',
    description: 'Professional skills monetization and services',
    icon: '🎯',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
    articles: 134,
    avgIncome: '$2800',
    href: '/category/skill-services'
  }
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={category.href}
          className="group relative card-modern hover:shadow-glow-lg transition-all duration-500 hover:scale-105 overflow-hidden animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

          <div className="relative p-8">
            {/* Icon with modern styling */}
            <div className={`w-16 h-16 mb-6 rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {category.icon}
            </div>

            {/* Category Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 dark:group-hover:from-white dark:group-hover:to-gray-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{category.articles} articles</span>
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-xs font-semibold shadow-soft`}>
                  Avg {category.avgIncome}/mo
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  Explore Now
                </span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-300 group-hover:translate-x-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Hover glow effect */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>
        </Link>
      ))}
    </div>
  )
} 