'use client'

import { useEffect, useState } from 'react'

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
  adType: 'native' | 'popunder' | 'both'
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'footer'
  className?: string
  containerClass?: string
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function AdManager({
  adType = 'native',
  position = 'middle',
  className = '',
  containerClass = '',
  showLabel = true,
  size = 'medium'
}: AdManagerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isDevelopment, setIsDevelopment] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    // 检查开发环境
    const isDev = window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('localhost')

    setIsDevelopment(isDev)

    if (isDev) return

    // 加载对应的广告脚本
    loadAdScript(adType)
  }, [adType])

  useEffect(() => {
    // 启动内容监控
    if (!isDevelopment && adType !== 'popunder') {
      monitorAdContent(AD_CONFIG.NATIVE.CONTAINER_ID, position)
    }
  }, [isDevelopment, adType, position])

  const loadAdScript = (type: 'native' | 'popunder' | 'both') => {
    if (type === 'native' || type === 'both') {
      loadScript(AD_CONFIG.NATIVE)
    }
    if (type === 'popunder' || type === 'both') {
      // Popunder 通常自动触发，不需要容器
      loadScript(AD_CONFIG.POPUNDER)
    }
  }

  const loadScript = (config: any) => {
    const existingScript = document.getElementById(config.SCRIPT_ID)

    if (!existingScript) {
      const script = document.createElement('script')
      script.id = config.SCRIPT_ID
      script.async = true
      script.setAttribute('data-cfasync', 'false')
      script.src = config.SCRIPT_URL

      script.onload = () => {
        setIsLoaded(true)
        setHasError(false)
      }

      script.onerror = () => {
        setHasError(true)
        setIsLoaded(false)
      }

      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }
  }

  // 开发环境显示
  if (isDevelopment) {
    return (
      <div className={`w-full ${className}`}>
        {showLabel && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                💰 Sponsored Content ({adType} - {position}) - 合规监控已启用 🛡️
              </span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-sm p-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <span className="text-xl">🛡️</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {adType.toUpperCase()} Ad - {position} position
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Development Environment - 广告合规系统已激活
            </p>
            <div className="mt-3 text-xs text-blue-500 dark:text-blue-400">
              <p>✓ 实时内容过滤</p>
              <p>✓ 违规自动屏蔽</p>
              <p>✓ Google AdSense合规保护</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 错误处理
  if (hasError) {
    return null // 静默失败，不影响用户体验
  }

  // 如果被合规系统屏蔽
  if (isBlocked) {
    return null
  }

  // 只渲染 Native Banner（Popunder 是自动的）
  if (adType === 'popunder') {
    return null // Popunder 不需要容器
  }

  // 根据尺寸调整样式
  const sizeClasses = {
    small: 'min-h-[150px]',
    medium: 'min-h-[200px]',
    large: 'min-h-[300px]'
  }

  const positionClasses = {
    top: 'mb-8',
    middle: 'my-8',
    bottom: 'mt-8',
    sidebar: 'mb-6',
    footer: 'mt-6'
  }

  return (
    <div className={`w-full ${className} ${positionClasses[position]}`}>
      {showLabel && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              💰 Sponsored Content
            </span>
          </div>
        </div>
      )}

      <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-all duration-300 hover:shadow-md ${containerClass}`}>
        <div
          id={AD_CONFIG.NATIVE.CONTAINER_ID}
          className={`w-full ${sizeClasses[size]}`}
          style={{
            display: 'block',
            minHeight: sizeClasses[size].split('-')[1].replace('[', '').replace(']', ''),
            textAlign: 'center'
          }}
        >
          {!isLoaded && (
            <div className="flex items-center justify-center h-full py-16">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading sponsored content...</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">🛡️ 合规检查中...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
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