'use client'

import { useEffect, useState } from 'react'

interface NativeAdProps {
  className?: string
  adId?: string // 允许传入不同的广告ID
}

// 广告配置 - 从TraverseSeven后台获取
const AD_CONFIG = {
  // ✅ 已确认：从后台 "GET CODE" 获取的正确配置
  // 后台广告单元ID: 26686206 (管理用)
  // 脚本请求ID: 286b7c3c4b411bead9e284ad6036f16b (实际使用)
  SCRIPT_URL: '//traverseseven.com/286b7c3c4b411bead9e284ad6036f16b/invoke.js',
  CONTAINER_ID: 'container-286b7c3c4b411bead9e284ad6036f16b',

  // 配置确认无误 - 问题可能在网络环境（VPN/代理）
}

export function NativeAd({ className = '', adId }: NativeAdProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    // Check if it's development environment
    const isDev = window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('localhost')

    setIsDevelopment(isDev)

    // If it's development environment, show info message instead of loading ads
    if (isDev) {
      return
    }

    const scriptId = 'traverse-seven-ad-script'

    // Check if script already exists
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement

    if (!existingScript) {
      // Create new script
      const script = document.createElement('script')
      script.id = scriptId
      script.async = true
      script.setAttribute('data-cfasync', 'false')
      script.src = AD_CONFIG.SCRIPT_URL

      script.onload = () => {
        setIsLoaded(true)
        setHasError(false)
      }

      script.onerror = () => {
        setHasError(true)
        setIsLoaded(false)
        console.error('广告脚本加载失败 - 可能的原因：')
        console.error('1. 广告ID不正确（请检查后台配置）')
        console.error('2. VPN/代理网络干扰')
        console.error('3. 地理位置限制')
        console.error('当前配置:', AD_CONFIG)
      }

      // Add to head
      document.head.appendChild(script)
      existingScript = script
    } else {
      // Script exists, check if loaded
      if (existingScript.dataset.loaded === 'true') {
        setIsLoaded(true)
      }
    }

    // Set timeout, show error if not loaded within 10 seconds
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        setHasError(true)
        console.warn('广告加载超时 - 建议检查网络连接和后台配置')
      }
    }, 10000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isLoaded])

  // Show info message in development environment
  if (isDevelopment) {
    return (
      <div className={`w-full ${className}`}>
        {/* Ad Label */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              💰 Sponsored Content
            </span>
          </div>
        </div>

        {/* Development Environment Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-sm p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Development Environment
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Ads are only displayed in production environment. Deploy to Vercel to see the ad effects.
            </p>
            <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50 rounded-lg p-3">
              <p className="font-medium mb-1">Current Config Check Required:</p>
              <p>• Please verify ad ID from TraverseSeven backend</p>
              <p>• Current ID may not match backend configuration</p>
              <p>• Check "GET CODE" in Native Banner section</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Hide ad area if error occurs (production environment)
  if (hasError) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              ⚠️ Ad Loading Error
            </span>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-700 shadow-sm p-6">
          <div className="text-center">
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
              Unable to load sponsored content. Possible reasons:
            </p>
            <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
              <li>• Incorrect ad ID configuration</li>
              <li>• VPN/Proxy network interference</li>
              <li>• Geographic restrictions</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Ad Label */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            💰 Sponsored Content
          </span>
        </div>
      </div>

      {/* Ad Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
        <div
          id={AD_CONFIG.CONTAINER_ID}
          className="min-h-[200px] w-full"
          style={{
            display: 'block',
            minHeight: '200px',
            textAlign: 'center'
          }}
        >
          {/* Show placeholder only when not loaded */}
          {!isLoaded && (
            <div className="flex items-center justify-center h-full py-16">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading sponsored content...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 