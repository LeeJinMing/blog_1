import { IPost } from '@/lib/models/Post';

// 组织结构化数据
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MoneyGuide",
    "url": "https://blog-2-rho.vercel.app",
    "logo": "https://blog-2-rho.vercel.app/logo.svg",
    "description": "Professional online entrepreneurship and passive income blog providing expert guides on money-making methods, investment strategies, and wealth building.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/moneyguide",
      "https://facebook.com/moneyguide"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://blog-2-rho.vercel.app/contact"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 网站结构化数据
export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MoneyGuide",
    "url": "https://blog-2-rho.vercel.app",
    "description": "Discover the latest online money-making methods, passive income strategies, and entrepreneurial opportunities.",
    "publisher": {
      "@type": "Organization",
      "name": "MoneyGuide",
      "logo": "https://blog-2-rho.vercel.app/logo.svg"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://blog-2-rho.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 文章结构化数据
export function ArticleJsonLd({ post }: { post: IPost }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.summary,
    "image": post.image ? `https://blog-2-rho.vercel.app${post.image}` : "https://blog-2-rho.vercel.app/og-image.svg",
    "author": {
      "@type": "Person",
      "name": post.author || "MoneyGuide Team",
      "url": "https://blog-2-rho.vercel.app/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MoneyGuide",
      "logo": {
        "@type": "ImageObject",
        "url": "https://blog-2-rho.vercel.app/logo.svg"
      }
    },
    "datePublished": post.publishedAt || new Date().toISOString(),
    "dateModified": post.updatedAt || post.publishedAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://blog-2-rho.vercel.app/post/${post.slug || post._id}`
    },
    "articleSection": post.category || "Finance",
    "keywords": post.tags?.join(", ") || post.seoKeywords?.join(", ") || "",
    "wordCount": post.content ? post.content.split(' ').length : 0,
    "timeRequired": post.readTime || "5 min read",
    "articleBody": post.content ? post.content.substring(0, 200) + "..." : post.excerpt,
    "about": {
      "@type": "Thing",
      "name": "Passive Income",
      "description": "Methods and strategies for generating passive income online"
    },
    "mentions": post.income ? [
      {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": post.income
      }
    ] : undefined,
    "isAccessibleForFree": true,
    "hasPart": post.links ? post.links.map(link => ({
      "@type": "WebPage",
      "url": link
    })) : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 面包屑结构化数据
export function BreadcrumbJsonLd({ items }: {
  items: Array<{ name: string; url: string }>
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// FAQ结构化数据（用于某些文章）
export function FaqJsonLd({ faqs }: {
  faqs: Array<{ question: string; answer: string }>
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 