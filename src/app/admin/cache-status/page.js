"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getInitStatus } from "@/lib/init";
import styles from "./styles.module.css";

export default function CacheStatusPage() {
  const [status, setStatus] = useState({
    isInitialized: false,
    hasChangeStream: false,
    lastChecked: null,
  });

  const [systemInfo, setSystemInfo] = useState({
    nextVersion: "Loading...",
    nodeVersion: "Loading...",
    environment: "Loading...",
  });

  useEffect(() => {
    // 获取初始化状态
    const initStatus = getInitStatus();
    setStatus({
      ...initStatus,
      lastChecked: new Date().toISOString(),
    });

    // 获取系统信息
    const getSystemInfo = async () => {
      try {
        // 从 API 获取系统信息
        const response = await fetch("/api/system-info");
        if (response.ok) {
          const data = await response.json();
          setSystemInfo(data);
        }
      } catch (error) {
        console.error("获取系统信息失败:", error);
        setSystemInfo({
          nextVersion: "获取失败",
          nodeVersion: "获取失败",
          environment: process.env.NODE_ENV || "unknown",
        });
      }
    };

    getSystemInfo();

    // 定期刷新状态
    const interval = setInterval(() => {
      const refreshedStatus = getInitStatus();
      setStatus({
        ...refreshedStatus,
        lastChecked: new Date().toISOString(),
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date);
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>缓存和数据库监听状态</h1>
        <Link href="/" className={styles.backLink}>
          ← 返回首页
        </Link>
      </header>

      <section className={styles.infoPanel}>
        <h2>系统状态</h2>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <td>Next.js 版本</td>
              <td>{systemInfo.nextVersion}</td>
            </tr>
            <tr>
              <td>Node.js 版本</td>
              <td>{systemInfo.nodeVersion}</td>
            </tr>
            <tr>
              <td>环境</td>
              <td>{systemInfo.environment}</td>
            </tr>
            <tr>
              <td>最后检查时间</td>
              <td>{formatDate(status.lastChecked)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.statusPanel}>
        <h2>数据库监听状态</h2>
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>初始化状态</h3>
              <span
                className={
                  status.isInitialized ? styles.statusOn : styles.statusOff
                }
              >
                {status.isInitialized ? "已初始化" : "未初始化"}
              </span>
            </div>
            <p className={styles.statusDescription}>
              应用是否已成功初始化并启动所有必要的服务
            </p>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>数据库变更监听</h3>
              <span
                className={
                  status.hasChangeStream ? styles.statusOn : styles.statusOff
                }
              >
                {status.hasChangeStream ? "已连接" : "未连接"}
              </span>
            </div>
            <p className={styles.statusDescription}>
              数据库变更流是否已成功连接并正在监听文章更新
            </p>
          </div>
        </div>
      </section>

      <section className={styles.infoPanel}>
        <h2>ISR 缓存信息</h2>
        <p>
          使用 ISR (增量静态生成) 策略缓存页面，设置的重新验证时间为 3600 秒
          (1小时)。 当数据库中的内容发生变化时，系统会自动重新验证并更新缓存。
        </p>
        <div className={styles.featureList}>
          <div className={styles.feature}>
            <h3>自动重新验证</h3>
            <p>通过数据库变更流监听内容更新，无需手动触发</p>
          </div>
          <div className={styles.feature}>
            <h3>性能优化</h3>
            <p>缓存页面内容，减少数据库查询，提高响应速度</p>
          </div>
          <div className={styles.feature}>
            <h3>内容新鲜度</h3>
            <p>当内容发生变化时，自动刷新受影响的页面</p>
          </div>
        </div>
      </section>
    </div>
  );
}
