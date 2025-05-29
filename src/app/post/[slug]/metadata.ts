import { Metadata } from "next";

// 硬编码的 Income Streams 文章数据（简化版，仅用于 metadata）
const incomeStreamArticles = [
  {
    _id: "dividend-investing-passive-income-2025",
    title: "Dividend Investing: Build $3000+ Monthly Passive Income in 2025",
    excerpt:
      "Learn how to create a sustainable dividend portfolio that generates consistent monthly income. Discover high-yield dividend stocks, REITs, and dividend growth strategies that can build wealth over time.",
    summary:
      "Master dividend investing strategies to build a portfolio generating $3000+ monthly passive income through high-yield stocks, REITs, and dividend growth companies.",
    tags: [
      "dividend investing",
      "passive income",
      "stocks",
      "REITs",
      "financial freedom",
    ],
    author: "Financial Expert",
    publishedAt: "2024-12-15",
    income: "$3000+/month",
  },
  {
    _id: "rental-property-income-guide-2025",
    title: "Rental Property Investment: Generate $2500+ Monthly Cash Flow",
    excerpt:
      "Complete guide to rental property investing. Learn how to find profitable properties, calculate cash flow, manage tenants, and scale your real estate portfolio for maximum returns.",
    summary:
      "Comprehensive rental property investment guide covering property analysis, financing, management strategies, and scaling techniques to generate $2500+ monthly cash flow.",
    tags: [
      "real estate",
      "rental property",
      "cash flow",
      "property investment",
      "passive income",
    ],
    author: "Real Estate Expert",
    publishedAt: "2024-12-10",
    income: "$2500+/month",
  },
  {
    _id: "online-course-creation-income-2025",
    title: "Online Course Creation: Earn $5000+ Monthly Teaching Your Skills",
    excerpt:
      "Transform your expertise into a profitable online course business. Learn course creation, marketing strategies, platform selection, and scaling techniques to build a six-figure education business.",
    summary:
      "Complete guide to creating and selling online courses, covering topic selection, content creation, platform choice, marketing strategies, and scaling to generate $5000+ monthly revenue.",
    tags: [
      "online courses",
      "education business",
      "digital products",
      "passive income",
      "teaching",
    ],
    author: "Education Entrepreneur",
    publishedAt: "2024-12-08",
    income: "$5000+/month",
  },
  {
    _id: "affiliate-marketing-income-streams-2025",
    title: "Affiliate Marketing Mastery: Build Multiple $1000+ Income Streams",
    excerpt:
      "Master affiliate marketing to create multiple income streams. Learn niche selection, content creation, traffic generation, and conversion optimization to earn consistent commissions.",
    summary:
      "Comprehensive affiliate marketing guide covering niche selection, content strategies, traffic generation, and conversion optimization to build multiple $1000+ monthly income streams.",
    tags: [
      "affiliate marketing",
      "online marketing",
      "passive income",
      "digital marketing",
      "commissions",
    ],
    author: "Marketing Specialist",
    publishedAt: "2024-12-05",
    income: "$1000+/month per stream",
  },
  {
    _id: "dropshipping-business-income-2025",
    title: "Dropshipping Business: Start Your $4000+ Monthly E-commerce Store",
    excerpt:
      "Launch a profitable dropshipping business with minimal upfront investment. Learn product research, supplier sourcing, store setup, marketing strategies, and scaling techniques.",
    summary:
      "Complete dropshipping business guide covering product research, supplier sourcing, store setup, marketing strategies, and scaling techniques to build a $4000+ monthly e-commerce business.",
    tags: [
      "dropshipping",
      "e-commerce",
      "online business",
      "entrepreneurship",
      "passive income",
    ],
    author: "E-commerce Expert",
    publishedAt: "2024-12-01",
    income: "$4000+/month",
  },
  {
    _id: "youtube-monetization-income-streams-2025",
    title: "YouTube Monetization: Create $3500+ Monthly Revenue Streams",
    excerpt:
      "Build a profitable YouTube channel with multiple revenue streams. Learn content creation, audience building, monetization strategies, and scaling techniques for long-term success.",
    summary:
      "Comprehensive YouTube monetization guide covering content creation, audience growth, multiple revenue streams, and scaling strategies to generate $3500+ monthly income.",
    tags: [
      "YouTube",
      "content creation",
      "video marketing",
      "monetization",
      "passive income",
    ],
    author: "Content Creator",
    publishedAt: "2024-11-28",
    income: "$3500+/month",
  },
];

