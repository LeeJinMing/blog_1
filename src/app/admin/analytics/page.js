"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

export default function AnalyticsPage() {
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [debugEvents, setDebugEvents] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  // 用于测试事件的函数
  const triggerTestEvent = (type) => {
    if (typeof window === "undefined") {
      console.error("Window object not available");
      return;
    }

    // 确保Vercel Analytics可用
    if (!window.va) {
      console.error("Vercel Analytics not initialized");
      setDebugEvents((prev) =>
        [
          {
            id: Date.now(),
            type,
            timestamp: new Date().toISOString(),
            success: false,
            error: "Vercel Analytics not initialized",
          },
          ...prev,
        ].slice(0, 10)
      );
      return;
    }

    const timestamp = new Date().toISOString();

    try {
      switch (type) {
        case "pageview":
          window.va("event", {
            name: "test_pageview",
            timestamp,
            data: { page: "/admin/analytics", referrer: document.referrer },
          });
          break;
        case "click":
          window.va("event", {
            name: "test_click",
            timestamp,
            data: { element: "test-button", page: "/admin/analytics" },
          });
          break;
        case "custom":
          window.va("event", {
            name: "test_custom_event",
            timestamp,
            data: { message: "Hello from debug panel", value: Math.random() },
          });
          break;
        default:
          break;
      }

      // 添加到调试事件列表
      const newEvent = {
        id: Date.now(),
        type,
        timestamp,
        success: true,
      };

      setDebugEvents((prev) => [newEvent, ...prev].slice(0, 10));
    } catch (error) {
      console.error("Error triggering event:", error);
      // 记录事件失败
      const newEvent = {
        id: Date.now(),
        type,
        timestamp,
        success: false,
        error: error.message,
      };

      setDebugEvents((prev) => [newEvent, ...prev].slice(0, 10));
    }
  };

  useEffect(() => {
    // 检查Vercel Analytics是否可用
    if (typeof window !== "undefined") {
      setEventsEnabled(!!window.va);

      // 配置模式
      if (window.va && process.env.NODE_ENV === "development") {
        window.va("debug", true);
      }
    }

    // 定期检查状态
    const interval = setInterval(() => {
      if (typeof window !== "undefined") {
        setEventsEnabled(!!window.va);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analytics Debug Console</h1>
        <Link href="/" className={styles.backLink}>
          ← Back to Homepage
        </Link>
      </div>

      <div className={styles.statusPanel}>
        <h2>Analytics Status</h2>
        <div className={styles.statusRow}>
          <span>Vercel Analytics:</span>
          <span
            className={
              eventsEnabled ? styles.statusActive : styles.statusInactive
            }
          >
            {eventsEnabled ? "Active" : "Inactive"}
          </span>
        </div>
        <div className={styles.statusRow}>
          <span>Environment:</span>
          <span>{process.env.NODE_ENV}</span>
        </div>
        <div className={styles.statusRow}>
          <span>Debug Mode:</span>
          <span>
            {process.env.NODE_ENV === "development" ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      <div className={styles.testPanel}>
        <h2>Test Analytics Events</h2>
        <p>Send test events to verify analytics configuration:</p>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => triggerTestEvent("pageview")}
            disabled={!eventsEnabled}
            className={styles.button}
          >
            Test Page View
          </button>
          <button
            onClick={() => triggerTestEvent("click")}
            disabled={!eventsEnabled}
            className={styles.button}
          >
            Test Click Event
          </button>
          <button
            onClick={() => triggerTestEvent("custom")}
            disabled={!eventsEnabled}
            className={styles.button}
          >
            Test Custom Event
          </button>
        </div>
      </div>

      {debugEvents.length > 0 && (
        <div className={styles.eventsPanel}>
          <h2>Recent Test Events</h2>
          <ul className={styles.eventsList}>
            {debugEvents.map((event) => (
              <li key={event.id} className={styles.eventItem}>
                <div className={styles.eventType}>
                  {event.type}
                  <span
                    className={
                      event.success ? styles.eventSuccess : styles.eventFailed
                    }
                  >
                    {event.success ? "✓" : "✗"}
                  </span>
                </div>
                <div className={styles.eventTime}>
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.infoPanel}>
        <h2>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={styles.infoToggle}
          >
            Analytics Integration Info {showInfo ? "▲" : "▼"}
          </button>
        </h2>

        {showInfo && (
          <div className={styles.infoContent}>
            <h3>Implementation Details:</h3>
            <ol>
              <li>
                Vercel Analytics is implemented via{" "}
                <code>@vercel/analytics</code> package
              </li>
              <li>
                The Analytics component is added to <code>layout.js</code>
              </li>
              <li>
                Custom events tracking is available in{" "}
                <code>lib/analytics.js</code>
              </li>
              <li>
                Events being tracked: page views, post views, tag clicks,
                searches, external link clicks
              </li>
            </ol>
            <p>
              View your analytics in the Vercel dashboard once data starts
              flowing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
