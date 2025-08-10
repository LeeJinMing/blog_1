import React from "react";
import Link from "next/link";

const EnhancedArticleRenderer = ({ article }) => {
  if (!article) {
    return <div className={styles.error}>Article not found</div>;
  }

  // 提取文章数据
  const {
    title,
    content,
    introduction,
    mainContent,
    summary,
    tags,
    conclusion,
    createdAt,
    links,
  } = article;

  // 要渲染的有效内容
  const validContent = mainContent || content;

  // 如果没有有效内容，显示错误信息
  if (!validContent) {
    return (
      <div className={styles.articleContainer}>
        <h1 className={styles.title}>{title || "Untitled Article"}</h1>
        {summary && (
          <div className={styles.summary}>
            <p>{summary}</p>
          </div>
        )}
        <div className={styles.error}>Article content unavailable</div>
      </div>
    );
  }

  // 简化的内容渲染 - 不插入手动广告
  const renderContent = (rawContent) => {
    if (!rawContent) return [];

    // 分割内容为段落
    const paragraphs = rawContent.split(/\n{2,}/);
    const result = [];

    paragraphs.forEach((paragraph, index) => {
      // 添加段落内容
      if (paragraph.trim()) {
        result.push(renderParagraph(paragraph, index));
      }
    });

    return result;
  };

  // 渲染单个段落
  const renderParagraph = (paragraph, index) => {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) return null;

    // 检测不同类型的内容
    if (trimmedParagraph.startsWith("# ")) {
      return (
        <h1 key={`h1-${index}`} className={styles.h1}>
          {trimmedParagraph.substring(2)}
        </h1>
      );
    }

    if (trimmedParagraph.startsWith("## ")) {
      return (
        <h2 key={`h2-${index}`} className={styles.h2}>
          {trimmedParagraph.substring(3)}
        </h2>
      );
    }

    if (trimmedParagraph.startsWith("### ")) {
      return (
        <h3 key={`h3-${index}`} className={styles.h3}>
          {trimmedParagraph.substring(4)}
        </h3>
      );
    }

    if (trimmedParagraph.startsWith("#### ")) {
      return (
        <h4 key={`h4-${index}`} className={styles.h4}>
          {trimmedParagraph.substring(5)}
        </h4>
      );
    }

    // 检测代码块
    if (trimmedParagraph.startsWith("```")) {
      const lines = trimmedParagraph.split("\n");
      const language = lines[0].substring(3) || "text";
      const code = lines.slice(1, -1).join("\n");

      return (
        <div key={`code-${index}`} className={styles.codeBlock}>
          <div className={styles.codeHeader}>
            <span className={styles.codeLanguage}>{language}</span>
          </div>
          <pre className={styles.codeContent}>
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // 检测引用
    if (trimmedParagraph.startsWith("> ")) {
      return (
        <blockquote key={`quote-${index}`} className={styles.blockquote}>
          {renderInlineFormatting(trimmedParagraph.substring(2))}
        </blockquote>
      );
    }

    // 检测列表项
    if (trimmedParagraph.match(/^[-*+]\s/)) {
      const items = trimmedParagraph
        .split(/\n(?=[-*+]\s)/)
        .map((item) => item.replace(/^[-*+]\s/, ""));

      return (
        <ul key={`ul-${index}`} className={styles.unorderedList}>
          {items.map((item, itemIndex) => (
            <li key={`li-${index}-${itemIndex}`} className={styles.listItem}>
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
    }

    // 检测数字列表
    if (trimmedParagraph.match(/^\d+\.\s/)) {
      const items = trimmedParagraph
        .split(/\n(?=\d+\.\s)/)
        .map((item) => item.replace(/^\d+\.\s/, ""));

      return (
        <ol key={`ol-${index}`} className={styles.orderedList}>
          {items.map((item, itemIndex) => (
            <li key={`li-${index}-${itemIndex}`} className={styles.listItem}>
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ol>
      );
    }

    // 普通段落
    return (
      <p key={`p-${index}`} className={styles.paragraph}>
        {renderInlineFormatting(trimmedParagraph)}
      </p>
    );
  };

  // 渲染内联格式（加粗、斜体、链接等）
  const renderInlineFormatting = (text) => {
    // 简化的内联渲染，处理基本格式
    const parts = [];
    let remaining = text;
    let keyCounter = 0;

    // 处理粗体 **text**
    remaining = remaining.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${keyCounter}__`;
      parts.push(
        <strong key={`bold-${keyCounter++}`} className={styles.bold}>
          {content}
        </strong>
      );
      return placeholder;
    });

    // 处理斜体 *text*
    remaining = remaining.replace(/\*(.*?)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${keyCounter}__`;
      parts.push(
        <em key={`italic-${keyCounter++}`} className={styles.italic}>
          {content}
        </em>
      );
      return placeholder;
    });

    // 处理链接 [text](url)
    remaining = remaining.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, linkText, url) => {
        const placeholder = `__LINK_${keyCounter}__`;
        const isExternal = url.startsWith("http");

        parts.push(
          isExternal ? (
            <a
              key={`link-${keyCounter++}`}
              href={url}
              className={styles.externalLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText}
            </a>
          ) : (
            <Link
              key={`link-${keyCounter++}`}
              href={url}
              className={styles.internalLink}
            >
              {linkText}
            </Link>
          )
        );
        return placeholder;
      }
    );

    // 重新组合文本
    const finalParts = [];
    let textParts = remaining.split(/__(?:BOLD|ITALIC|LINK)_\d+__/);
    let partIndex = 0;

    textParts.forEach((textPart, index) => {
      if (textPart) {
        finalParts.push(textPart);
      }
      if (partIndex < parts.length) {
        finalParts.push(parts[partIndex++]);
      }
    });

    return finalParts;
  };

  // 获取样式对象
  const styles = {
    articleContainer: "article-container",
    title: "article-title",
    summary: "article-summary",
    introduction: "article-introduction",
    content: "article-content",
    conclusion: "article-conclusion",
    tags: "article-tags",
    tagsList: "tags-list",
    tag: "tag",
    links: "article-links",
    linksTitle: "links-title",
    linkList: "link-list",
    linkItem: "link-item",
    externalLink: "external-link",
    internalLink: "internal-link",
    error: "article-error",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    paragraph: "paragraph",
    blockquote: "blockquote",
    codeBlock: "code-block",
    codeHeader: "code-header",
    codeLanguage: "code-language",
    codeContent: "code-content",
    unorderedList: "unordered-list",
    orderedList: "ordered-list",
    listItem: "list-item",
    bold: "bold",
    italic: "italic",
  };

  return (
    <div className={styles.articleContainer}>
      {/* 文章标题 */}
      <h1 className={styles.title}>{title}</h1>

      {/* 摘要部分 */}
      {summary && (
        <div className={styles.summary}>
          <p>{summary}</p>
        </div>
      )}

      {/* 介绍部分 */}
      {introduction && (
        <div className={styles.introduction}>
          <h3>Introduction</h3>
          {renderContent(introduction)}
        </div>
      )}

      {/* 主要内容 */}
      <div className={styles.content}>{renderContent(validContent)}</div>

      {/* 结论部分 */}
      {conclusion && (
        <div className={styles.conclusion}>
          <h3>Conclusion</h3>
          <p>{conclusion}</p>
        </div>
      )}

      {/* 标签 */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className={styles.tags}>
          <h4>Tags:</h4>
          <ul className={styles.tagsList}>
            {tags.map((tag, index) => (
              <li key={index} className={styles.tag}>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 相关链接 */}
      {Array.isArray(links) && links.length > 0 && (
        <div className={styles.links}>
          <h4 className={styles.linksTitle}>Related Links:</h4>
          <ul className={styles.linkList}>
            {links.map((link, index) => (
              <li key={index} className={styles.linkItem}>
                <a
                  href={link}
                  className={styles.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EnhancedArticleRenderer;