// AI Money 分类的硬编码文章数据（简化版，仅用于 metadata）
const aiMoneyArticles = [
  {
    _id: "ai-chatbot-business-income-2025",
    title: "AI Chatbot Business: Build $2000+ Monthly SaaS Revenue",
    excerpt:
      "Create and monetize AI chatbots for businesses. Learn how to build, deploy, and scale chatbot solutions that generate recurring monthly revenue.",
    summary:
      "Comprehensive guide to building profitable AI chatbot business, covering market opportunities, development platforms, niche selection, pricing strategies, and scaling techniques to generate $2000+ monthly SaaS revenue.",
    tags: [
      "AI",
      "chatbots",
      "SaaS",
      "business automation",
      "recurring revenue",
    ],
    author: "AI Business Expert",
    publishedAt: "2024-12-12",
    income: "$2000+/month",
  },
  {
    _id: "ai-content-generation-business-2025",
    title: "AI Content Creation: Generate $3000+ Monthly Revenue",
    excerpt:
      "Leverage AI tools to create high-quality content for businesses. Learn how to build a profitable content creation service using AI for copywriting, marketing, and automation.",
    summary:
      "Master AI-powered content creation to build a profitable service business, covering AI tools, content strategies, client acquisition, and scaling techniques to generate $3000+ monthly revenue.",
    tags: ["AI", "content creation", "copywriting", "marketing", "automation"],
    author: "Content Strategist",
    publishedAt: "2024-12-08",
    income: "$3000+/month",
  },
  {
    _id: "ai-trading-bot-income-2025",
    title: "AI Trading Bots: Generate $1500+ Monthly Passive Income",
    excerpt:
      "Build and deploy AI trading bots for cryptocurrency and stock markets. Learn algorithmic trading strategies that can generate consistent monthly returns.",
    summary:
      "Learn to create profitable AI trading bots for crypto and stock markets, covering algorithm development, risk management, platform selection, and optimization strategies to generate $1500+ monthly passive income.",
    tags: ["AI", "trading", "cryptocurrency", "passive income", "algorithms"],
    author: "Quantitative Trader",
    publishedAt: "2024-12-05",
    income: "$1500+/month",
  },
];

// Investment 分类的硬编码文章数据（简化版，仅用于 metadata）
const investmentArticles = [
  {
    _id: "stock-market-investing-beginners-2025",
    title: "Stock Market Investing for Beginners: Build $5000+ Portfolio",
    excerpt:
      "Complete guide to stock market investing. Learn fundamental analysis, portfolio diversification, and long-term wealth building strategies.",
    summary:
      "Comprehensive beginner guide to stock market investing covering fundamentals, analysis techniques, portfolio construction, and long-term wealth building strategies to build a $5000+ portfolio.",
    tags: ["stocks", "investing", "portfolio", "wealth building"],
    author: "Investment Advisor",
    publishedAt: "2024-12-14",
    income: "$5000+/year",
  },
  {
    _id: "cryptocurrency-investment-strategy-2025",
    title: "Cryptocurrency Investment: Navigate the $2T Digital Asset Market",
    excerpt:
      "Strategic approach to cryptocurrency investing. Learn risk management, portfolio allocation, and how to profit from digital assets.",
    summary:
      "Strategic cryptocurrency investment guide covering market analysis, risk management, portfolio allocation, and profit strategies for navigating the $2T digital asset market.",
    tags: ["cryptocurrency", "digital assets", "portfolio", "risk management"],
    author: "Crypto Analyst",
    publishedAt: "2024-12-12",
    income: "$10000+/year",
  },
  {
    _id: "index-fund-investing-passive-wealth-2025",
    title: "Index Fund Investing: Build Passive Wealth with $500/Month",
    excerpt:
      "Master index fund investing for passive wealth building. Learn fund selection, portfolio allocation, and compound growth strategies.",
    summary:
      "Complete index fund investing guide covering fund selection, portfolio construction, and passive wealth building strategies with just $500 monthly investments.",
    tags: ["index funds", "passive investing", "ETFs", "compound growth"],
    author: "Financial Planner",
    publishedAt: "2024-12-07",
    income: "$100000+/10 years",
  },
];

