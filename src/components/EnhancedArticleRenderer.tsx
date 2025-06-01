'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { AdManager } from './AdManager'

interface EnhancedArticleRendererProps {
  content: string
  enableAds?: boolean
  adPositions?: {
    first: number   // 第一个广告位置 (25%)
    second: number  // 第二个广告位置 (60%) 
    third: number   // 第三个广告位置 (85%)
  }
}

export function EnhancedArticleRenderer({
  content,
  enableAds = true,
  adPositions = { first: 0.25, second: 0.6, third: 0.85 }
}: EnhancedArticleRendererProps) {

  // 分割内容为段落
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
  const totalParagraphs = paragraphs.length

  // 计算广告插入位置
  const adInsertPoints = {
    first: Math.floor(totalParagraphs * adPositions.first),
    second: Math.floor(totalParagraphs * adPositions.second),
    third: Math.floor(totalParagraphs * adPositions.third)
  }

  // 组装最终内容
  const assembleContent = () => {
    const result: (string | JSX.Element)[] = []

    paragraphs.forEach((paragraph, index) => {
      // 添加当前段落
      result.push(paragraph)

      // 在指定位置插入广告
      if (enableAds) {
        if (index === adInsertPoints.first && totalParagraphs > 5) {
          result.push(
            <div key={`ad-first-${index}`} className="my-8">
              <AdManager
                adType="native"
                position="middle"
                size="large"
                className="animate-fade-in"
                showLabel={true}
              />
            </div>
          )
        }

        if (index === adInsertPoints.second && totalParagraphs > 8) {
          result.push(
            <div key={`ad-second-${index}`} className="my-8">
              <AdManager
                adType="native"
                position="middle"
                size="medium"
                className="animate-fade-in"
                showLabel={true}
              />
            </div>
          )
        }

        if (index === adInsertPoints.third && totalParagraphs > 12) {
          result.push(
            <div key={`ad-third-${index}`} className="my-8">
              <AdManager
                adType="native"
                position="middle"
                size="large"
                className="animate-fade-in"
                showLabel={true}
              />
            </div>
          )
        }
      }

      // 添加段落分隔
      if (index < paragraphs.length - 1) {
        result.push('\n\n')
      }
    })

    return result
  }

  const assembledContent = assembleContent()

  return (
    <div className="enhanced-article-content">
      {assembledContent.map((item, index) => {
        if (typeof item === 'string') {
          return (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              className="prose prose-lg dark:prose-invert max-w-none"
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6 font-mono text-sm">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <div className="my-6">
                    <img
                      src={src}
                      alt={alt}
                      className="w-full h-auto rounded-lg shadow-md"
                      loading="lazy"
                    />
                    {alt && (
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {alt}
                      </p>
                    )}
                  </div>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    {children}
                  </td>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900 dark:text-white">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-800 dark:text-gray-200">
                    {children}
                  </em>
                )
              }}
            >
              {item}
            </ReactMarkdown>
          )
        } else {
          // 渲染广告组件
          return item
        }
      })}
    </div>
  )
} 