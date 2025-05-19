import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import EnhancedSearch from "./components/EnhancedSearch";
import NavMenu from "./components/NavMenu";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import { initializeApp } from "@/lib/init";

export const metadata = {
  title: "Insights Blog | Thoughtful Analysis on Global Affairs",
  description:
    "In-depth analysis and thoughtful perspectives on business, technology, and global affairs.",
};

// 尝试初始化应用，设置数据库变更监听
// 由于这是一个异步操作，我们不会在这里等待完成，避免阻塞页面渲染
initializeApp().catch((error) => {
  console.error("Failed to initialize app in layout:", error);
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="header">
          <div className="container header-inner">
            <Link href="/" className="site-title">
              Insights Blog
            </Link>
            <div className="header-right">
              <NavMenu />
              <EnhancedSearch />
            </div>
          </div>
        </header>

        <main className="main">{children}</main>

        <footer className="footer">
          <div className="container">
            <p>
              © {new Date().getFullYear()} Insights Blog. All rights reserved.
            </p>
          </div>
        </footer>

        {/* Vercel Analytics for visitor tracking */}
        <AnalyticsWrapper />

        {/* Vercel Speed Insights for performance monitoring */}
        <SpeedInsights />
      </body>
    </html>
  );
}