// E-commerce 分类的硬编码文章数据（简化版，仅用于 metadata）
const ecommerceArticles = [
  {
    _id: "amazon-fba-business-guide-2025",
    title: "Amazon FBA Business: Build $5000+ Monthly Revenue Stream",
    excerpt:
      "Complete guide to starting and scaling an Amazon FBA business. Learn product research, sourcing, listing optimization, and scaling strategies.",
    summary:
      "Comprehensive Amazon FBA business guide covering product research, supplier sourcing, listing optimization, inventory management, and scaling strategies to build $5000+ monthly revenue.",
    tags: ["Amazon FBA", "e-commerce", "product sourcing", "online business"],
    author: "E-commerce Expert",
    publishedAt: "2024-12-13",
    income: "$5000+/month",
  },
  {
    _id: "shopify-store-success-2025",
    title: "Shopify Store Success: Build $8000+ Monthly E-commerce Business",
    excerpt:
      "Create a profitable Shopify store from scratch. Learn store setup, product selection, marketing, and scaling strategies.",
    summary:
      "Complete Shopify store guide covering setup, design, product selection, marketing strategies, and scaling techniques to build $8000+ monthly e-commerce business.",
    tags: ["Shopify", "e-commerce store", "online retail", "digital marketing"],
    author: "Shopify Expert",
    publishedAt: "2024-12-09",
    income: "$8000+/month",
  },
  {
    _id: "print-on-demand-business-2025",
    title: "Print-on-Demand Business: Generate $3000+ Monthly Passive Income",
    excerpt:
      "Start a profitable print-on-demand business with minimal investment. Learn design creation, platform selection, and marketing strategies.",
    summary:
      "Print-on-demand business guide covering design creation, platform selection, product types, marketing strategies, and scaling to generate $3000+ monthly passive income.",
    tags: ["print on demand", "passive income", "design business", "POD"],
    author: "POD Entrepreneur",
    publishedAt: "2024-12-05",
    income: "$3000+/month",
  },
];

// Content Creation 分类的硬编码文章数据（简化版，仅用于 metadata）
const contentCreationArticles = [
  {
    _id: "youtube-monetization-complete-guide-2025",
    title: "YouTube Monetization: Build $4000+ Monthly Creator Income",
    excerpt:
      "Complete guide to YouTube monetization. Learn content creation, audience building, ad revenue optimization, and multiple income streams.",
    summary:
      "Comprehensive YouTube monetization guide covering content creation, audience growth, ad revenue optimization, and multiple income streams to build $4000+ monthly creator income.",
    tags: [
      "YouTube",
      "content creation",
      "video monetization",
      "creator economy",
    ],
    author: "YouTube Expert",
    publishedAt: "2024-12-11",
    income: "$4000+/month",
  },
  {
    _id: "instagram-influencer-income-2025",
    title:
      "Instagram Influencer: Build $2500+ Monthly Brand Partnership Income",
    excerpt:
      "Become a profitable Instagram influencer. Learn audience building, engagement strategies, and brand partnership monetization.",
    summary:
      "Instagram influencer guide covering audience growth, content strategies, engagement optimization, and brand partnership tactics to generate $2500+ monthly income.",
    tags: [
      "Instagram",
      "influencer marketing",
      "brand partnerships",
      "social media",
    ],
    author: "Social Media Expert",
    publishedAt: "2024-12-08",
    income: "$2500+/month",
  },
  {
    _id: "podcast-monetization-strategies-2025",
    title:
      "Podcast Monetization: Generate $3500+ Monthly Audio Content Revenue",
    excerpt:
      "Build and monetize a successful podcast. Learn content creation, audience building, sponsorship acquisition, and revenue optimization.",
    summary:
      "Podcast monetization guide covering content creation, audience growth, sponsorship strategies, and revenue optimization to generate $3500+ monthly audio content income.",
    tags: ["podcasting", "audio content", "sponsorships", "media monetization"],
    author: "Podcast Expert",
    publishedAt: "2024-12-06",
    income: "$3500+/month",
  },
];

