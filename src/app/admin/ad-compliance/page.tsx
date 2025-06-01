'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 合规事件类型
interface ComplianceEvent {
  id: string
  timestamp: number
  type: 'gambling' | 'adult_dating' | 'crypto_gambling' | 'suspicious' | 'other'
  content: string
  action: 'blocked' | 'flagged'
  position: string
}

// 合规统计
interface ComplianceStats {
  totalAds: number
  blockedAds: number
  complianceRate: number
  riskLevel: 'low' | 'medium' | 'high'
}

export default function AdCompliancePage() {
  const [events, setEvents] = useState<ComplianceEvent[]>([])
  const [stats, setStats] = useState<ComplianceStats>({
    totalAds: 0,
    blockedAds: 0,
    complianceRate: 100,
    riskLevel: 'low'
  })
  const [filter, setFilter] = useState<'all' | ComplianceEvent['type']>('all')

  useEffect(() => {
    // 从本地存储加载合规事件
    const loadEvents = () => {
      if (typeof window === 'undefined') return

      const storedEvents = JSON.parse(localStorage.getItem('ad_compliance_events') || '[]')
      setEvents(storedEvents)

      // 计算统计数据
      const totalAds = 50 // 估算的广告总数
      const blockedAds = storedEvents.length
      const complianceRate = totalAds > 0 ? ((totalAds - blockedAds) / totalAds) * 100 : 100

      let riskLevel: 'low' | 'medium' | 'high' = 'low'
      if (complianceRate < 80) riskLevel = 'high'
      else if (complianceRate < 95) riskLevel = 'medium'

      setStats({
        totalAds,
        blockedAds,
        complianceRate: Math.max(0, complianceRate),
        riskLevel
      })
    }

    loadEvents()

    // 每30秒刷新一次
    const interval = setInterval(loadEvents, 30000)
    return () => clearInterval(interval)
  }, [])

  const clearEvents = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ad_compliance_events')
      setEvents([])
      setStats({
        totalAds: 50,
        blockedAds: 0,
        complianceRate: 100,
        riskLevel: 'low'
      })
    }
  }

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(event => event.type === filter)

  const getEventTypeIcon = (type: ComplianceEvent['type']) => {
    switch (type) {
      case 'gambling': return '🎰'
      case 'adult_dating': return '💋'
      case 'crypto_gambling': return '₿'
      case 'suspicious': return '⚠️'
      default: return '❓'
    }
  }

  const getEventTypeColor = (type: ComplianceEvent['type']) => {
    switch (type) {
      case 'gambling': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      case 'adult_dating': return 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400'
      case 'crypto_gambling': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
      case 'suspicious': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🛡️ 广告合规监控中心
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                实时监控广告内容，确保Google AdSense政策合规
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">广告总数</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAds}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <span className="text-2xl">🚫</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">违规屏蔽</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.blockedAds}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">合规率</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.complianceRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">风险级别</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(stats.riskLevel)}`}>
                  {stats.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 合规状态总览 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📈 合规状态总览</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">合规系统已激活</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">实时监控所有广告内容，自动屏蔽违规广告</p>
                </div>
              </div>
            </div>

            {stats.riskLevel === 'high' && (
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-300">高风险警告</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">违规率过高，建议立即联系TraverseSeven调整过滤设置</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔒</span>
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">Google AdSense保护</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">阻止赌博和成人内容，保护AdSense账户安全</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 事件列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">🚨 违规事件记录</h2>
              <div className="flex items-center space-x-4">
                {/* 过滤器 */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">所有类型</option>
                  <option value="gambling">赌博内容</option>
                  <option value="adult_dating">成人约会</option>
                  <option value="crypto_gambling">加密货币赌博</option>
                  <option value="suspicious">可疑内容</option>
                </select>

                <button
                  onClick={clearEvents}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  清空记录
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🎉</span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  暂无违规事件
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  广告内容合规，系统运行正常
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
                              {event.type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              位置: {event.position}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {event.content.length > 100
                              ? `${event.content.substring(0, 100)}...`
                              : event.content
                            }
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>操作: {event.action === 'blocked' ? '已屏蔽' : '已标记'}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(event.timestamp).toLocaleString('zh-CN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 解决方案建议 */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💡 解决方案建议</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">立即行动项</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>• 联系TraverseSeven客服调整广告过滤设置</p>
                <p>• 要求禁用赌博和成人内容分类</p>
                <p>• 启用高级内容过滤选项</p>
                <p>• 定期检查广告合规状态</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">长期保护措施</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>• 保持系统监控24/7运行</p>
                <p>• 定期更新违规关键词列表</p>
                <p>• 监控Google AdSense政策更新</p>
                <p>• 建立广告商白名单机制</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 