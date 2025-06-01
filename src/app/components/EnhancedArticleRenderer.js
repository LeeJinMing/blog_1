import React from "react";
import Link from "next/link";
import { AdManager } from "./AdManager";
import styles from "./ArticleRenderer.module.css";

const EnhancedArticleRenderer = ({ article }) => {
  if (!article) {
    return <div className={styles.error}>Article data unavailable</div>;
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

  // 将内容分段以便插入广告
  const insertAdsInContent = (rawContent) => {
    if (!rawContent) return [];

    // 分割内容为段落
    const paragraphs = rawContent.split(/\n{2,}/);
    const totalParagraphs = paragraphs.length;

    // 计算广告插入位置
    const adPositions = {
      first: Math.floor(totalParagraphs * 0.25), // 25%位置
      second: Math.floor(totalParagraphs * 0.6), // 60%位置
      third: Math.floor(totalParagraphs * 0.85), // 85%位置
    };

    const result = [];

    paragraphs.forEach((paragraph, index) => {
      // 添加段落内容
      if (paragraph.trim()) {
        result.push(renderParagraph(paragraph, index));
      }

      // 在指定位置插入广告
      if (index === adPositions.first && totalParagraphs > 8) {
        result.push(
          <div key={`ad-first-${index}`} className={styles.articleAdWrapper}>
            <AdManager
              adType="native"
              position="middle"
              size="medium"
              className="article-inline-ad"
            />
          </div>
        );
      }

      if (index === adPositions.second && totalParagraphs > 12) {
        result.push(
          <div key={`ad-second-${index}`} className={styles.articleAdWrapper}>
            <AdManager
              adType="native"
              position="middle"
              size="large"
              className="article-inline-ad"
            />
          </div>
        );
      }

      if (index === adPositions.third && totalParagraphs > 16) {
        result.push(
          <div key={`ad-third-${index}`} className={styles.articleAdWrapper}>
            <AdManager
              adType="native"
              position="bottom"
              size="medium"
              className="article-inline-ad"
            />
          </div>
        );
      }
    });

    return result;
  };

  // 渲染单个段落
  const renderParagraph = (paragraph, index) => {
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

    // 处理代码块
    if (paragraph.startsWith("```") && paragraph.endsWith("```")) {
      let language = "";
      let code = paragraph.substring(3, paragraph.length - 3);

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
          {language && <div className={styles.codeLanguage}>{language}</div>}
          <pre className={styles.codeBlock}>
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // 处理引用块
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

    // 处理列表
    if (paragraph.trim().match(/^[*-]\s/m)) {
      const listItems = paragraph.split(/\n/).filter((item) => item.trim());

      return (
        <ul key={`list-${index}`} className={styles.list}>
          {listItems.map((item, i) => (
            <li key={`item-${index}-${i}`} className={styles.listItem}>
              {renderInlineContent(item.replace(/^[*-]\s/, ""))}
            </li>
          ))}
        </ul>
      );
    }

    // 处理数字列表
    if (paragraph.trim().match(/^\d+\.\s/m)) {
      const listItems = paragraph.split(/\n/).filter((item) => item.trim());

      return (
        <ol key={`ordered-list-${index}`} className={styles.orderedList}>
          {listItems.map((item, i) => (
            <li key={`ordered-item-${index}-${i}`} className={styles.listItem}>
              {renderInlineContent(item.replace(/^\d+\.\s/, ""))}
            </li>
          ))}
        </ol>
      );
    }

    // 普通段落
    return (
      <p key={`para-${index}`} className={styles.paragraph}>
        {renderInlineContent(paragraph)}
      </p>
    );
  };

  // 渲染行内内容（粗体、斜体、链接等）
  const renderInlineContent = (text) => {
    if (!text || typeof text !== "string") return text;

    // 处理行内格式
    let parts = [{ type: "text", content: text }];

    // 处理粗体 **text**
    parts = processInlineFormat(parts, /\*\*([^*]+)\*\*/g, (content, key) => (
      <strong key={key} className={styles.bold}>
        {content}
      </strong>
    ));

    // 处理斜体 *text*
    parts = processInlineFormat(parts, /\*([^*]+)\*/g, (content, key) => (
      <em key={key} className={styles.italic}>
        {content}
      </em>
    ));

    // 处理代码 `code`
    parts = processInlineFormat(parts, /`([^`]+)`/g, (content, key) => (
      <code key={key} className={styles.inlineCode}>
        {content}
      </code>
    ));

    // 处理链接 [text](url)
    parts = processInlineFormat(
      parts,
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (content, key, matches) => {
        const linkText = matches[1];
        const url = matches[2];
        return (
          <a
            key={key}
            href={url}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </a>
        );
      }
    );

    return parts.map((part, index) =>
      part.type === "text" ? part.content : part.content
    );
  };

  const processInlineFormat = (parts, regex, createComponent) => {
    const newParts = [];

    parts.forEach((part, partIndex) => {
      if (part.type !== "text") {
        newParts.push(part);
        return;
      }

      const text = part.content;
      let lastIndex = 0;
      let match;
      let segmentIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        // 添加匹配前的文本
        if (match.index > lastIndex) {
          newParts.push({
            type: "text",
            content: text.substring(lastIndex, match.index),
          });
        }

        // 添加格式化组件
        const key = `${partIndex}-${segmentIndex++}`;
        newParts.push({
          type: "component",
          content: createComponent(match[1], key, match),
        });

        lastIndex = match.index + match[0].length;
      }

      // 添加剩余文本
      if (lastIndex < text.length) {
        newParts.push({
          type: "text",
          content: text.substring(lastIndex),
        });
      }

      // Reset regex lastIndex
      regex.lastIndex = 0;
    });

    return newParts;
  };

  return (
    <div className={styles.articleContainer}>
      {/* 文章顶部广告 */}
      <div className={styles.articleTopAd}>
        <AdManager
          adType="native"
          position="top"
          size="large"
          className="article-header-ad"
        />
      </div>

      {/* 文章标题 */}
      <h1 className={styles.title}>{title}</h1>

      {/* 文章摘要 */}
      {summary && (
        <div className={styles.summary}>
          <p>{summary}</p>
        </div>
      )}

      {/* 介绍部分 */}
      {introduction && (
        <div className={styles.introduction}>
          <div className={styles.content}>
            {renderInlineContent(introduction)}
          </div>
        </div>
      )}

      {/* 文章主体内容（带广告插入） */}
      <div className={styles.content}>{insertAdsInContent(validContent)}</div>

      {/* 结论部分前的广告 */}
      {conclusion && (
        <div className={styles.articleConclusionAd}>
          <AdManager
            adType="native"
            position="bottom"
            size="large"
            className="article-conclusion-ad"
          />
        </div>
      )}

      {/* 结论部分 */}
      {conclusion && (
        <div className={styles.conclusion}>
          <h3 className={styles.conclusionTitle}>Conclusion</h3>
          <div className={styles.conclusionContent}>
            {renderInlineContent(conclusion)}
          </div>
        </div>
      )}

      {/* 标签部分 */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className={styles.tags}>
          <h4 className={styles.tagsTitle}>Tags:</h4>
          <div className={styles.tagList}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
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

      {/* 文章底部广告 */}
      <div className={styles.articleBottomAd}>
        <AdManager
          adType="native"
          position="footer"
          size="large"
          className="article-footer-ad"
        />
      </div>
    </div>
  );
};

export default EnhancedArticleRenderer;
