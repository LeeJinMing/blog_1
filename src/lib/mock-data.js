// lib/mock-data.js
export const mockPosts = [
  {
    id: 1,
    date: "2025-05-08", // 年-月-日
    slug: "nextjs-15-release-features",
    title: "Next.js 15 发布：新特性一览",
    summary: "Next.js 团队刚刚发布了 v15 版本，带来了许多令人兴奋的新功能和性能改进。",
    content: "这是 Next.js 15 发布的详细内容..."
  },
  {
    id: 2,
    date: "2025-04-20",
    slug: "mongodb-getting-started-guide",
    title: "MongoDB 入门指南",
    summary: "MongoDB 是一个流行的 NoSQL 数据库，本文将带你了解其基本概念和操作。",
    content: "MongoDB 的详细介绍和使用方法..."
  },
  {
    id: 3,
    date: "2025-03-15",
    slug: "deploy-nextjs-app-on-vercel",
    title: "Vercel 部署 Next.js 应用教程",
    summary: "Vercel 提供了便捷的 Next.js 应用部署方案，让我们一步步学习如何操作。",
    content: "Vercel 部署的步骤和注意事项..."
  },
  {
    id: 4,
    date: "2025-02-10",
    slug: "javascript-async-promises-await",
    title: "JavaScript 异步编程：Promises 和 Async/Await",
    summary: "深入理解 JavaScript 中的 Promises 和 Async/Await，让异步代码更易读写。",
    content: "关于 Promises 和 Async/Await 的详细解释..."
  },
  {
    id: 5,
    date: "2025-01-05",
    slug: "thoughts-on-building-modern-blog-system",
    title: "构建现代博客系统的思考",
    summary: "在开始构建博客系统之前，我们需要考虑哪些方面？技术选型、功能设计等。",
    content: "构建博客系统需要考虑的各个方面..."
  },
];

// 辅助函数：从日期字符串中提取年、月、日
export function formatDateToYYYYMMDD(dateInput) {
  const date = new Date(dateInput); // 能处理 "YYYY-MM-DD" 字符串和 Date 对象
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}