// Skill Services 分类的硬编码文章数据（简化版，仅用于 metadata）
const skillServicesArticles = [
  {
    _id: "freelance-consulting-business-2025",
    title: "Freelance Consulting: Build $6000+ Monthly Service Business",
    excerpt:
      "Transform your expertise into a high-paying consulting business. Learn client acquisition, pricing strategies, and service delivery systems.",
    summary:
      "Freelance consulting business guide covering expertise positioning, client acquisition, pricing strategies, service delivery, and scaling to build $6000+ monthly revenue.",
    tags: ["consulting", "freelancing", "professional services", "business"],
    author: "Business Consultant",
    publishedAt: "2024-12-11",
    income: "$6000+/month",
  },
  {
    _id: "online-tutoring-income-2025",
    title: "Online Tutoring: Earn $4000+ Monthly Teaching Skills",
    excerpt:
      "Build a profitable online tutoring business. Learn platform selection, student acquisition, and scaling strategies for educational services.",
    summary:
      "Online tutoring business guide covering platform selection, student acquisition, curriculum development, and scaling strategies to earn $4000+ monthly teaching income.",
    tags: ["online tutoring", "education", "teaching", "remote work"],
    author: "Education Expert",
    publishedAt: "2024-12-09",
    income: "$4000+/month",
  },
  {
    _id: "virtual-assistant-services-2025",
    title: "Virtual Assistant Services: Build $3500+ Monthly Remote Business",
    excerpt:
      "Start a profitable virtual assistant business. Learn service offerings, client acquisition, and business scaling strategies.",
    summary:
      "Virtual assistant business guide covering service specialization, client acquisition, pricing strategies, and scaling techniques to build $3500+ monthly remote income.",
    tags: ["virtual assistant", "remote work", "admin services", "freelancing"],
    author: "VA Expert",
    publishedAt: "2024-12-07",
    income: "$3500+/month",
  },
];

// 合并所有硬编码文章数组
const allHardcodedArticles = [
  ...incomeStreamArticles,
  ...aiMoneyArticles,
  ...investmentArticles,
  ...ecommerceArticles,
  ...contentCreationArticles,
  ...skillServicesArticles,
];

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  // 查找文章 - 现在从所有硬编码文章中搜索
  const article = allHardcodedArticles.find((article) => article._id === slug);

  if (!article) {
    return {
      title: "Article Not Found | MoneyGuide",
      description: "The requested article could not be found.",
    };
  }

  const baseUrl = "https://yoursite.com"; // 替换为实际域名
  const articleUrl = `${baseUrl}/post/${slug}`;

  return {
    title: `${article.title} | MoneyGuide`,
    description: article.summary || article.excerpt,
    keywords: article.tags.join(", "),
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.summary || article.excerpt,
      url: articleUrl,
      siteName: "MoneyGuide",
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary || article.excerpt,
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: articleUrl,
    },
    other: {
      "article:author": article.author,
      "article:published_time": article.publishedAt,
      "article:tag": article.tags.join(","),
      "income-potential": article.income,
    },
  };
}
