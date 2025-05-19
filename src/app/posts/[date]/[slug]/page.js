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
import PostViewTracker from "./PostViewTracker"; // 导入分离的客户端组件
import {
  removeRepeatedTitle,
  processHtmlContent,
  normalizeContent,
} from "./utils"; // 导入工具函数
import ClientAdPlaceholder from "@/app/components/ClientAdPlaceholder";
import ClientRelatedPosts from "@/app/components/ClientRelatedPosts";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "./article.module.css";
import TagTracker from "@/app/components/TagTracker";
import { Suspense } from "react";
import ShareButtonsContainer from "./ShareButtonsContainer";
import { getTagTextById } from "@/lib/tags";

// 调整ISR缓存时间，使其与db.js中的全局缓存有效期一致
export const revalidate = 3600; // 1小时重新验证一次

// 为了更好的性能，使用静态生成
export async function generateStaticParams() {
  try {
    // 从全局缓存获取文章，这只会触发一次数据库查询
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
    return []; // 出错时返回空数组
  }
}

// 使用全局缓存简化数据获取
async function getPostData({ date: yyyymmddParam, slug: slugParam }) {
  try {
    // 直接从全局缓存获取文章
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
        "困境",
        "曙光",
        "腐败",
        "迷雾",
        "治理",
        "挑战",
        "投资",
        "逻辑",
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

// 分割内容，以便在合适的位置插入广告
function splitContentForAds(content) {
  if (!content) return { firstPart: "", middlePart: "", lastPart: "" };

  // 基于段落分割内容
  const paragraphs = content.split("\n\n");

  // 如果内容很短，不要分割
  if (paragraphs.length < 6) {
    return {
      firstPart: content,
      middlePart: "",
      lastPart: "",
    };
  }

  // 计算分割点 - 大约在33%和66%的位置
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
  // 使用更标准的方式获取参数
  // Next.js的最新版本中，需要先await整个params对象
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
    // 传入标题参数以便移除重复标题
    processedContent = preprocessContent(post.content, slug, post.title);
  }

  // 分割内容，以便在合适的位置插入广告
  const { firstPart, middlePart, lastPart } =
    splitContentForAds(processedContent);

  // 序列化文章数据，以便传递给客户端组件
  const serializedPost = post;

  // 渲染Markdown内容的函数
  const renderMarkdown = (content) => {
    return (
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom rendering for specific elements if needed
          h1: ({ node, ...props }) => {
            // 将文章内容中的 h1 转换为 h2，避免与页面标题重复
            const content = props.children?.[0]?.toString() || "";

            // 检查是否是Pemex文章
            const isPemexArticle =
              post.title.includes("Pemex") &&
              (post.title.includes("腐败") ||
                post.title.includes("挑战") ||
                post.title.includes("困境") ||
                post.title.includes("迷雾"));

            // 检查内容是否与标题相似
            if (content) {
              // 计算相似度的简单方法
              const titleLower = post.title.toLowerCase();
              const contentLower = content.toLowerCase();

              // 方法1：检查完整匹配
              if (contentLower === titleLower) {
                return null; // 如果完全匹配，不渲染
              }

              // 方法2：检查是否主标题匹配（冒号前的部分）
              const titleParts = post.title.split(/[：:]/);
              const mainTitle = titleParts[0].trim().toLowerCase();
              if (mainTitle.length > 3 && contentLower === mainTitle) {
                return null;
              }

              // 方法3：检查内容是否包含在标题中或标题是否包含在内容中
              if (
                (titleLower.includes(contentLower) &&
                  contentLower.length > 10) ||
                (contentLower.includes(titleLower) && titleLower.length > 10)
              ) {
                return null;
              }

              // Pemex文章的特殊处理
              if (isPemexArticle) {
                // 检查是否包含特定关键词组合
                if (
                  (contentLower.includes("pemex") &&
                    (contentLower.includes("困境") ||
                      contentLower.includes("曙光") ||
                      contentLower.includes("腐败") ||
                      contentLower.includes("迷雾") ||
                      contentLower.includes("治理") ||
                      contentLower.includes("挑战") ||
                      contentLower.includes("墨西哥") ||
                      contentLower.includes("投资逻辑"))) ||
                  contentLower.includes("的困境与曙光") ||
                  contentLower.includes("腐败迷雾与治理")
                ) {
                  return null; // 移除匹配的标题
                }
              }
            }

            // 如果没有被过滤掉，将h1转为h2
            return <h2 {...props} />;
          },
          h2: ({ node, ...props }) => {
            // 检查 h2 内容是否与文章标题相似
            const content = props.children?.[0]?.toString() || "";

            // 检查是否是Pemex文章
            const isPemexArticle =
              post.title.includes("Pemex") &&
              (post.title.includes("腐败") ||
                post.title.includes("挑战") ||
                post.title.includes("困境") ||
                post.title.includes("迷雾"));

            if (content) {
              // 完整标题匹配
              if (content.toLowerCase() === post.title.toLowerCase()) {
                return null; // 不渲染重复的标题
              }

              // 主标题匹配（冒号前的部分）
              const titleParts = post.title.split(/[：:]/);
              const mainTitle = titleParts[0].trim();
              if (
                mainTitle.length > 3 &&
                content.toLowerCase() === mainTitle.toLowerCase()
              ) {
                return null;
              }

              // 副标题匹配（冒号后的部分）
              if (titleParts.length > 1) {
                const subTitle = titleParts.slice(1).join("：").trim();
                if (
                  subTitle.length > 5 &&
                  content.toLowerCase() === subTitle.toLowerCase()
                ) {
                  return null;
                }
              }

              // 标题相似度检查
              const titleLower = post.title.toLowerCase();
              const contentLower = content.toLowerCase();

              // 1. 标题包含关系检查
              if (
                (titleLower.includes(contentLower) &&
                  contentLower.length > 10) ||
                (contentLower.includes(titleLower) && titleLower.length > 10)
              ) {
                return null;
              }

              // 2. 包含相同关键词的检查
              const titleWords = titleLower
                .split(/\s+/)
                .filter((w) => w.length > 3);
              const contentWords = contentLower
                .split(/\s+/)
                .filter((w) => w.length > 3);

              if (titleWords.length > 0 && contentWords.length > 0) {
                let matchCount = 0;
                for (const titleWord of titleWords) {
                  if (
                    contentWords.some(
                      (contentWord) =>
                        contentWord.includes(titleWord) ||
                        titleWord.includes(contentWord)
                    )
                  ) {
                    matchCount++;
                  }
                }

                // 如果匹配度超过75%，可能是重复标题
                if (
                  matchCount / titleWords.length > 0.75 &&
                  content.length >= mainTitle.length * 0.7
                ) {
                  return null;
                }
              }

              // Pemex文章的特殊处理
              if (isPemexArticle) {
                const contentLower = content.toLowerCase();

                // 特定格式检查 - 完全匹配各种可能的标题变体
                if (
                  contentLower.includes("pemex的困境与曙光") ||
                  contentLower.includes("pemex腐败迷雾") ||
                  contentLower.includes("墨西哥能源巨头") ||
                  contentLower.includes("投资逻辑") ||
                  contentLower.includes("治理挑战") ||
                  contentLower.match(/pemex的.+困境/) ||
                  contentLower.match(/pemex.+治理/)
                ) {
                  return null;
                }
              }
            }

            return <h2 {...props} />;
          },
          img: ({ node, ...props }) => (
            <img
              {...props}
              className="post-image"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          ),
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={language}
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
          // Add more custom renderers as needed
        }}
      >
        {content || "This article has no content yet."}
      </ReactMarkdown>
    );
  };

  return (
    <article className={styles.article}>
      {/* 添加客户端跟踪组件，传递序列化后的post数据 */}
      <PostViewTracker post={serializedPost} />

      <Link href="/" className="back-link">
        ← Back to Articles
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <time dateTime={dayjs(post.createdAt).format("YYYY-MM-DD")}>
            {formattedDate}
          </time>

          {post.tagIds && post.tagIds.length > 0 && (
            <div className={styles.tags}>
              {post.tagIds.slice(0, 3).map((tagId, index) => (
                <TagTracker key={index} tagId={tagId} className={styles.tag} />
              ))}
              {post.tagIds.length > 3 && (
                <span className={styles.moreTags}>
                  +{post.tagIds.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 添加分享按钮 */}
        <Suspense fallback={<div>加载分享选项...</div>}>
          <ShareButtonsContainer title={post.title} summary={post.summary} />
        </Suspense>
      </header>

      {post.summary && (
        <div className={styles.postSummary}>
          <p>
            <em>{post.summary}</em>
          </p>
          <hr className={styles.summaryDivider} />
        </div>
      )}

      {/* 摘要下方的顶部广告占位符 */}
      <ClientAdPlaceholder
        size="leaderboard"
        position="in-article"
        theme="light"
      />

      <div className={styles.postContent}>
        {/* 第一部分内容 */}
        {firstPart && renderMarkdown(firstPart)}

        {/* 中间广告占位符 - 仅当内容足够长时显示 */}
        {middlePart && (
          <ClientAdPlaceholder
            size="rectangle"
            position="in-article"
            theme="brand"
          />
        )}

        {/* 第二部分内容 */}
        {middlePart && renderMarkdown(middlePart)}

        {/* 第三部分内容 */}
        {lastPart && renderMarkdown(lastPart)}
      </div>

      {/* 文章底部，结论前的广告占位符 */}
      <ClientAdPlaceholder size="banner" position="footer" theme="light" />

      {post.conclusion && (
        <div className={styles.postConclusion}>
          <h2>Conclusion</h2>
          <p>{post.conclusion}</p>

          {/* 添加文章底部分享按钮 */}
          <div className={styles.conclusionShareButtons}>
            <h3>喜欢这篇文章？分享给朋友！</h3>
            <Suspense fallback={<div>加载分享选项...</div>}>
              <ShareButtonsContainer
                title={post.title}
                summary={post.summary}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* 相关文章推荐 */}
      <ClientRelatedPosts currentPost={serializedPost} />

      {post.tagIds && post.tagIds.length > 0 && (
        <div className={styles.postTags}>
          <h3>Tags</h3>
          <div className={styles.tagsContainer}>
            {post.tagIds.map((tagId, index) => (
              <span key={index} className={styles.tag}>
                {getTagTextById(tagId)}
              </span>
            ))}
          </div>
        </div>
      )}

      {post.links && post.links.length > 0 && (
        <div className={styles.postReferences}>
          <h3>References</h3>
          <ul className={styles.referencesList}>
            {post.links.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
