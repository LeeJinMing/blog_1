"use client";

import dynamic from "next/dynamic";

// 在客户端组件中动态导入ShareButtons
const ShareButtons = dynamic(() => import("@/app/components/ShareButtons"), {
  ssr: false,
  loading: () => <div>加载分享选项...</div>,
});

/**
 * 客户端分享按钮容器
 * 这个组件存在的目的是将动态导入逻辑移到客户端组件中，
 * 因为在服务器组件中不允许使用 `ssr: false` 选项
 *
 * @param {Object} props
 * @param {string} props.title - 文章标题
 * @param {string} props.summary - 文章摘要
 */
export default function ShareButtonsContainer({ title, summary }) {
  return <ShareButtons title={title} summary={summary} />;
}
