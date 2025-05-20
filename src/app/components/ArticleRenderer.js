import React from "react";
import Link from "next/link";
import styles from "./ArticleRenderer.module.css";

const ArticleRenderer = ({ article }) => {
  if (!article) {
    return <div className={styles.error}>文章数据不可用</div>;
  }

  // 提取文章数据并添加调试信息
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

  console.log("ArticleRenderer received:", {
    hasTitle: !!title,
    titleLength: title?.length || 0,
    hasContent: !!content,
    contentLength: content?.length || 0,
    hasIntroduction: !!introduction,
    introductionLength: introduction?.length || 0,
    hasMainContent: !!mainContent,
    mainContentLength: mainContent?.length || 0,
    hasSummary: !!summary,
    summaryLength: summary?.length || 0,
    hasConclusion: !!conclusion,
    conclusionLength: conclusion?.length || 0,
    hasTags: Array.isArray(tags) && tags.length > 0,
    tagsCount: tags?.length || 0,
    hasLinks: Array.isArray(links) && links.length > 0,
    linksCount: links?.length || 0,
  });

  // 要渲染的有效内容
  const validContent = mainContent || content;

  // 如果没有有效内容，显示错误信息
  if (!validContent) {
    return (
      <div className={styles.articleContainer}>
        <h1 className={styles.title}>{title || "无标题文章"}</h1>
        {summary && (
          <div className={styles.summary}>
            <p>{summary}</p>
          </div>
        )}
        <div className={styles.error}>文章内容不可用</div>
      </div>
    );
  }

  // 将Markdown内容解析为React组件
  const renderContent = (rawContent) => {
    if (!rawContent) {
      console.log("No content to render");
      return <div className={styles.emptyContent}>No content available</div>;
    }

    console.log("Rendering content length:", rawContent.length);

    // 分割内容为段落
    const paragraphs = rawContent.split(/\n{2,}/);
    console.log("Paragraph count:", paragraphs.length);

    return paragraphs
      .map((paragraph, index) => {
        // 跳过空段落
        if (!paragraph.trim()) return null;

        // 处理标题（###、##、#）
        if (paragraph.startsWith("###")) {
          return (
            <h3 key={`h3-${index}`} className={styles.heading3}>
              {renderInlineContent(paragraph.replace(/^###\s*/, ""))}
            </h3>
          );
        } else if (paragraph.startsWith("##")) {
          return (
            <h2 key={`h2-${index}`} className={styles.heading2}>
              {renderInlineContent(paragraph.replace(/^##\s*/, ""))}
            </h2>
          );
        } else if (paragraph.startsWith("#")) {
          return (
            <h1 key={`h1-${index}`} className={styles.heading1}>
              {renderInlineContent(paragraph.replace(/^#\s*/, ""))}
            </h1>
          );
        }

        // 处理代码块 (```code```)
        if (paragraph.startsWith("```") && paragraph.endsWith("```")) {
          let language = "";
          let code = paragraph.substring(3, paragraph.length - 3);

          // 检查是否指定了语言
          const firstLineBreak = code.indexOf("\n");
          if (firstLineBreak > 0) {
            const possibleLang = code.substring(0, firstLineBreak).trim();
            if (/^[a-zA-Z0-9]+$/.test(possibleLang)) {
              language = possibleLang;
              code = code.substring(firstLineBreak + 1);
            }
          }

          return (
            <div key={`code-${index}`} className={styles.codeBlockContainer}>
              {language && (
                <div className={styles.codeLanguage}>{language}</div>
              )}
              <pre className={styles.codeBlock}>
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // 处理引用块（>开头的文本）
        if (paragraph.startsWith(">")) {
          const lines = paragraph.split("\n");
          const quoteContent = lines
            .map((line) => line.replace(/^>\s*/, ""))
            .join("\n");

          return (
            <blockquote key={`quote-${index}`} className={styles.blockquote}>
              {renderInlineContent(quoteContent)}
            </blockquote>
          );
        }

        // 处理列表（* 或 - 开头的项目）
        if (paragraph.trim().match(/^[*-]\s/m)) {
          const listItems = paragraph.split(/\n/).filter((item) => item.trim());

          // 检查是否是嵌套列表（以* 或 - 开头且有缩进的项目）
          if (listItems.some((item) => item.trim().match(/^\s+[*-]\s/))) {
            // 处理嵌套列表
            let currentList = [];
            let result = [];

            for (let i = 0; i < listItems.length; i++) {
              const item = listItems[i];
              const trimmedItem = item.trim();
              const indent = item.length - trimmedItem.length;

              if (indent === 0) {
                if (currentList.length > 0) {
                  result.push(
                    <ul
                      key={`nested-${index}-${result.length}`}
                      className={styles.list}
                    >
                      {currentList}
                    </ul>
                  );
                  currentList = [];
                }

                currentList.push(
                  <li key={`item-${index}-${i}`} className={styles.listItem}>
                    {renderInlineContent(trimmedItem.replace(/^[*-]\s/, ""))}
                  </li>
                );
              } else {
                // 嵌套项
                currentList.push(
                  <li
                    key={`nested-item-${index}-${i}`}
                    className={styles.nestedListItem}
                  >
                    {renderInlineContent(trimmedItem.replace(/^[*-]\s/, ""))}
                  </li>
                );
              }
            }

            if (currentList.length > 0) {
              result.push(
                <ul key={`nested-final-${index}`} className={styles.list}>
                  {currentList}
                </ul>
              );
            }

            return <div key={`nested-list-${index}`}>{result}</div>;
          }

          // 简单列表
          return (
            <ul key={`list-${index}`} className={styles.list}>
              {listItems.map((item, i) => (
                <li key={`list-item-${index}-${i}`} className={styles.listItem}>
                  {renderInlineContent(item.replace(/^[*-]\s/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        // 处理术语定义（缩进段落）
        if (paragraph.startsWith("    ") || paragraph.startsWith("\t")) {
          return (
            <div key={`term-${index}`} className={styles.terminologyDefinition}>
              {renderInlineContent(paragraph.trim())}
            </div>
          );
        }

        // 处理水平线
        if (
          paragraph.trim() === "---" ||
          paragraph.trim() === "***" ||
          paragraph.trim() === "___"
        ) {
          return <hr key={`hr-${index}`} className={styles.horizontalRule} />;
        }

        // 普通段落
        return (
          <p key={`p-${index}`} className={styles.paragraph}>
            {renderInlineContent(paragraph)}
          </p>
        );
      })
      .filter(Boolean); // 过滤掉空值
  };

  // 处理段落内的内联格式（粗体、斜体、链接等）
  const renderInlineContent = (text) => {
    if (!text) return null;

    // 将文本拆分为多个部分进行处理
    let parts = [text];

    // 处理粗体 (**text**)
    parts = processInlineFormat(parts, /\*\*(.*?)\*\*/g, (match, content) => (
      <strong key={`bold-${Math.random().toString(36).slice(2, 11)}`}>
        {content}
      </strong>
    ));

    // 处理斜体 (*text*)
    parts = processInlineFormat(parts, /\*(.*?)\*/g, (match, content) => (
      <em key={`italic-${Math.random().toString(36).slice(2, 11)}`}>
        {content}
      </em>
    ));

    // 处理行内代码 (`code`)
    parts = processInlineFormat(parts, /`([^`]+)`/g, (match, content) => (
      <code
        key={`code-${Math.random().toString(36).slice(2, 11)}`}
        className={styles.inlineCode}
      >
        {content}
      </code>
    ));

    // 处理链接 [text](url)
    parts = processInlineFormat(
      parts,
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, text, url) => (
        <Link
          href={url}
          key={`link-${Math.random().toString(36).slice(2, 11)}`}
          className={styles.link}
        >
          {text}
        </Link>
      )
    );

    // 处理参考链接 [text][ref]
    if (links && Array.isArray(links) && links.length > 0) {
      // 预先过滤掉无效链接
      const validLinks = links.filter(
        (link) => link !== null && link !== undefined
      );

      if (validLinks.length > 0) {
        parts = processInlineFormat(
          parts,
          /\[([^\]]+)\]\[([^\]]+)\]/g,
          (match, text, reference) => {
            if (!reference)
              return (
                <span key={`no-ref-${Math.random().toString(36).slice(2, 11)}`}>
                  {match}
                </span>
              );

            const url = findReferenceUrl(reference);
            return url ? (
              <Link
                href={url}
                key={`ref-${Math.random().toString(36).slice(2, 11)}`}
                className={styles.link}
              >
                {text || reference}
              </Link>
            ) : (
              <span
                key={`no-ref-${Math.random().toString(36).slice(2, 11)}`}
              >{`[${text || ""}][${reference || ""}]`}</span>
            );
          }
        );
      }
    }

    // 处理已处理好的数组，将字符串和React元素混合在一起
    return parts.map((part, index) => {
      return typeof part === "string" ? part : part;
    });
  };

  // 辅助函数：处理内联格式
  const processInlineFormat = (parts, regex, createComponent) => {
    const result = [];

    for (const part of parts) {
      // 只处理字符串部分，跳过已处理的React元素
      if (typeof part !== "string") {
        result.push(part);
        continue;
      }

      let lastIndex = 0;
      const matches = Array.from(part.matchAll(regex));

      if (matches.length === 0) {
        result.push(part);
        continue;
      }

      for (const match of matches) {
        const [fullMatch, ...groups] = match;
        const matchIndex = match.index;

        // 添加匹配前的文本
        if (matchIndex > lastIndex) {
          result.push(part.substring(lastIndex, matchIndex));
        }

        // 添加处理后的组件
        result.push(createComponent(fullMatch, ...groups));

        lastIndex = matchIndex + fullMatch.length;
      }

      // 添加最后一个匹配后的文本
      if (lastIndex < part.length) {
        result.push(part.substring(lastIndex));
      }
    }

    return result;
  };

  // 从links属性中查找引用链接的URL
  const findReferenceUrl = (reference) => {
    if (!links || !Array.isArray(links)) return null;

    // 过滤掉links中的null和undefined值
    const validLinks = links.filter(
      (link) => link !== null && link !== undefined
    );

    if (validLinks.length === 0) return null;

    console.log(
      "Looking for reference:",
      reference,
      "in valid links:",
      validLinks.length
    );

    // 处理各种引用格式

    // 完整URL引用
    if (
      reference &&
      typeof reference === "string" &&
      reference.includes("http")
    ) {
      return reference;
    }

    // 处理domain.com格式
    const domainMatch =
      reference && typeof reference === "string"
        ? reference.match(/([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)?)$/)
        : null;

    if (domainMatch) {
      const domain = domainMatch[1];
      const link = validLinks.find((url) => {
        if (!url) return false;
        if (typeof url === "string") {
          return url.includes(domain);
        } else if (url && typeof url === "object" && url.url) {
          return url.url.includes(domain);
        }
        return false;
      });
      return link
        ? typeof link === "object" && link.url
          ? link.url
          : link
        : null;
    }

    // 处理站点名称引用，如"billboard"
    const siteName =
      reference && typeof reference === "string"
        ? reference.toLowerCase().trim()
        : "";
    const siteMap = {
      billboard: "billboard.com",
      livenation: "livenationentertainment.com",
      ticketmaster: "ticketmaster.com",
      pollstar: "pollstar.com",
      billieeilish: "billieeilish.com",
    };

    if (siteMap[siteName]) {
      const domain = siteMap[siteName];
      const link = validLinks.find((url) => {
        if (!url) return false;
        if (typeof url === "string") {
          return url.includes(domain);
        } else if (url && typeof url === "object" && url.url) {
          return url.url.includes(domain);
        }
        return false;
      });
      if (link) {
        console.log("Found link for", siteName, ":", link);
      }
      return link
        ? typeof link === "object" && link.url
          ? link.url
          : link
        : null;
    }

    return null;
  };

  return (
    <div className={styles.articleContainer}>
      {/* 文章标题 */}
      <h1 className={styles.title}>{title}</h1>

      {/* 摘要 - 如果有摘要就显示 */}
      {summary && summary.trim() && (
        <div className={styles.summary}>
          <p>{summary}</p>
        </div>
      )}

      {/* 介绍部分 */}
      {introduction && introduction.trim() && (
        <div className={styles.introduction}>
          <h2 className={styles.heading2}>Introduction</h2>
          {renderContent(introduction)}
        </div>
      )}

      {/* 主要内容 */}
      <div className={styles.mainContent}>
        {/* 如果没有单独的介绍部分，但内容里也没有Introduction标题，则添加一个 */}
        {!introduction &&
          !mainContent.includes("### Introduction") &&
          !mainContent.includes("# Introduction") && (
            <h2 className={styles.heading2}>Contents</h2>
          )}
        {renderContent(validContent)}
      </div>

      {/* 结论 - 如果有结论就显示 */}
      {conclusion && conclusion.trim() && (
        <div className={styles.conclusion}>
          <h2 className={styles.conclusionTitle}>Conclusion</h2>
          {renderContent(conclusion)}
        </div>
      )}

      {/* 标签 */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={`tag-${index}`} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 链接参考 */}
      {Array.isArray(links) && links.length > 0 && (
        <div className={styles.references}>
          <h3 className={styles.referencesTitle}>参考链接</h3>
          <ul className={styles.referencesList}>
            {links
              .filter((link) => link !== null && link !== undefined) // 过滤掉null和undefined
              .map((link, index) => (
                <li key={`ref-${index}`} className={styles.referenceItem}>
                  <Link
                    href={
                      typeof link === "object" && link && link.url
                        ? link.url
                        : typeof link === "string"
                        ? link
                        : "#"
                    }
                    className={styles.referenceLink}
                  >
                    {typeof link === "object" && link && link.text
                      ? link.text
                      : typeof link === "string"
                      ? link
                      : "链接"}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArticleRenderer;
