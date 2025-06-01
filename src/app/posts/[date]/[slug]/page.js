import Link from "next/link";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import {
  getPostBySlug,
  getPosts,
  formatDateForUrl,
  getUrlSafeSlug,
} from "@/lib/db";
import PostViewTracker from "./PostViewTracker";
import {
  removeRepeatedTitle,
  processHtmlContent,
  normalizeContent,
} from "./utils";
import ClientAdPlaceholder from "@/app/components/ClientAdPlaceholder";
import ClientRelatedPosts from "@/app/components/ClientRelatedPosts";
import styles from "./article.module.css";
import { Suspense } from "react";
import ShareButtonsContainer from "./ShareButtonsContainer";
import { getTagTextById } from "@/lib/tags";
import GlobalLayout from "@/app/components/GlobalLayout";
import LikeButtonWrapper from "./LikeButtonWrapper";
import EnhancedArticleRenderer from "@/app/components/EnhancedArticleRenderer";
import { AdManager } from "@/app/components/AdManager";

// 添加标题翻译映射
const titleTranslations = {
  网红经济赋能者佳品: "Creator Economy Empowerment",
  现象与营销新纪元: "Phenomenon and New Era of Marketing",
  "网红经济赋能者佳品：Valeria Marquez现象与营销新纪元":
    "Creator Economy Empowerment: Valeria Marquez Phenomenon and New Era of Marketing",
};

// 翻译中文标题为英文
function translateTitle(title) {
  // 检查完整标题是否有翻译
  if (titleTranslations[title]) {
    return titleTranslations[title];
  }

  // 检查是否是带冒号的格式，分别翻译两部分
  if (title.includes("：") || title.includes(":")) {
    const separator = title.includes("：") ? "：" : ":";
    const parts = title.split(separator);

    const translatedParts = parts.map((part) => {
      const trimmedPart = part.trim();
      return titleTranslations[trimmedPart] || trimmedPart;
    });

    return translatedParts.join(": ");
  }

  return title;
}

// Adjust ISR cache time
export const revalidate = 3600; // 1 hour

// For better performance, use static generation
export async function generateStaticParams() {
  try {
    // Get articles from global cache, this will only trigger one database query
    const recentPosts = await getPosts(50); // 减少预渲染的页面数量，避免构建时间过长

    // 过滤掉可能存在问题的posts
    const validPosts = recentPosts.filter(
      (post) =>
        post &&
        post.createdAt &&
        post.slug &&
        typeof post.createdAt === "string"
    );

    return validPosts.map((post) => {
      const dateStr = formatDateForUrl(post.createdAt);
      return {
        date: dateStr,
        slug: getUrlSafeSlug(post.slug),
      };
    });
  } catch (error) {
    console.error("Error generating static params:", error);
    return []; // Return empty array on error
  }
}

// Use global cache to simplify data fetching
async function getPostData({ date: yyyymmddParam, slug: slugParam }) {
  try {
    // Get article directly from global cache
    const post = await getPostBySlug(slugParam);
    return post;
  } catch (error) {
    console.error("Error fetching post:", error.message);
    return null;
  }
}

