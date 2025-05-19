"use client"; // 这个标记表明这是一个客户端组件

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// 在客户端组件中动态导入EnhancedSidebar
const EnhancedSidebar = dynamic(() => import("./EnhancedSidebar"), {
  ssr: false,
  loading: () => <div className="sidebar-loading">加载中...</div>,
});

/**
 * 客户端侧边栏容器
 * 这个组件存在的目的是将动态导入逻辑移到客户端组件中，
 * 因为在服务器组件中不允许使用 `ssr: false` 选项
 */
export default function SidebarContainer() {
  // 可以在这里添加任何客户端逻辑，比如状态管理
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 确认我们现在在客户端环境
    setIsClient(true);
  }, []);

  // 渲染增强的侧边栏
  return <EnhancedSidebar />;
}
