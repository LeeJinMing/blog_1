'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  // Listen to scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Money Guides', href: '/category/money-making' },
    { name: 'Income Streams', href: '/category/income-streams' },
    { name: 'Investment', href: '/category/investment' },
    { name: 'Business', href: '/category/business' },
    { name: 'About', href: '/about' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-soft'
      : 'bg-transparent'
      }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-glow">
                  <span className="text-white font-bold text-lg">💰</span>
                </div>
                <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </div>
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                MoneyGuide
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              type="button"
              className="group relative p-3 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="group relative p-3 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              aria-label="Toggle theme"
            >
              <SunIcon className="h-5 w-5 dark:hidden transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <MoonIcon className="h-5 w-5 hidden dark:block transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-blue-500/10 dark:to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden group relative p-3 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Bars3Icon className={`h-6 w-6 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
              <XMarkIcon className={`absolute inset-0 m-3 h-6 w-6 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="py-4 space-y-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl mt-2 border border-gray-200/50 dark:border-gray-700/50 shadow-large">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl mx-2"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="animate-slide-up">{item.name}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-blue-500">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
} 