// Preprocess content to improve markdown rendering for specific posts
function preprocessContent(content, slug, title) {
  if (!content) return "";

  // 检查是否是Pemex文章
  const isPemexArticle =
    title.includes("Pemex") &&
    (title.includes("腐败") ||
      title.includes("挑战") ||
      title.includes("困境") ||
      title.includes("迷雾"));

  // Pemex文章的特殊预处理
  if (isPemexArticle) {
    // 直接移除特定格式的标题行或段落
    let pemexProcessed = content;

    // 移除"Pemex的困境与曙光："类型的标题和相似变体
    const pemexTitlePatterns = [
      /Pemex的困境与曙光[：:].+?投资逻辑/g,
      /Pemex腐败迷雾与治理挑战[：:].+?投资逻辑/g,
      /Pemex的[^：:]+[：:].+?投资逻辑/g,
    ];

    for (const pattern of pemexTitlePatterns) {
      pemexProcessed = pemexProcessed.replace(pattern, "");
    }

    // 移除包含重复标题关键词的段落（第二次标题）
    const lines = pemexProcessed.split("\n");
    const filteredLines = lines.filter((line) => {
      const trimmed = line.trim().toLowerCase();

      // 如果行包含"Pemex"和以下任一关键词组合，可能是重复标题
      if (
        trimmed.includes("pemex") &&
        ((trimmed.includes("困境") && trimmed.includes("曙光")) ||
          (trimmed.includes("腐败") && trimmed.includes("迷雾")) ||
          (trimmed.includes("治理") && trimmed.includes("挑战")) ||
          (trimmed.includes("墨西哥") && trimmed.includes("能源")))
      ) {
        return false; // 移除这一行
      }

      return true;
    });

    pemexProcessed = filteredLines.join("\n");

    // 使用处理过的内容继续下一步
    content = pemexProcessed;
  }

  // 第一步：规范化内容，处理各种格式问题
  let processedContent = normalizeContent(content, title);

  // 第二步：移除重复的标题
  processedContent = removeRepeatedTitle(processedContent, title);

  // 如果内容几乎没有变化，可能需要更积极的重复标题删除
  if (Math.abs(processedContent.length - content.length) < 20) {
    // 更积极地查找并删除标题行
    const titleWords = title.split(/\s+/).filter((word) => word.length > 3);

    // 对于带冒号的标题，特别关注主标题部分
    const hasSeparator = title.includes("：") || title.includes(":");
    if (hasSeparator) {
      const titleParts = title.split(/[：:]/);
      const mainTitle = titleParts[0].trim();
      if (mainTitle.length > 3) {
        const mainTitleWords = mainTitle
          .split(/\s+/)
          .filter((word) => word.length > 2);

        // 将主标题关键词添加到匹配列表
        titleWords.push(...mainTitleWords);
      }
    }

    // 对于Pemex文章，增加一些特殊关键词
    if (isPemexArticle) {
      const pemexKeywords = [
        "dilemma",
        "dawn",
        "corruption",
        "fog",
        "governance",
        "challenges",
        "investment",
        "logic",
      ];
      titleWords.push(...pemexKeywords);
    }

    const lines = processedContent.split("\n");

    // 查找包含多个标题关键词的行
    const filteredLines = lines.filter((line) => {
      // 保留短行
      if (line.trim().length < 10) return true;

      const lowerLine = line.toLowerCase();
      const matchedWords = titleWords.filter((word) =>
        lowerLine.includes(word.toLowerCase())
      );

      // 如果匹配了太多关键词（可能是重复标题），删除此行
      if (matchedWords.length >= Math.min(3, titleWords.length * 0.6)) {
        console.log(`Removing potential duplicate title line: ${line}`);
        return false;
      }

      return true;
    });

    processedContent = filteredLines.join("\n");
  }

  return processedContent;
}

// Split content to insert ads at appropriate positions
function splitContentForAds(content) {
  if (!content) return { firstPart: "", middlePart: "", lastPart: "" };

  // Split content based on paragraphs
  const paragraphs = content.split("\n\n");

  // If content is short, don't split
  if (paragraphs.length < 6) {
    return {
      firstPart: content,
      middlePart: "",
      lastPart: "",
    };
  }

  // Calculate split points - roughly at 33% and 66% positions
  const firstSplitIndex = Math.floor(paragraphs.length * 0.33);
  const secondSplitIndex = Math.floor(paragraphs.length * 0.66);

  return {
    firstPart: paragraphs.slice(0, firstSplitIndex).join("\n\n"),
    middlePart: paragraphs
      .slice(firstSplitIndex, secondSplitIndex)
      .join("\n\n"),
    lastPart: paragraphs.slice(secondSplitIndex).join("\n\n"),
  };
}

