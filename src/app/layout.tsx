import React from 'react'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { DefaultSeo } from 'next-seo'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'MoneyGuide - Professional Online Entrepreneurship and Passive Income Blog',
    template: '%s | MoneyGuide'
  },
  description: 'Discover the latest online money-making methods, passive income strategies, and entrepreneurial opportunities. Practical guides based on trending topics to help you achieve financial freedom.',
  keywords: ['money making', 'passive income', 'online business', 'side hustle', 'investment', 'financial freedom'],
  authors: [{ name: 'MoneyGuide Team' }],
  creator: 'MoneyGuide',
  publisher: 'MoneyGuide',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://blog-2-rho.vercel.app'),
  alternates: {
    canonical: '/',
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
        alt: 'MoneyGuide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneyGuide - Professional Online Entrepreneurship and Passive Income Blog',
    description: 'Discover the latest online money-making methods, passive income strategies, and entrepreneurial opportunities.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="google-adsense-account" content="ca-pub-1911238866563211" />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HLN9BVWLSS"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HLN9BVWLSS');
            `,
          }}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1911238866563211"
          crossOrigin="anonymous"
        ></script>
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