import { startChangeStream } from "./cache";
import { createIndexes } from "./mongo";

// 存储全局变量以跟踪初始化状态
let isInitialized = false;
let changeStream = null;
let indexesCreated = false;

/**
 * 初始化应用程序，设置数据库变更监听和创建索引
 * 该函数确保即使多个页面加载，初始化过程也只会执行一次
 */
export async function initializeApp() {
  // 防止重复初始化
  if (isInitialized) {
    return;
  }

  // 在开发模式下可能会打印多次，但只会初始化一次
  console.log("正在初始化应用...");

  try {
    // 创建数据库索引 - 这在生产环境中只会运行一次
    if (!indexesCreated) {
      await createIndexes();
      indexesCreated = true;
    }

    // 启动数据库变更监听
    changeStream = await startChangeStream();

    // 设置在应用关闭时清理资源
    if (typeof process !== "undefined") {
      process.on("SIGTERM", cleanup);
      process.on("SIGINT", cleanup);
    }

    isInitialized = true;
    console.log("应用初始化完成，数据库变更监听已启动");
  } catch (error) {
    console.error("应用初始化失败:", error);
  }
}

/**
 * 清理资源，关闭变更流
 */
async function cleanup() {
  console.log("正在关闭应用...");

  if (changeStream) {
    try {
      await changeStream.close();
      console.log("成功关闭数据库变更流");
    } catch (error) {
      console.error("关闭变更流时出错:", error);
    }
  }

  // 如果有其他需要清理的资源，可以在这里添加
}

// 导出一个可在各处使用的获取初始化状态的函数
// 修改为在客户端和服务器端都能安全使用
export function getInitStatus() {
  // 在客户端上使用默认值而不尝试访问服务器状态
  if (typeof window !== "undefined") {
    return {
      isInitialized: false,
      hasChangeStream: false,
      indexesCreated: false,
    };
  }

  // 服务器端返回实际状态
  return {
    isInitialized,
    hasChangeStream: !!changeStream,
    indexesCreated,
  };
}
