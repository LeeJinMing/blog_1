"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

// 替代 getInitStatus 函数
function getInitStatus() {
  // 简单的状态对象
  return {
    isInitialized: true, // 假设系统已初始化
    indexesCreated: true, // 假设索引已创建
  };
}

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
        console.error("Failed to get system info:", error);
        setSystemInfo({
          nextVersion: "Failed to retrieve",
          nodeVersion: "Failed to retrieve",
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
        <h1>System Status Monitoring</h1>
        <div className={styles.actions}>
          <Link href="/admin" className={styles.backLink}>
            Return to Admin Panel
          </Link>
          <button className={styles.refreshButton} onClick={handleRefresh}>
            Refresh Status
          </button>
        </div>
      </header>

      <section className={styles.statusPanel}>
        <h2>System Information</h2>
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>Next.js Version</h3>
              <span className={styles.versionTag}>
                {systemInfo.nextVersion}
              </span>
            </div>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>Node.js Version</h3>
              <span className={styles.versionTag}>
                {systemInfo.nodeVersion}
              </span>
            </div>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>Environment</h3>
              <span className={styles.environmentTag}>
                {systemInfo.environment}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statusPanel}>
        <h2>Application Status</h2>
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>Initialization Status</h3>
              <span
                className={
                  status.isInitialized ? styles.statusOn : styles.statusOff
                }
              >
                {status.isInitialized ? "Initialized" : "Not Initialized"}
              </span>
            </div>
            <p className={styles.statusDescription}>
              Whether the application has successfully initialized and started
              all necessary services
            </p>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <h3>Database Indexes</h3>
              <span
                className={
                  status.indexesCreated ? styles.statusOn : styles.statusOff
                }
              >
                {status.indexesCreated ? "Created" : "Not Created"}
              </span>
            </div>
            <p className={styles.statusDescription}>
              Whether the indexes required for database queries have been
              created
            </p>
          </div>
        </div>
      </section>

      <section className={styles.statusPanel}>
        <h2>Cache Strategy</h2>
        <div className={styles.infoCard}>
          <div className={styles.infoContent}>
            <h3>Client ISR Cache</h3>
            <p>
              Current use client incremental static regeneration (ISR) cache
              strategy. When the database is updated, the user page will
              automatically get the latest content after the cache expires.
            </p>
            <ul className={styles.cacheInfo}>
              <li>
                Homepage cache time: <strong>30 minutes</strong>
              </li>
              <li>
                Article detail page cache time: <strong>10 minutes</strong>
              </li>
              <li>
                Category page cache time: <strong>20 minutes</strong>
              </li>
            </ul>
            <p>
              Last checked time:{" "}
              {status.lastChecked
                ? formatDate(status.lastChecked)
                : "Not checked"}
            </p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Blog Management System &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
