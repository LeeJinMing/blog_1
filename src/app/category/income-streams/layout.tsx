import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Income Streams - Build Multiple Revenue Sources | MoneyGuide',
  description: 'Discover proven income stream strategies including dividend investing, rental properties, online courses, affiliate marketing, and more. Learn how to build multiple revenue sources for financial freedom.',
  keywords: [
    'income streams',
    'passive income',
    'multiple revenue sources',
    'dividend investing',
    'rental property',
    'online courses',
    'affiliate marketing',
    'financial freedom',
    'wealth building',
    'investment strategies'
  ],
  openGraph: {
    title: 'Income Streams - Build Multiple Revenue Sources | MoneyGuide',
    description: 'Expert guides on building multiple income streams. Learn proven strategies that generate $1000-$5000+ monthly income.',
    url: 'https://yoursite.com/category/income-streams',
    siteName: 'MoneyGuide',
    type: 'website',
    images: [
      {
        url: 'https://yoursite.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Income Streams Strategies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Income Streams - Build Multiple Revenue Sources',
    description: 'Expert guides on building multiple income streams that generate real income.',
    images: ['https://yoursite.com/og-image.svg'],
  },
  alternates: {
    canonical: 'https://yoursite.com/category/income-streams',
  },
};

export default function IncomeStreamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 