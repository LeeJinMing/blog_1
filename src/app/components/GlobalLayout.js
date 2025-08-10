"use client";

import { Suspense } from "react";
import SidebarContainer from "./SidebarContainer";
import styles from "./GlobalLayout.module.css";

export default function GlobalLayout({ children }) {
  return (
    <div className={styles.globalLayout}>
      <div className={styles.contentWithSidebar}>
        {/* Main content area */}
        <section className={styles.mainContent}>{children}</section>

        {/* Global sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.stickySidebar}>
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
          </div>
        </aside>
      </div>
    </div>
  );
}
