import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Income Streams Guides - Build Multiple Revenue Sources | MoneyGuide',
  description: 'Learn how to build multiple income streams with our expert guides. Discover passive income opportunities, investment strategies, and business ideas that generate consistent monthly revenue.',
  keywords: 'income streams,passive income,multiple income sources,revenue diversification,wealth building,financial independence,investment income,business income',
  openGraph: {
    title: 'Income Streams - Build Multiple Revenue Sources',
    description: 'Expert guides on building multiple income streams and achieving financial independence through diversified revenue sources.',
    url: 'https://blog-2-rho.vercel.app/category/income-streams',
    siteName: 'MoneyGuide',
    images: [
      {
        url: 'https://blog-2-rho.vercel.app/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Income Streams Guides',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Income Streams - Build Multiple Revenue Sources',
    description: 'Expert guides on building multiple income streams and achieving financial independence.',
    images: ['https://blog-2-rho.vercel.app/og-image.svg'],
  },
  alternates: {
    canonical: 'https://blog-2-rho.vercel.app/category/income-streams',
  },
};

export default function IncomeStreamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 