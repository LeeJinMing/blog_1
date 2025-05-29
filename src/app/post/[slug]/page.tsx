import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/BackButton';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { Breadcrumb, BreadcrumbGenerators } from '@/components/Breadcrumb';
import { PostContent } from './PostContent';
import { incomeStreamArticles } from '@/data/incomeStreamArticles';
import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';

// 获取文章数据的函数
async function getPost(slug: string): Promise<any | null> {
  // 首先尝试从硬编码数据中查找
  const hardcodedPost = incomeStreamArticles.find(
    article => article._id === slug || article.slug === slug
  );

  if (hardcodedPost) {
    return hardcodedPost;
  }

  // 尝试从数据库获取
  try {
    await connectDB();

    let post: any;
    // 首先尝试通过slug查找
    if (slug) {
      post = await Post.findOne({ slug }).lean();
    }

    // 如果没找到，尝试通过ID查找
    if (!post) {
      post = await Post.findById(slug).lean();
    }

    if (post) {
      return {
        ...post,
        _id: post._id?.toString(),
        publishedAt: post.publishedAt?.toISOString(),
        updatedAt: post.updatedAt?.toISOString(),
      };
    }
  } catch (error) {
    console.error('Database error:', error);
  }

  return null;
}

// 动态生成 metadata
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Article Not Found | MoneyGuide',
      description: 'The article you are looking for could not be found.',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || post.summary;
  const keywords = post.seoKeywords || post.tags;
  const image = post.image ? `https://blog-2-rho.vercel.app${post.image}` : 'https://blog-2-rho.vercel.app/og-image.svg';
  const url = `https://blog-2-rho.vercel.app/post/${post.slug || post._id}`;

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    authors: [{ name: post.author || 'MoneyGuide Team' }],
    creator: post.author || 'MoneyGuide Team',
    category: post.category,
    openGraph: {
      title,
      description,
      url,
      siteName: 'MoneyGuide',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      section: post.category,
      tags: post.tags,
      authors: [post.author || 'MoneyGuide Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@moneyguide',
    },
    alternates: {
      canonical: url,
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
  };
}

export default async function PostDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // 生成面包屑数据
  const breadcrumbItems = BreadcrumbGenerators.forPost(post);
  const breadcrumbJsonLdItems = [
    { name: 'Home', url: 'https://blog-2-rho.vercel.app' },
    ...breadcrumbItems.map(item => ({
      name: item.name,
      url: `https://blog-2-rho.vercel.app${item.href}`
    }))
  ];

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 返回按钮 */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* 面包屑导航 */}
          <div className="mb-8">
            <Breadcrumb
              items={breadcrumbItems}
              className="text-sm"
            />
          </div>

          {/* 文章内容 */}
          <PostContent post={post} />
        </div>
      </div>
    </>
  );
} 