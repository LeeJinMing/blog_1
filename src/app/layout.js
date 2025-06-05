import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import EnhancedSearch from "./components/EnhancedSearch";
import NavMenu from "./components/NavMenu";
import AnalyticsWrapper from "./components/AnalyticsWrapper";
import StructuredData from "./components/StructuredData";

/**
 * Site default global metadata
 * These values will be overridden by other page metadata (if provided)
 */
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog-1-seven-pi.vercel.app"
  ),
  title: {
    template: "%s | Insights Blog",
    default:
      "Insights Blog | Business Analysis, Tech Insights & Global Affairs",
  },
  description:
    "Expert analysis on business trends, AI technology, sustainable development, and global markets. In-depth insights on emerging technologies, investment strategies, and economic developments.",
  keywords:
    "business analysis, technology insights, AI artificial intelligence, sustainable development, investment analysis, market trends, global affairs, economic analysis, tech innovation, business strategy, emerging markets, digital transformation",
  authors: [{ name: "Insights Blog Team" }],
  creator: "Insights Blog",
  publisher: "Insights Blog",
  applicationName: "Insights Blog",
  referrer: "origin-when-cross-origin",
  category: "Business",
  classification: "Business Analysis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Insights Blog",
    title: "Insights Blog | Business Analysis, Tech Insights & Global Affairs",
    description:
      "Expert analysis on business trends, AI technology, sustainable development, and global markets. In-depth insights on emerging technologies, investment strategies, and economic developments.",
    url: "https://blog-1-seven-pi.vercel.app",
    images: [
      {
        url: "https://blog-1-seven-pi.vercel.app/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Insights Blog - Business Analysis and Tech Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights Blog",
    description:
      "Expert analysis on business trends, AI technology, sustainable development, and global markets.",
    images: ["https://blog-1-seven-pi.vercel.app/images/og-default.jpg"],
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
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#ffffff",
    "theme-color": "#ffffff",
  },
  verification: {
    google: "2151ade26579c19b", // Google Search Console验证码
  },
  alternates: {
    canonical: "https://blog-1-seven-pi.vercel.app",
    languages: {
      "en-US": "/en-US",
      "x-default": "/",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense - 智能广告配置 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1911238866563211"
          crossOrigin="anonymous"
        />

        <meta name="google-adsense-account" content="ca-pub-1911238866563211" />

        {/* 启用Auto Ads智能广告配置 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-1911238866563211",
                enable_page_level_ads: true,
                overlays: {bottom: true}
              });
            `,
          }}
        />

        {/* Google Search Console验证 */}
        <meta name="google-site-verification" content="2151ade26579c19b" />

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

        {/* Add website-level structured data */}
        <StructuredData type="website" />
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
