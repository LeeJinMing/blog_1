import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Money Making Articles - Proven Income Strategies | MoneyGuide',
  description: 'Explore our comprehensive collection of money-making articles. Learn proven strategies for passive income, online business, investments, and entrepreneurship. Start your journey to financial freedom today.',
  keywords: [
    'money making articles',
    'income strategies',
    'passive income guides',
    'online business',
    'financial freedom',
    'wealth building',
    'side hustle ideas',
    'investment tips',
    'entrepreneurship',
    'money making methods'
  ],
  openGraph: {
    title: 'Money Making Articles - Proven Income Strategies | MoneyGuide',
    description: 'Comprehensive collection of expert-written money-making guides. Learn strategies that generate real income from $1000 to $5000+ monthly.',
    url: 'https://yoursite.com/category/money-making',
    siteName: 'MoneyGuide',
    type: 'website',
    images: [
      {
        url: 'https://yoursite.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Money Making Articles and Strategies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Money Making Articles - Proven Income Strategies',
    description: 'Expert guides on money-making strategies that generate real income. Start building your wealth today.',
    images: ['https://yoursite.com/og-image.svg'],
  },
  alternates: {
    canonical: 'https://yoursite.com/category/money-making',
  },
};

export default function MoneyMakingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 