// 获取上一篇和下一篇文章的函数
async function getAdjacentPosts(currentPost) {
  try {
    const allPosts = await getPosts(100);

    // 找到当前文章的索引
    const currentIndex = allPosts.findIndex(
      (post) => post._id.toString() === currentPost._id.toString()
    );

    if (currentIndex === -1) return { prevPost: null, nextPost: null };

    return {
      prevPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
      nextPost:
        currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
    };
  } catch (error) {
    console.error("Error getting adjacent posts:", error);
    return { prevPost: null, nextPost: null };
  }
}

// 从文章内容中提取内容各部分
function extractArticleParts(content) {
  let introduction = "";
  let mainContent = content || "";
  let conclusion = "";

  // 寻找Introduction部分
  const introPattern = /###\s*Introduction\s*\n([^#]*)/i;
  const introMatch = mainContent.match(introPattern);

  if (introMatch && introMatch[1]) {
    introduction = introMatch[1].trim();
    // 从主内容中移除Introduction部分
    mainContent = mainContent.replace(introPattern, "");
  }

  // 寻找Conclusion部分
  const conclusionPattern = /###\s*Conclusion\s*\n([^#]*)/i;
  const conclusionMatch = mainContent.match(conclusionPattern);

  if (conclusionMatch && conclusionMatch[1]) {
    conclusion = conclusionMatch[1].trim();
    // 从主内容中移除Conclusion部分
    mainContent = mainContent.replace(conclusionPattern, "");
  }

  return {
    introduction,
    mainContent: mainContent.trim(),
    conclusion,
  };
}

