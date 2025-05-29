'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 简化的文章接口，避免Mongoose类型冲突
interface BusinessPost {
  _id: string;
  title: string;
  excerpt: string;
  summary: string;
  content: string;
  conclusion: string;
  category: string;
  difficulty: string;
  readTime: string;
  income: string;
  featured: boolean;
  trending: boolean;
  tags: string[];
  image: string;
  publishedAt: Date;
  author: string;
  views: number;
  links: string[];
}

export default function BusinessPage() {
  const [posts, setPosts] = useState<BusinessPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 硬编码的商业相关文章数据
  const businessArticles: BusinessPost[] = [
    {
      _id: 'startup-business-plan-2025',
      title: 'Startup Business Plan: Launch Your $10K+ Monthly Business',
      excerpt: 'Complete guide to creating a winning business plan for your startup. Learn market research, financial projections, and funding strategies.',
      summary: 'Master the art of business planning with this comprehensive guide covering market analysis, financial modeling, and investor pitch preparation.',
      content: `# Startup Business Plan: Launch Your $10K+ Monthly Business

## Introduction

A well-crafted business plan is the foundation of every successful startup. This guide will teach you how to create a comprehensive business plan that attracts investors and guides your path to $10K+ monthly revenue.

## Executive Summary

### Key Components:
- Business concept and value proposition
- Market opportunity and target audience
- Competitive advantage and differentiation
- Financial projections and funding needs
- Management team and key personnel

## Market Analysis

### Industry Research:
- Market size and growth trends
- Customer demographics and behavior
- Competitive landscape analysis
- Regulatory environment
- Technology trends and disruptions

### Target Market Definition:
- Primary customer segments
- Customer pain points and needs
- Buying behavior and decision factors
- Market penetration strategies
- Customer acquisition costs

## Business Model

### Revenue Streams:
- Product/service pricing strategy
- Subscription vs. one-time sales
- Multiple revenue channels
- Scalability potential
- Recurring revenue opportunities

### Cost Structure:
- Fixed vs. variable costs
- Customer acquisition costs
- Operating expenses
- Technology infrastructure
- Personnel costs

## Marketing Strategy

### Go-to-Market Plan:
- Brand positioning and messaging
- Marketing channels and tactics
- Sales process and funnel
- Customer retention strategies
- Partnership opportunities

### Digital Marketing:
- Website and SEO strategy
- Social media presence
- Content marketing plan
- Paid advertising campaigns
- Email marketing automation

## Financial Projections

### Revenue Forecasting:
- 3-year revenue projections
- Monthly cash flow analysis
- Break-even analysis
- Profitability timeline
- Scenario planning (best/worst case)

### Funding Requirements:
- Startup capital needs
- Working capital requirements
- Equipment and technology costs
- Marketing and sales budget
- Contingency planning

## Implementation Timeline

### Phase 1: Foundation (Months 1-3)
- Business registration and legal setup
- Product/service development
- Initial team hiring
- Brand development and website launch

### Phase 2: Launch (Months 4-6)
- Market entry and customer acquisition
- Marketing campaign execution
- Sales process optimization
- Customer feedback integration

### Phase 3: Growth (Months 7-12)
- Scale marketing efforts
- Expand product/service offerings
- Team expansion
- Process optimization

## Risk Management

### Common Business Risks:
- Market competition
- Economic downturns
- Technology changes
- Regulatory changes
- Key personnel loss

### Mitigation Strategies:
- Diversification plans
- Insurance coverage
- Legal compliance
- Financial reserves
- Contingency planning

## Conclusion

A solid business plan serves as your roadmap to success. Regular updates and adjustments based on market feedback and performance data are essential for long-term growth and profitability.`,
      conclusion: 'A comprehensive business plan is essential for startup success. Focus on thorough market research, realistic financial projections, and clear implementation strategies. Regular updates and market feedback integration are key to long-term success.',
      category: 'Business',
      difficulty: 'Intermediate',
      readTime: '15 min read',
      income: '$10000+/month',
      featured: true,
      trending: true,
      tags: ['business plan', 'startup', 'entrepreneurship', 'funding', 'strategy'],
      image: '/images/business-plan.svg',
      publishedAt: new Date('2024-12-15'),
      author: 'Business Strategist',
      views: 18500,
      links: [
        'https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan',
        'https://www.score.org/resource/business-plan-template-startup-business',
        'https://www.entrepreneur.com/article/247574'
      ]
    },
    {
      _id: 'small-business-marketing-2025',
      title: 'Small Business Marketing: Grow Revenue by 300% in 12 Months',
      excerpt: 'Proven marketing strategies for small businesses. Learn digital marketing, customer acquisition, and growth hacking techniques.',
      summary: 'Transform your small business with effective marketing strategies that can triple your revenue within 12 months through proven tactics and systems.',
      content: `# Small Business Marketing: Grow Revenue by 300% in 12 Months

## Introduction

Small business marketing has evolved dramatically with digital transformation. This guide provides proven strategies to grow your business revenue by 300% within 12 months using cost-effective marketing tactics.

## Digital Marketing Foundation

### Website Optimization:
- Mobile-responsive design
- Fast loading speeds (under 3 seconds)
- Clear value proposition
- Strong calls-to-action
- SEO optimization

### Local SEO Strategy:
- Google My Business optimization
- Local keyword targeting
- Customer review management
- Local directory listings
- Location-based content

## Content Marketing Strategy

### Content Types:
- Educational blog posts
- How-to videos and tutorials
- Customer success stories
- Industry insights and trends
- Behind-the-scenes content

### Content Distribution:
- Social media platforms
- Email newsletters
- Guest posting opportunities
- Podcast appearances
- Community engagement

## Social Media Marketing

### Platform Selection:
- Facebook: Broad audience reach
- Instagram: Visual content and younger demographics
- LinkedIn: B2B and professional services
- TikTok: Creative content and Gen Z
- YouTube: Educational and entertainment content

### Engagement Strategies:
- Consistent posting schedule
- Interactive content (polls, Q&A)
- User-generated content campaigns
- Influencer partnerships
- Community building

## Email Marketing

### List Building:
- Lead magnets and free resources
- Newsletter signup incentives
- Contest and giveaway entries
- Website opt-in forms
- Social media lead generation

### Campaign Types:
- Welcome series for new subscribers
- Product/service promotions
- Educational content series
- Customer retention campaigns
- Re-engagement sequences

## Paid Advertising

### Google Ads:
- Search campaigns for high-intent keywords
- Display campaigns for brand awareness
- Shopping campaigns for e-commerce
- Local campaigns for foot traffic
- Remarketing campaigns

### Social Media Ads:
- Facebook and Instagram advertising
- LinkedIn sponsored content
- YouTube video ads
- Pinterest promoted pins
- TikTok advertising

## Customer Retention

### Loyalty Programs:
- Points-based reward systems
- Exclusive member benefits
- Referral incentive programs
- VIP customer experiences
- Birthday and anniversary rewards

### Customer Service Excellence:
- Quick response times
- Personalized communication
- Proactive problem solving
- Follow-up and feedback collection
- Continuous improvement

## Analytics and Optimization

### Key Metrics:
- Customer acquisition cost (CAC)
- Customer lifetime value (CLV)
- Return on ad spend (ROAS)
- Conversion rates
- Website traffic and engagement

### Tools for Tracking:
- Google Analytics
- Facebook Pixel
- Email marketing analytics
- CRM systems
- Social media insights

## Growth Hacking Techniques

### Viral Marketing:
- Referral programs
- Social sharing incentives
- Contest and giveaway campaigns
- User-generated content
- Influencer collaborations

### Partnership Marketing:
- Cross-promotions with complementary businesses
- Joint ventures and collaborations
- Affiliate marketing programs
- Industry event participation
- Community partnerships

## Implementation Timeline

### Month 1-2: Foundation
- Website optimization
- Social media setup
- Content strategy development
- Email marketing system setup

### Month 3-6: Execution
- Content creation and publishing
- Paid advertising campaigns
- Email marketing automation
- Customer feedback collection

### Month 7-12: Optimization
- Data analysis and optimization
- Scale successful campaigns
- Expand to new channels
- Customer retention focus

## Conclusion

Growing your small business revenue by 300% requires a systematic approach to marketing with consistent execution and continuous optimization. Focus on understanding your customers and delivering value through multiple touchpoints.`,
      conclusion: 'Small business marketing success requires a multi-channel approach with consistent execution and data-driven optimization. Focus on customer value, build strong relationships, and scale what works for sustainable growth.',
      category: 'Business',
      difficulty: 'Intermediate',
      readTime: '12 min read',
      income: '$50000+/year increase',
      featured: true,
      trending: false,
      tags: ['marketing', 'small business', 'digital marketing', 'growth', 'revenue'],
      image: '/images/business-marketing.svg',
      publishedAt: new Date('2024-12-12'),
      author: 'Marketing Expert',
      views: 22100,
      links: [
        'https://blog.hubspot.com/marketing/small-business-marketing',
        'https://www.google.com/business/',
        'https://www.facebook.com/business'
      ]
    },
    {
      _id: 'business-automation-systems-2025',
      title: 'Business Automation: Save 20+ Hours Weekly with Smart Systems',
      excerpt: 'Automate your business operations to save time and increase efficiency. Learn workflow automation, tool integration, and process optimization.',
      summary: 'Discover how to automate repetitive business tasks and create efficient systems that save 20+ hours weekly while improving accuracy and customer satisfaction.',
      content: `# Business Automation: Save 20+ Hours Weekly with Smart Systems

## Introduction

Business automation can transform your operations, saving 20+ hours weekly while improving accuracy and customer satisfaction. This guide covers essential automation strategies for modern businesses.

## Areas for Automation

### Customer Service:
- Chatbots for common inquiries
- Automated email responses
- Ticket routing systems
- FAQ automation
- Follow-up sequences

### Sales Process:
- Lead scoring and qualification
- CRM data entry
- Proposal generation
- Contract management
- Payment processing

### Marketing Automation:
- Email marketing campaigns
- Social media posting
- Lead nurturing sequences
- Customer segmentation
- Performance reporting

### Operations:
- Inventory management
- Order processing
- Invoicing and billing
- Employee onboarding
- Data backup systems

## Essential Automation Tools

### All-in-One Platforms:
- HubSpot: CRM and marketing automation
- Salesforce: Enterprise CRM solution
- Monday.com: Project management and workflows
- Notion: Documentation and process management

### Specialized Tools:
- Zapier: App integration and workflows
- Mailchimp: Email marketing automation
- Calendly: Appointment scheduling
- QuickBooks: Financial automation
- Slack: Team communication automation

## Implementation Strategy

### Phase 1: Assessment
- Identify repetitive tasks
- Map current processes
- Calculate time spent on manual work
- Prioritize automation opportunities
- Set automation goals

### Phase 2: Planning
- Choose automation tools
- Design new workflows
- Create standard operating procedures
- Plan team training
- Set implementation timeline

### Phase 3: Execution
- Implement automation systems
- Train team members
- Test and refine processes
- Monitor performance
- Gather feedback

## ROI Calculation

### Time Savings:
- Calculate hours saved per week
- Multiply by hourly wage costs
- Factor in accuracy improvements
- Consider scalability benefits
- Account for customer satisfaction gains

### Cost Analysis:
- Tool subscription costs
- Implementation time investment
- Training expenses
- Maintenance requirements
- Opportunity costs

## Best Practices

### Start Small:
- Begin with simple automations
- Focus on high-impact, low-complexity tasks
- Build confidence and expertise
- Scale gradually
- Learn from each implementation

### Maintain Human Touch:
- Keep personal elements in customer interactions
- Provide easy escalation paths
- Regular human oversight
- Personalization where possible
- Feedback collection and response

## Common Pitfalls

### Over-Automation:
- Losing personal touch with customers
- Creating rigid, inflexible processes
- Ignoring edge cases and exceptions
- Reducing employee engagement
- Missing improvement opportunities

### Under-Planning:
- Insufficient process documentation
- Inadequate team training
- Poor tool integration
- Lack of performance monitoring
- No backup plans

## Measuring Success

### Key Metrics:
- Time saved per week
- Error reduction percentage
- Customer satisfaction scores
- Employee productivity gains
- Cost savings achieved

### Monitoring Tools:
- Time tracking software
- Performance dashboards
- Customer feedback systems
- Employee surveys
- Financial reporting

## Future-Proofing

### Emerging Technologies:
- AI and machine learning integration
- Voice automation systems
- Predictive analytics
- IoT device integration
- Blockchain applications

### Continuous Improvement:
- Regular process reviews
- Technology updates
- Team feedback integration
- Industry best practice adoption
- Innovation experimentation

## Conclusion

Business automation is essential for modern competitiveness. Start with high-impact areas, implement gradually, and maintain focus on customer and employee experience while achieving significant time and cost savings.`,
      conclusion: 'Business automation success requires strategic planning, gradual implementation, and continuous optimization. Focus on high-impact areas first, maintain human elements where important, and measure results to ensure positive ROI.',
      category: 'Business',
      difficulty: 'Advanced',
      readTime: '14 min read',
      income: '$30000+/year savings',
      featured: false,
      trending: true,
      tags: ['automation', 'business systems', 'efficiency', 'productivity', 'technology'],
      image: '/images/business-automation.svg',
      publishedAt: new Date('2024-12-10'),
      author: 'Operations Expert',
      views: 16800,
      links: [
        'https://zapier.com/blog/business-automation/',
        'https://www.hubspot.com/marketing-automation',
        'https://monday.com/blog/project-management/business-automation/'
      ]
    }
  ];

  useEffect(() => {
    // 模拟API调用，实际使用硬编码数据
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        // 使用硬编码的商业文章数据
        setPosts(businessArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // 移除businessArticles依赖项，因为它是静态数据

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading business articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 text-xl mb-4">❌ Loading Failed</div>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-16">
          <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-soft">
            <span className="text-2xl mr-3">🏢</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Business & Entrepreneurship</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Build Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Business Empire</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover proven strategies, tools, and systems to start, grow, and scale your business. From startup planning to automation, we cover everything you need for entrepreneurial success.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <span className="mr-2">📈</span>
              <span>Growth Strategies</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💼</span>
              <span>Business Planning</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🤖</span>
              <span>Automation Systems</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💰</span>
              <span>Revenue Optimization</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
            <div className="text-gray-600 dark:text-gray-400">Business Strategies</div>
          </div>
          <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">$10M+</div>
            <div className="text-gray-600 dark:text-gray-400">Revenue Generated</div>
          </div>
          <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">1000+</div>
            <div className="text-gray-600 dark:text-gray-400">Success Stories</div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className="block group"
            >
              <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft hover:shadow-large transition-all duration-500 hover:scale-[1.02] overflow-hidden animate-slide-up cursor-pointer h-full">
                {/* Article image */}
                {post.image && (
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <div className="p-6">
                  {/* Article meta */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-semibold rounded-full border border-white/20">
                      {post.category}
                    </span>
                    {post.difficulty && (
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${post.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                        post.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                          'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                        }`}>
                        {post.difficulty}
                      </span>
                    )}
                    {post.featured && (
                      <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Article title */}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>

                  {/* Article excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Income information */}
                  {post.income && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="text-sm text-green-800 dark:text-green-300">
                        💰 Expected Impact: <span className="font-semibold">{post.income}</span>
                      </div>
                    </div>
                  )}

                  {/* Article metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-4">
                      {post.readTime && (
                        <span className="flex items-center">
                          <span className="mr-1">⏱️</span>
                          {post.readTime}
                        </span>
                      )}
                      {post.views !== undefined && (
                        <span className="flex items-center">
                          <span className="mr-1">👁️</span>
                          {post.views.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-3xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Business Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of entrepreneurs who have transformed their ideas into profitable businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/category/income-streams"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Explore Income Streams
            </a>
            <a
              href="/category/ai-money"
              className="px-8 py-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-white/30 dark:hover:bg-black/30 transition-colors border border-white/20 dark:border-gray-600"
            >
              Discover AI Opportunities
            </a>
          </div>
        </div>

        {/* Back to home button */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
} 