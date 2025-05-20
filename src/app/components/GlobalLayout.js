"use client";

import { Suspense } from "react";
import SidebarContainer from "./SidebarContainer";
import ClientAdPlaceholder from "./ClientAdPlaceholder";
import styles from "./GlobalLayout.module.css";

export default function GlobalLayout({ children }) {
  return (
    <div className={styles.globalLayout}>
      <div className="top-ad-container">
        <ClientAdPlaceholder size="leaderboard" position="header" />
      </div>

      <div className={styles.contentWithSidebar}>
        {/* Main content area */}
        <section className={styles.mainContent}>{children}</section>

        {/* Global sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.stickySidebar}>
            {/* Sidebar top ad */}
            <div className={styles.sidebarAd}>
              <ClientAdPlaceholder
                size="rectangle"
                position="sidebar"
                theme="brand"
              />
            </div>

            {/* Using client-side SidebarContainer */}
            <Suspense
              fallback={
                <div className={styles.sidebarLoading}>
                  Loading sidebar content...
                </div>
              }
            >
              <SidebarContainer />
            </Suspense>

            {/* Sidebar middle ad */}
            <div className={styles.sidebarAd}>
              <ClientAdPlaceholder size="skyscraper" position="sidebar" />
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom ad */}
      <div className="bottom-ad-container">
        <ClientAdPlaceholder size="leaderboard" position="footer" />
      </div>
    </div>
  );
}
