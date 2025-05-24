/**
 * 结构化数据组件 - 用于SEO优化
 * 添加Schema.org标记帮助搜索引擎更好地理解网站内容
 */

export default function StructuredData({ type = "website", data = {} }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

  const getStructuredData = () => {
    switch (type) {
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Insights Blog",
          description:
            "Expert analysis on business trends, AI technology, sustainable development, and global markets.",
          url: baseUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
          publisher: {
            "@type": "Organization",
            name: "Insights Blog",
            url: baseUrl,
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/images/logo.png`,
            },
          },
        };

      case "article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: data.title,
          description: data.description,
          image: data.image || `${baseUrl}/images/og-default.jpg`,
          author: {
            "@type": "Person",
            name: data.author || "Insights Blog Team",
          },
          publisher: {
            "@type": "Organization",
            name: "Insights Blog",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/images/logo.png`,
            },
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": data.url,
          },
          keywords: data.keywords,
          articleSection: data.category || "Business Analysis",
        };

      case "blog":
        return {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Insights Blog",
          description:
            "Expert analysis on business trends, AI technology, sustainable development, and global markets.",
          url: baseUrl,
          publisher: {
            "@type": "Organization",
            name: "Insights Blog",
            url: baseUrl,
          },
          blogPost:
            data.posts?.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.summary,
              url: post.url,
              datePublished: post.datePublished,
              author: {
                "@type": "Person",
                name: post.author || "Insights Blog Team",
              },
            })) || [],
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
