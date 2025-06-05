'use client'

import { useEffect, useState } from 'react'
import { ADS_CONFIG, shouldShowAd, isDevelopment } from '@/config/ads-config'

interface GoogleAdsenseProps {
  slot?: string
  format?: 'auto' | 'fluid' | 'autorelaxed'
  layout?: 'in-article' | 'in-feed'
  layoutKey?: string
  className?: string
  style?: React.CSSProperties
  adType?: 'display' | 'infeed' | 'inarticle' | 'multiplex'
  position?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function GoogleAdsense({
  slot,
  format = 'auto',
  layout,
  layoutKey,
  className = '',
  style = {},
  adType = 'display',
  position = 'unknown'
}: GoogleAdsenseProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isDev, setIsDev] = useState(false)

  // 根据广告类型获取默认配置
  const getAdConfig = () => {
    switch (adType) {
      case 'display':
        return ADS_CONFIG.GOOGLE_ADSENSE.units.displayBanner
      case 'infeed':
        return ADS_CONFIG.GOOGLE_ADSENSE.units.inFeed
      case 'inarticle':
        return ADS_CONFIG.GOOGLE_ADSENSE.units.inArticle
      case 'multiplex':
        return ADS_CONFIG.GOOGLE_ADSENSE.units.multiplex
      default:
        return ADS_CONFIG.GOOGLE_ADSENSE.units.displayBanner
    }
  }

  const adConfig = getAdConfig()
  const finalSlot = slot || adConfig.slot
  const finalFormat = format || adConfig.format

  // 安全地获取layout和layoutKey，只对支持的广告类型
  const finalLayout = layout || ('layout' in adConfig ? adConfig.layout : undefined)
  const finalLayoutKey = layoutKey || ('layoutKey' in adConfig ? adConfig.layoutKey : undefined)

  useEffect(() => {
    setIsDev(isDevelopment())

    // 检查是否应该显示Google AdSense
    if (!shouldShowAd('google_adsense')) {
      return
    }

    // 开发环境不加载真实广告
    if (isDevelopment()) {
      return
    }

    // 初始化AdSense
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
        setIsLoaded(true)
      }
    } catch (error) {
      console.error('Google AdSense initialization error:', error)
      setHasError(true)
    }
  }, [finalSlot])

  // 开发环境显示占位符
  if (isDev) {
    return (
      <div className={`w-full ${className}`} style={style}>
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700">
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              🟢 Google AdSense ({adType})
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200 dark:border-green-700 shadow-sm p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              Google AdSense Active
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              This ad will display in production environment. Third-party ads are disabled.
            </p>
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800/50 rounded-lg p-3">
              <p className="font-medium mb-1">Ad Configuration:</p>
              <p>• Type: {adType}</p>
              <p>• Format: {finalFormat}</p>
              <p>• Position: {position}</p>
              {finalSlot && <p>• Slot: {finalSlot}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 生产环境不显示Google AdSense (等待AdSense审核通过)
  if (!shouldShowAd('google_adsense')) {
    return null
  }

  // 错误状态
  if (hasError) {
    return (
      <div className={`w-full ${className}`} style={style}>
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700">
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
              ⚠️ Ad Load Error
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`} style={style}>
      {/* 广告标签 */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            📱 Advertisement
          </span>
        </div>
      </div>

      {/* Google AdSense 广告容器 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <ins
          className="adsbygoogle block"
          style={{
            display: 'block',
            minHeight: adType === 'multiplex' ? '280px' : '200px',
            width: '100%',
            ...style
          }}
          data-ad-client={ADS_CONFIG.GOOGLE_ADSENSE.publisherId}
          data-ad-slot={finalSlot}
          data-ad-format={finalFormat}
          data-full-width-responsive="true"
          {...(finalLayout && { 'data-ad-layout': finalLayout })}
          {...(finalLayoutKey && { 'data-ad-layout-key': finalLayoutKey })}
        />
      </div>

      {/* 合规提示 */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Ad content is monitored for compliance with Google AdSense policies
        </p>
      </div>
    </div>
  )
}

// 特定类型的Google AdSense组件
export function GoogleDisplayAd(props: Omit<GoogleAdsenseProps, 'adType'>) {
  return <GoogleAdsense {...props} adType="display" />
}

export function GoogleInFeedAd(props: Omit<GoogleAdsenseProps, 'adType'>) {
  return <GoogleAdsense {...props} adType="infeed" />
}

export function GoogleInArticleAd(props: Omit<GoogleAdsenseProps, 'adType'>) {
  return <GoogleAdsense {...props} adType="inarticle" />
}

export function GoogleMultiplexAd(props: Omit<GoogleAdsenseProps, 'adType'>) {
  return <GoogleAdsense {...props} adType="multiplex" />
} 