import React from 'react';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  summary?: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  category: string;
  readTime: string;
  income?: string;
  views?: number;
}

interface StructuredDataProps {
  article: Article;
  baseUrl?: string;
}

export function ArticleStructuredData({ article, baseUrl = 'https://blog-2-rho.vercel.app' }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary || article.excerpt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MoneyGuide',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/post/${article._id}`,
    },
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/og-image.svg`,
      width: 1200,
      height: 630,
    },
    articleSection: article.category,
    keywords: article.tags.join(', '),
    wordCount: article.content.split(' ').length,
    timeRequired: article.readTime,
    about: {
      '@type': 'Thing',
      name: 'Income Generation',
      description: 'Strategies and methods for generating passive and active income',
    },
    mentions: article.tags.map(tag => ({
      '@type': 'Thing',
      name: tag,
    })),
  };

  // 如果有收入信息，添加额外的结构化数据
  if (article.income) {
    (structuredData as any).potentialAction = {
      '@type': 'ReadAction',
      target: `${baseUrl}/post/${article._id}`,
      expectsAcceptanceOf: {
        '@type': 'Offer',
        description: `Learn how to generate ${article.income}`,
        category: 'Educational Content',
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData({ baseUrl = 'https://blog-2-rho.vercel.app' }: { baseUrl?: string }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MoneyGuide',
    description: 'Professional Online Entrepreneurship and Passive Income Blog',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MoneyGuide',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
      sameAs: [
        // 添加社交媒体链接
        'https://twitter.com/moneyguide',
        'https://facebook.com/moneyguide',
        'https://linkedin.com/company/moneyguide',
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
  baseUrl = 'https://blog-2-rho.vercel.app'
}: {
  items: Array<{ name: string; url: string }>;
  baseUrl?: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 