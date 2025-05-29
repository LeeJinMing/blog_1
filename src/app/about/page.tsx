'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-16">
          <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-soft">
            <span className="text-2xl mr-3">💡</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">About MoneyGuide</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Empowering Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Financial Journey</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            MoneyGuide is your trusted companion in the world of online entrepreneurship and financial freedom. We provide practical, actionable strategies to help you build multiple income streams and achieve your financial goals.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-8">
            <div className="text-4xl mb-6">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              To democratize financial education and provide everyone with the knowledge, tools, and strategies needed to build sustainable online income streams and achieve financial independence.
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 dark:text-green-400 mr-3 mt-1">✓</span>
                <span>Provide practical, tested strategies for online income generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 dark:text-green-400 mr-3 mt-1">✓</span>
                <span>Simplify complex financial concepts for everyday understanding</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 dark:text-green-400 mr-3 mt-1">✓</span>
                <span>Support entrepreneurs at every stage of their journey</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-8">
            <div className="text-4xl mb-6">👁️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              A world where financial freedom is accessible to everyone, regardless of background or starting point. We envision a community of empowered individuals building sustainable businesses and creating lasting wealth.
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-500 dark:text-blue-400 mr-3 mt-1">✓</span>
                <span>Global community of successful online entrepreneurs</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 dark:text-blue-400 mr-3 mt-1">✓</span>
                <span>Accessible financial education for all income levels</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 dark:text-blue-400 mr-3 mt-1">✓</span>
                <span>Innovation in online business and income generation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* What We Cover Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What We Cover</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive content covers every aspect of online income generation and financial growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-3xl p-8 text-white">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">Income Streams</h3>
              <p className="text-blue-100 dark:text-blue-200 mb-4">
                Discover proven methods to create multiple income streams through dividends, real estate, online courses, and affiliate marketing.
              </p>
              <Link href="/category/income-streams" className="text-white hover:text-blue-200 dark:hover:text-blue-300 font-semibold">
                Explore Income Streams →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-blue-600 dark:from-green-600 dark:to-blue-700 rounded-3xl p-8 text-white">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI & Technology</h3>
              <p className="text-green-100 dark:text-green-200 mb-4">
                Leverage artificial intelligence and cutting-edge technology to build automated income streams and scale your business.
              </p>
              <Link href="/category/ai-money" className="text-white hover:text-green-200 dark:hover:text-green-300 font-semibold">
                Discover AI Opportunities →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-3xl p-8 text-white">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-3">Investment Strategies</h3>
              <p className="text-purple-100 dark:text-purple-200 mb-4">
                Learn smart investment strategies for stocks, cryptocurrency, and index funds to build long-term wealth.
              </p>
              <Link href="/category/investment" className="text-white hover:text-purple-200 dark:hover:text-purple-300 font-semibold">
                Learn Investment Strategies →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-3xl p-8 text-white">
              <div className="text-3xl mb-4">🛒</div>
              <h3 className="text-xl font-bold mb-3">E-commerce Business</h3>
              <p className="text-orange-100 dark:text-orange-200 mb-4">
                Build profitable online stores with Amazon FBA, Shopify, dropshipping, and print-on-demand strategies.
              </p>
              <Link href="/category/ecommerce" className="text-white hover:text-orange-200 dark:hover:text-orange-300 font-semibold">
                Start E-commerce Business →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-green-600 dark:from-teal-600 dark:to-green-700 rounded-3xl p-8 text-white">
              <div className="text-3xl mb-4">🎥</div>
              <h3 className="text-xl font-bold mb-3">Content Creation</h3>
              <p className="text-teal-100 dark:text-teal-200 mb-4">
                Monetize your creativity through YouTube, Instagram, podcasting, and other content platforms.
              </p>
              <Link href="/category/content-creation" className="text-white hover:text-teal-200 dark:hover:text-teal-300 font-semibold">
                Become a Creator →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-3xl p-8 text-white">
              <div className="text-3xl mb-4">🛠️</div>
              <h3 className="text-xl font-bold mb-3">Skill Services</h3>
              <p className="text-indigo-100 dark:text-indigo-200 mb-4">
                Transform your skills into profitable services through consulting, tutoring, and virtual assistance.
              </p>
              <Link href="/category/skill-services" className="text-white hover:text-indigo-200 dark:hover:text-indigo-300 font-semibold">
                Monetize Your Skills →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-3xl p-12 text-white mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl opacity-90">
              Helping thousands of people achieve financial freedom through proven strategies
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-200 dark:text-blue-300">Monthly Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200 dark:text-blue-300">Success Stories</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$10M+</div>
              <div className="text-blue-200 dark:text-blue-300">Revenue Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-200 dark:text-blue-300">Strategies Shared</div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do at MoneyGuide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Practical Focus</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Every strategy we share is tested, practical, and designed for real-world implementation.
              </p>
            </div>

            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-6">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Transparency</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We provide honest, unbiased information with clear disclosure of risks and realistic expectations.
              </p>
            </div>

            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-6">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Education First</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We prioritize education and understanding over quick fixes or get-rich-quick schemes.
              </p>
            </div>

            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-6">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Community</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We believe in building a supportive community where everyone can learn and grow together.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Expert Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A diverse team of entrepreneurs, investors, and industry experts committed to your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Business Strategists</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Experienced entrepreneurs who have built and scaled multiple successful online businesses.
              </p>
              <div className="text-sm text-blue-600 dark:text-blue-400">10+ Years Experience</div>
            </div>

            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 dark:from-green-600 dark:to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Financial Analysts</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Certified financial professionals specializing in investment strategies and wealth building.
              </p>
              <div className="text-sm text-green-600 dark:text-green-400">CFA & CFP Certified</div>
            </div>

            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tech Innovators</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                AI and technology experts helping you leverage cutting-edge tools for business growth.
              </p>
              <div className="text-sm text-purple-600 dark:text-purple-400">AI & ML Specialists</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who are already building their path to financial freedom with MoneyGuide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/category/income-streams"
              className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Start Building Income
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Browse All Content
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Have questions or suggestions? We'd love to hear from you.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="mailto:contact@moneyguide.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              📧 contact@moneyguide.com
            </a>
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              🐦 @MoneyGuide
            </a>
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              💼 LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 