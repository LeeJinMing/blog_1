import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "./article.module.css";
import { Suspense } from "react";
import ShareButtonsContainer from "./ShareButtonsContainer";
import { getTagTextById } from "@/lib/tags";
import GlobalLayout from "@/app/components/GlobalLayout";
import LikeButtonWrapper from "./LikeButtonWrapper";

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
    const recentPosts = await getPosts(100);

    return recentPosts.map((post) => {
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

      // 计算这一行包含多少个标题关键词
      const matchCount = titleWords.filter((word) =>
        line.toLowerCase().includes(word.toLowerCase())
      ).length;

      // 如果包含超过一定比例的标题关键词，可能是重复标题
      // 对Pemex文章使用更低的阈值
      const threshold = isPemexArticle ? 0.3 : hasSeparator ? 0.4 : 0.5;
      return matchCount < titleWords.length * threshold;
    });

    processedContent = filteredLines
      .join("\n")
      .replace(/\n{3,}/g, "\n\n") // 整理多余的空行
      .trim();
  }

  // 第三步：处理特定格式的文章内容
  if (slug.includes("generative-ai") || slug.includes("nvidia")) {
    processedContent = processHtmlContent(processedContent);
  }

  // Pemex文章的最终清理
  if (isPemexArticle) {
    // 再次检查有无剩余的标题
    const finalLines = processedContent.split("\n");
    const finalFiltered = finalLines.filter((line) => {
      const trimmed = line.trim().toLowerCase();

      // 只对长度足够长且包含特定组合的行进行过滤
      if (trimmed.length > 15) {
        // 特别检查"Pemex的困境与曙光"和"在腐败丑闻与治理困境中"这两种形式
        if (
          (trimmed.includes("pemex") &&
            (trimmed.includes("困境") ||
              trimmed.includes("曙光") ||
              trimmed.includes("腐败") ||
              trimmed.includes("迷雾"))) ||
          trimmed.includes("治理困境") ||
          trimmed.includes("墨西哥能源巨头") ||
          trimmed.includes("投资逻辑")
        ) {
          return false;
        }
      }

      return true;
    });

    processedContent = finalFiltered.join("\n");
  }

  // 最后一步：确保内容首尾没有多余空行和空格
  return processedContent.trim();
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

export default async function PostPage({ params }) {
  // Use a more standard way to get parameters
  const resolvedParams = await params;
  const date = resolvedParams.date;
  const slug = resolvedParams.slug;

  // The slug might be URL-encoded, let's try both versions
  let post = await getPostData({ date, slug });

  // If not found with the encoded slug, try the decoded version
  if (!post && slug !== decodeURIComponent(slug)) {
    post = await getPostData({ date, slug: decodeURIComponent(slug) });
  }

  if (!post) {
    console.log(`Post not found for date: ${date}, slug: ${slug}`);
    notFound();
  }

  const formattedDate = dayjs(post.createdAt).format("MMMM D, YYYY");

  // Preprocess the content if necessary
  let processedContent = post.content;
  if (post.content) {
    // Pass in title parameter to remove duplicate titles
    processedContent = preprocessContent(post.content, slug, post.title);
  }

  // Split content to insert ads at appropriate locations
  const { firstPart, middlePart, lastPart } =
    splitContentForAds(processedContent);

  // Serialize article data to pass to client components
  const serializedPost = post;

  // Function to render Markdown content
  const renderMarkdown = (content) => {
    return (
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom rendering for code blocks
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Handle other elements as needed
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <GlobalLayout>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{translateTitle(post.title)}</h1>
          <div className={styles.meta}>
            <time dateTime={post.createdAt} className={styles.date}>
              {formattedDate}
            </time>
          </div>
        </header>

        {/* Client-side view tracker */}
        <PostViewTracker postId={post._id.toString()} slug={post.slug} />

        {/* 文章点赞按钮，放在分享按钮前面 */}
        <div className={styles.likeButtonWrapper}>
          <LikeButtonWrapper postId={post._id.toString()} slug={post.slug} />
        </div>

        {/* Share buttons */}
        <Suspense
          fallback={
            <div className={styles.loading}>Loading share options...</div>
          }
        >
          <ShareButtonsContainer post={serializedPost} />
        </Suspense>

        {/* Main content split into parts with ads */}
        <div className={styles.content}>
          <div className={styles.contentPart}>{renderMarkdown(firstPart)}</div>

          {middlePart && (
            <>
              {/* Ad in the middle of the article */}
              <div className={styles.inArticleAd}>
                <ClientAdPlaceholder size="banner" position="in-article" />
              </div>

              <div className={styles.contentPart}>
                {renderMarkdown(middlePart)}
              </div>
            </>
          )}

          {lastPart && (
            <>
              {/* Another ad if there's a last part */}
              {middlePart && (
                <div className={styles.inArticleAd}>
                  <ClientAdPlaceholder size="banner" position="in-article-2" />
                </div>
              )}

              <div className={styles.contentPart}>
                {renderMarkdown(lastPart)}
              </div>
            </>
          )}
        </div>

        {/* Related posts section */}
        <Suspense
          fallback={
            <div className={styles.loading}>Loading related articles...</div>
          }
        >
          <ClientRelatedPosts currentPost={serializedPost} />
        </Suspense>
      </article>
    </GlobalLayout>
  );
}
