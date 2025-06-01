import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Money Making Guides - Trending Online Income Methods | MoneyGuide',
  description: 'Discover the latest trending money-making methods based on real-time data analysis. Expert guides on passive income, online business, side hustles, and financial freedom strategies.',
  keywords: 'money making,passive income,online income,side hustle,financial freedom,investment strategies,wealth building,entrepreneurship',
  openGraph: {
    title: 'Money Making Guides - Latest Trending Methods',
    description: 'Expert guides on the most effective money-making strategies and passive income methods.',
    url: 'https://blog-2-rho.vercel.app/category/money-making',
    siteName: 'MoneyGuide',
    images: [
      {
        url: 'https://blog-2-rho.vercel.app/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Money Making Guides',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Money Making Guides - Latest Trending Methods',
    description: 'Expert guides on the most effective money-making strategies and passive income methods.',
    images: ['https://blog-2-rho.vercel.app/og-image.svg'],
  },
  alternates: {
    canonical: 'https://blog-2-rho.vercel.app/category/money-making',
  },
};

export default function MoneyMakingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 