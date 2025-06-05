import React from 'react'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/next'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/JsonLd'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
  colorScheme: 'light dark',
}

export const metadata: Metadata = {
  title: {
    default: 'MoneyGuide - Professional Online Entrepreneurship and Passive Income Blog',
    template: '%s | MoneyGuide'
  },
  description: 'Discover the latest online money-making methods, passive income strategies, and entrepreneurial opportunities. Practical guides based on trending topics to help you achieve financial freedom.',
  keywords: ['money making', 'passive income', 'online business', 'side hustle', 'investment', 'financial freedom', 'entrepreneurship', 'wealth building', 'affiliate marketing', 'dividend investing'],
  authors: [{ name: 'MoneyGuide Team' }],
  creator: 'MoneyGuide',
  publisher: 'MoneyGuide',
  applicationName: 'MoneyGuide',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://blog-2-rho.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog-2-rho.vercel.app',
    title: 'MoneyGuide - Professional Online Entrepreneurship and Passive Income Blog',
    description: 'Discover the latest online money-making methods, passive income strategies, and entrepreneurial opportunities. Practical guides based on trending topics to help you achieve financial freedom.',
    siteName: 'MoneyGuide',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'MoneyGuide - Professional Income Generation Strategies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MoneyGuide',
    creator: '@MoneyGuide',
    title: 'MoneyGuide - Professional Online Entrepreneurship and Passive Income Blog',
    description: 'Discover the latest online money-making methods, passive income strategies, and entrepreneurial opportunities.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-simple.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/icon-simple.svg', sizes: '16x16', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon-simple.svg',
        color: '#3b82f6',
      },
    ],
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: 'your-google-verification-code', // 需要替换为实际的验证码
    yandex: 'your-yandex-verification-code', // 可选
  },
  category: 'finance',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Additional meta tags for better SEO */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MoneyGuide" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="origin-when-cross-origin" />

        {/* JSON-LD 结构化数据 */}
        <OrganizationJsonLd />
        <WebsiteJsonLd />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HLN9BVWLSS"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HLN9BVWLSS', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                content_group1: 'Finance Blog',
                custom_map: {'dimension1': 'user_type'}
              });
            `,
          }}
        />

        {/* Google AdSense - 优化配置 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1911238866563211"
          crossOrigin="anonymous"
        ></script>

        {/* 启用AdSense自动广告 */}
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
      </head>
      <body
        className="min-h-screen bg-white dark:bg-gray-900 font-sans antialiased"
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#374151',
                color: '#fff',
              },
            }}
          />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
} 