export default async function PostPage({ params }) {
  try {
    const resolvedParams = await params;
    const date = resolvedParams.date;
    const slug = resolvedParams.slug;

    // 获取文章数据
    const post = await getPostData({ date, slug });

    if (!post) {
      return notFound();
    }

    // 确保文章有必要的字段
    if (!post.content || !post.title) {
      console.error(`Incomplete post data for ${slug}`);
      return notFound();
    }

    // 获取上一篇和下一篇文章 - 在try-catch中处理以防错误
    let prevPost = null;
    let nextPost = null;
    try {
      const adjacentPosts = await getAdjacentPosts(post);
      prevPost = adjacentPosts.prevPost;
      nextPost = adjacentPosts.nextPost;
    } catch (err) {
      console.error("Failed to get adjacent posts:", err);
      // 继续执行，不显示上一篇/下一篇
    }

    // 格式化日期
    const formattedDate = dayjs(post.createdAt).format("YYYY-MM-DD");

    // 预处理文章内容，包含特殊格式处理和标题删除 - 确保不会出错
    let processedContent = "";
    try {
      processedContent = preprocessContent(post.content, post.slug, post.title);
    } catch (err) {
      console.error("Failed to preprocess content:", err);
      processedContent = post.content || ""; // 退回到原始内容
    }

    // 将内容分解为独立部分
    let introduction = "";
    let mainContent = processedContent;
    let extractedConclusion = "";

    try {
      const parts = extractArticleParts(processedContent);
      introduction = parts.introduction || "";
      mainContent = parts.mainContent || processedContent;
      extractedConclusion = parts.conclusion || "";
    } catch (err) {
      console.error("Failed to extract article parts:", err);
      // 使用默认值继续
    }

    // 准备传递给EnhancedArticleRenderer的完整文章对象，确保包含所有必要字段
    const articleData = {
      title: post.title,
      content: processedContent, // 保留完整内容用于备用
      introduction: introduction || "", // 添加介绍部分
      mainContent: mainContent || "", // 添加主体内容部分
      summary: post.summary || "", // 确保包含摘要
      conclusion: post.conclusion || extractedConclusion || "", // 优先使用数据库中的结论，否则使用从内容中提取的
      tags: post.tagIds ? post.tagIds.map(getTagTextById).filter(Boolean) : [], // 转换tagIds为实际tag文本
      createdAt: post.createdAt,
      // 确保links是有效的数组，并且过滤掉null和undefined项
      links: Array.isArray(post.links)
        ? post.links
            .filter((link) => link !== null && link !== undefined)
            .map((link) => {
              // 如果link是字符串但不是有效URL，添加http://前缀
              if (typeof link === "string" && !link.match(/^https?:\/\//)) {
                // 检查是否是域名格式
                if (
                  link.match(
                    /^[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+$/
                  )
                ) {
                  return `http://${link}`;
                }
              }
              return link;
            })
        : [],
      _id: post._id,
      slug: post.slug,
    };

    console.log("Rendering article:", {
      title: articleData.title,
      hasSummary: !!articleData.summary,
      contentLength: articleData.content?.length || 0,
      hasConclusion: !!articleData.conclusion,
      tagsCount: articleData.tags?.length || 0,
      linksCount: articleData.links?.length || 0,
    });

    return (
      <GlobalLayout>
        <div className={styles.postPageWrapper}>
          {/* 左侧主要内容 */}
          <div className={styles.mainContent}>
            <article className={styles.article}>
              {/* 顶部区域只保留日期，标题由EnhancedArticleRenderer渲染 */}
              <div className={styles.meta}>
                <time dateTime={post.createdAt} className={styles.date}>
                  {formattedDate}
                </time>
              </div>

              {/* Client-side view tracker */}
              <PostViewTracker postId={post._id.toString()} slug={post.slug} />

              {/* 文章点赞按钮 */}
              <div className={styles.likeButtonWrapper}>
                <LikeButtonWrapper
                  postId={post._id.toString()}
                  slug={post.slug}
                />
              </div>

              {/* Share buttons */}
              <Suspense
                fallback={
                  <div className={styles.loading}>Loading share options...</div>
                }
              >
                <ShareButtonsContainer post={post} />
              </Suspense>

              {/* 使用增强版文章渲染器（包含内置广告） */}
              <EnhancedArticleRenderer article={articleData} />

              {/* 添加在文章底部的上一篇/下一篇导航 */}
              <div className={styles.postNavigation}>
                {prevPost && (
                  <Link
                    href={`/posts/${formatDateForUrl(
                      prevPost.createdAt
                    )}/${getUrlSafeSlug(prevPost.slug)}`}
                    className={styles.prevPostLink}
                  >
                    <span className={styles.navLabel}>← Previous Article</span>
                    <span className={styles.navTitle}>
                      {translateTitle(prevPost.title)}
                    </span>
                  </Link>
                )}

                {nextPost && (
                  <Link
                    href={`/posts/${formatDateForUrl(
                      nextPost.createdAt
                    )}/${getUrlSafeSlug(nextPost.slug)}`}
                    className={styles.nextPostLink}
                  >
                    <span className={styles.navLabel}>Next Article →</span>
                    <span className={styles.navTitle}>
                      {translateTitle(nextPost.title)}
                    </span>
                  </Link>
                )}
              </div>

              {/* Related posts section */}
              <Suspense
                fallback={
                  <div className={styles.loading}>
                    Loading related articles...
                  </div>
                }
              >
                <ClientRelatedPosts currentPost={post} />
              </Suspense>
            </article>
          </div>

          {/* 右侧边栏广告 */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              {/* 侧边栏顶部广告 */}
              <div className={styles.sidebarAd}>
                <AdManager
                  adType="native"
                  position="sidebar"
                  size="medium"
                  className="sidebar-top-ad"
                />
              </div>

              {/* 快速导航 */}
              <div className={styles.quickNav}>
                <h4 className={styles.sidebarTitle}>Quick Navigation</h4>
                <div className={styles.quickNavContent}>
                  <p>• Bookmark this article</p>
                  <p>• Share with friends</p>
                  <p>• Subscribe for updates</p>
                </div>
              </div>

              {/* 侧边栏中部广告 */}
              <div className={styles.sidebarAd}>
                <AdManager
                  adType="native"
                  position="sidebar"
                  size="small"
                  className="sidebar-mid-ad"
                />
              </div>

              {/* 相关主题 */}
              {articleData.tags && articleData.tags.length > 0 && (
                <div className={styles.relatedTopics}>
                  <h4 className={styles.sidebarTitle}>Related Topics</h4>
                  <div className={styles.topicTags}>
                    {articleData.tags.slice(0, 5).map((tag, index) => (
                      <span key={index} className={styles.topicTag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 侧边栏底部广告 */}
              <div className={styles.sidebarAd}>
                <AdManager
                  adType="native"
                  position="sidebar"
                  size="medium"
                  className="sidebar-bottom-ad"
                />
              </div>
            </div>
          </aside>
        </div>
      </GlobalLayout>
    );
  } catch (error) {
    console.error("Error rendering post:", error);
    // 返回一个简单的错误页面，而不是抛出错误
    return (
      <GlobalLayout>
        <div className={styles.article}>
          <h1>Article Loading Failed</h1>
          <p>
            Sorry, unable to load the requested article. Please return to the
            homepage or try other content.
          </p>
          <Link href="/" className={styles.link}>
            ← Back to Homepage
          </Link>
        </div>
      </GlobalLayout>
    );
  }
}

// 修改文章详情页元数据生成函数，添加更多SEO相关信息
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const date = resolvedParams.date;
  const slug = resolvedParams.slug;

  // 获取文章
  const post = await getPostData({ date, slug });

  if (!post) {
    return {
      title: "Article Not Found | Insights Blog",
      description: "The requested article could not be found.",
    };
  }

  // 获取上一篇和下一篇文章
  const { prevPost, nextPost } = await getAdjacentPosts(post);

  // 使用原始标题
  const title = post.title;

  // 创建摘要
  let description = post.summary;
  if (!description && post.content) {
    // 如果没有摘要，从内容中提取前160个字符
    const cleanContent = String(post.content)
      .replace(/#{1,6}\s+/g, "") // Remove headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
      .trim();
    description = cleanContent.substring(0, 160).trim() + "...";
  }

  // 提取标签作为关键词
  const keywords = post.tagIds
    ? post.tagIds.map(getTagTextById).filter(Boolean).join(", ")
    : "";

  // 生成URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
  const url = `${baseUrl}/posts/${date}/${slug}`;

  // 创建日期
  const publishedTime = new Date(post.createdAt).toISOString();
  const modifiedTime = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : publishedTime;

  // 准备links数组，包含上一篇下一篇文章的链接
  const links = [];

  if (prevPost) {
    const prevDate = formatDateForUrl(prevPost.createdAt);
    const prevSlug = getUrlSafeSlug(prevPost.slug);
    links.push({
      rel: "prev",
      href: `/posts/${prevDate}/${prevSlug}`,
    });
  }

  if (nextPost) {
    const nextDate = formatDateForUrl(nextPost.createdAt);
    const nextSlug = getUrlSafeSlug(nextPost.slug);
    links.push({
      rel: "next",
      href: `/posts/${nextDate}/${nextSlug}`,
    });
  }

  return {
    title: `${title} | Insights Blog`,
    description,
    keywords,
    authors: [{ name: post.author || "Insights Blog Team" }],
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: "article",
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      authors: [post.author || "Insights Blog Team"],
      tags: post.tagIds ? post.tagIds.map(getTagTextById).filter(Boolean) : [],
      siteName: "Insights Blog",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(title)}`],
      creator: "@insightsblog",
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
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:author": post.author || "Insights Blog Team",
      "article:section": "Business Analysis",
      "article:tag": keywords,
    },
    // 添加上一页下一页链接
    ...(links.length > 0 ? { links } : {}),
  };
}
