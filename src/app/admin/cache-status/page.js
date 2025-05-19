"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getInitStatus } from "@/lib/init";
import styles from "./styles.module.css";

export default function CacheStatusPage() {
  const [status, setStatus] = useState({
    isInitialized: false,
    indexesCreated: false,
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

  // 手动触发页面刷新
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>系统状态监控</h1>
        <div className={styles.actions}>
          <Link href="/admin" className={styles.backLink}>
            返回管理面板
          </Link>
          <button className={styles.refreshButton} onClick={handleRefresh}>
            刷新状态
          </button>
        </div>
      </header>

      <section className={styles.statusPanel}>
        <h2>系统信息</h2>
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>Next.js 版本</h3>
              <span className={styles.versionTag}>
                {systemInfo.nextVersion}
              </span>
            </div>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>Node.js 版本</h3>
              <span className={styles.versionTag}>
                {systemInfo.nodeVersion}
              </span>
            </div>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>运行环境</h3>
              <span className={styles.environmentTag}>
                {systemInfo.environment}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statusPanel}>
        <h2>应用状态</h2>
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
              <h3>数据库索引</h3>
              <span
                className={
                  status.indexesCreated ? styles.statusOn : styles.statusOff
                }
              >
                {status.indexesCreated ? "已创建" : "未创建"}
              </span>
            </div>
            <p className={styles.statusDescription}>
              数据库查询所需的索引是否已创建
            </p>
          </div>
        </div>
      </section>

      <section className={styles.statusPanel}>
        <h2>缓存策略</h2>
        <div className={styles.infoCard}>
          <div className={styles.infoContent}>
            <h3>客户端 ISR 缓存</h3>
            <p>
              当前使用客户端增量静态再生成 (ISR)
              缓存策略。当数据库更新时，用户页面会在缓存过期后自动获取最新内容。
            </p>
            <ul className={styles.cacheInfo}>
              <li>
                首页缓存时间: <strong>30分钟</strong>
              </li>
              <li>
                文章详情页缓存时间: <strong>10分钟</strong>
              </li>
              <li>
                分类页面缓存时间: <strong>20分钟</strong>
              </li>
            </ul>
            <p>
              最近检查时间:{" "}
              {status.lastChecked ? formatDate(status.lastChecked) : "未检查"}
            </p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>博客管理系统 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
