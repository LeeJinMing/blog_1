import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import EnhancedSearch from "./components/EnhancedSearch";
import NavMenu from "./components/NavMenu";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import Script from "next/script";

/**
 * 站点默认全局元数据
 * 这些值将被其他页面的元数据覆盖（如果提供）
 */
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
  ),
  title: {
    template: "%s | Insights Blog",
    default: "Insights Blog | Thoughtful Analysis on Global Affairs",
  },
  description:
    "In-depth analysis and thoughtful perspectives on business, technology, and global affairs.",
  keywords:
    "insights, analysis, business, technology, politics, economy, global affairs",
  authors: [{ name: "Insights Blog Team" }],
  creator: "Insights Blog",
  publisher: "Insights Blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Insights Blog",
    title: "Insights Blog | Thoughtful Analysis on Global Affairs",
    description:
      "In-depth analysis and thoughtful perspectives on business, technology, and global affairs.",
    images: [
      {
        url: "/images/og-default.jpg", // 默认OG图片路径
        width: 1200,
        height: 630,
        alt: "Insights Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights Blog",
    description:
      "In-depth analysis and thoughtful perspectives on business, technology, and global affairs.",
    images: ["/images/og-default.jpg"],
    creator: "@insightsblog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "msapplication-TileColor": "#ffffff",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense 代码 - 使用dangerouslySetInnerHTML避免data-nscript属性 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              var script = document.createElement('script');
              script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1911238866563211";
              script.async = true;
              script.crossOrigin = "anonymous";
              document.head.appendChild(script);
            })();
          `,
          }}
        />

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
