'use client'

import { useEffect, useState } from 'react'
import { shouldShowAd, isDevelopment } from '@/config/ads-config'
import { GoogleAdsense, GoogleDisplayAd, GoogleInFeedAd, GoogleInArticleAd, GoogleMultiplexAd } from './GoogleAdsense'

// 违规内容关键词列表
const BLOCKED_KEYWORDS = [
  // 赌博相关
  'casino', 'gambling', 'poker', 'slots', 'bet', 'betting', 'wagering',
  'roulette', 'blackjack', 'lottery', 'jackpot', 'spin to win',
  'online casino', 'sports betting', 'live casino', 'real money',

  // 成人约会
  'dating', 'hookup', 'meet girls', 'meet women', 'adult dating',
  'sexy girls', 'hot girls', 'beautiful girls', 'singles in your area',
  'find love', 'chat with girls', 'webcam', 'cam girls', 'live chat',
  'escort', 'sugar daddy', 'sugar baby', 'adult personals',

  // 加密货币赌博
  'crypto casino', 'bitcoin gambling', 'ethereum betting',
  'crypto betting', 'btc casino', 'usdt casino', 'crypto slots',

  // 其他可疑内容
  'get rich quick', 'instant money', 'guaranteed profit',
  'miracle cure', 'lose weight fast', 'anti-aging', 'enhancement pills'
]

// 广告配置
export const AD_CONFIG = {
  // Native Banner 配置
  NATIVE: {
    SCRIPT_URL: '//traverseseven.com/286b7c3c4b411bead9e284ad6036f16b/invoke.js',
    CONTAINER_ID: 'container-286b7c3c4b411bead9e284ad6036f16b',
    SCRIPT_ID: 'traverse-seven-native-script'
  },
  // Popunder 配置 (从后台获取)
  POPUNDER: {
    SCRIPT_URL: '//traverseseven.com/POPUNDER_ID/invoke.js', // 需要替换为实际ID
    CONTAINER_ID: 'container-POPUNDER_ID',
    SCRIPT_ID: 'traverse-seven-popunder-script'
  }
}

// 广告合规事件类型
interface ComplianceEvent {
  id: string
  timestamp: number
  type: 'gambling' | 'adult_dating' | 'crypto_gambling' | 'suspicious' | 'other'
  content: string
  action: 'blocked' | 'flagged'
  position: string
}

// 存储违规事件到本地存储
function logComplianceEvent(event: Omit<ComplianceEvent, 'id' | 'timestamp'>) {
  if (typeof window === 'undefined') return

  const fullEvent: ComplianceEvent = {
    ...event,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now()
  }

  const existing = JSON.parse(localStorage.getItem('ad_compliance_events') || '[]')
  existing.push(fullEvent)

  // 只保留最近100条记录
  if (existing.length > 100) {
    existing.splice(0, existing.length - 100)
  }

  localStorage.setItem('ad_compliance_events', JSON.stringify(existing))
}

// 分类违规内容类型
function categorizeViolation(content: string): ComplianceEvent['type'] {
  const lowerContent = content.toLowerCase()

  if (lowerContent.includes('casino') || lowerContent.includes('gambling') ||
    lowerContent.includes('bet') || lowerContent.includes('poker')) {
    return 'gambling'
  }

  if (lowerContent.includes('dating') || lowerContent.includes('girls') ||
    lowerContent.includes('hookup') || lowerContent.includes('sexy')) {
    return 'adult_dating'
  }

  if (lowerContent.includes('crypto casino') || lowerContent.includes('bitcoin gambling') ||
    lowerContent.includes('btc') || lowerContent.includes('usdt')) {
    return 'crypto_gambling'
  }

  return 'suspicious'
}

// 监控广告内容
function monitorAdContent(containerId: string, position: string) {
  if (typeof window === 'undefined') return

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const container = document.getElementById(containerId)
        if (!container) return

        const textContent = container.textContent || ''
        const hasViolation = BLOCKED_KEYWORDS.some(keyword =>
          textContent.toLowerCase().includes(keyword.toLowerCase())
        )

        if (hasViolation) {
          // 隐藏违规广告
          container.style.display = 'none'

          // 记录违规事件
          logComplianceEvent({
            type: categorizeViolation(textContent),
            content: textContent.substring(0, 200),
            action: 'blocked',
            position
          })

          console.warn(`[广告合规] 检测到违规内容并已屏蔽: ${position}`)
        }
      }
    })
  })

  // 延迟启动监控，等待广告加载
  setTimeout(() => {
    const container = document.getElementById(containerId)
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }
  }, 2000)

  // 3分钟后停止监控
  setTimeout(() => {
    observer.disconnect()
  }, 180000)
}

interface AdManagerProps {
  adType: 'native' | 'popunder' | 'both' | 'google_display' | 'google_infeed' | 'google_inarticle' | 'google_multiplex'
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'footer'
  className?: string
  containerClass?: string
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function AdManager({
  adType = 'google_display',
  position = 'middle',
  className = '',
  containerClass = '',
  showLabel = true,
  size = 'medium'
}: AdManagerProps) {
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsDev(isDevelopment())
  }, [])

  // 如果是第三方广告类型，检查是否应该显示
  const isThirdPartyAd = adType === 'native' || adType === 'popunder' || adType === 'both'
  const isGoogleAd = adType.startsWith('google_')

  // 第三方广告已禁用，显示替代的Google AdSense
  if (isThirdPartyAd) {
    if (!shouldShowAd('third_party')) {
      // 显示禁用提示（仅开发环境）
      if (isDev) {
        return (
          <div className={`w-full ${className}`}>
            <div className="text-center mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                  🔴 Third-party ads disabled
                </span>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-700 shadow-sm p-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Third-party Ads Disabled
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  TraverseSeven ads have been disabled. Using Google AdSense instead for better compliance and revenue.
                </p>
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800/50 rounded-lg p-3">
                  <p className="font-medium mb-1">Reason:</p>
                  <p>• Better compliance with Google AdSense policies</p>
                  <p>• Improved user experience</p>
                  <p>• Reduced risk of policy violations</p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      // 生产环境用Google AdSense替代
      return <GoogleDisplayAd className={className} position={position} />
    }
  }

  // Google AdSense 广告
  if (isGoogleAd) {
    switch (adType) {
      case 'google_display':
        return <GoogleDisplayAd className={className} position={position} />
      case 'google_infeed':
        return <GoogleInFeedAd className={className} position={position} />
      case 'google_inarticle':
        return <GoogleInArticleAd className={className} position={position} />
      case 'google_multiplex':
        return <GoogleMultiplexAd className={className} position={position} />
      default:
        return <GoogleDisplayAd className={className} position={position} />
    }
  }

  // 兜底：返回Google Display广告
  return <GoogleDisplayAd className={className} position={position} />
}

// 简化版原生广告组件（向后兼容）
export function NativeAd({ className = '' }: { className?: string }) {
  return (
    <AdManager
      adType="native"
      position="middle"
      className={className}
      showLabel={true}
      size="medium"
    />
  )
} 