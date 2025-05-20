"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import styles from "./settings.module.css";

// 在客户端组件中动态导入设置组件
const ClientSettings = dynamic(() => import("./client-settings"), {
  ssr: false, // 禁用服务器端渲染，仅在客户端渲染
});

export default function ClientWrapper() {
  return (
    <Suspense
      fallback={
        <div className={styles.settingsContainer}>
          <div className={styles.settingsHeader}>
            <h1 className={styles.settingsTitle}>Settings</h1>
            <p className={styles.settingsDescription}>
              Loading settings page...
            </p>
          </div>
        </div>
      }
    >
      <ClientSettings />
    </Suspense>
  );
}
