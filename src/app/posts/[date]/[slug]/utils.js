/**
 * 移除与主标题类似或相同的内容，避免重复
 * @param {string} content - 文章内容
 * @param {string} title - 文章标题
 * @returns {string} - 处理后的内容
 */
export function removeRepeatedTitle(content, title) {
  if (!content || !title) return content;

  try {
    // 准备标题的不同变体进行匹配
    const escapedTitle = title
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // 转义正则表达式特殊字符
      .trim();

    // 提取主标题（冒号前面的部分）和副标题（冒号后面的部分）
    const titleParts = title.split(/[：:]/);
    const mainTitle = titleParts[0].trim();
    const escapedMainTitle = mainTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // 移除可能匹配的标题行（忽略大小写）
    let processedContent = content;

    // 1. 移除完全匹配的标题行 - 匹配整个标题
    const exactTitlePattern = new RegExp(`^\\s*${escapedTitle}\\s*$`, "gmi");
    processedContent = processedContent.replace(exactTitlePattern, "");

    // 1.1 匹配主标题（冒号前的部分）
    if (mainTitle.length > 3) {
      const exactMainTitlePattern = new RegExp(
        `^\\s*${escapedMainTitle}\\s*$`,
        "gmi"
      );
      processedContent = processedContent.replace(exactMainTitlePattern, "");

      // 1.2 匹配主标题加不同内容的情况
      const mainTitleWithVariationsPattern = new RegExp(
        `^\\s*${escapedMainTitle}[：:的与和].*?$`,
        "gmi"
      );
      processedContent = processedContent.replace(
        mainTitleWithVariationsPattern,
        ""
      );
    }

    // 2. 移除Markdown格式的标题 (# 标题)
    const h1Pattern = new RegExp(`^\\s*#\\s*${escapedTitle}.*?$`, "gmi");
    processedContent = processedContent.replace(h1Pattern, "");

    // 2.1 针对主标题的Markdown格式
    if (mainTitle.length > 3) {
      const mainTitleH1Pattern = new RegExp(
        `^\\s*#\\s*${escapedMainTitle}.*?$`,
        "gmi"
      );
      processedContent = processedContent.replace(mainTitleH1Pattern, "");
    }

    // 3. 移除HTML格式的标题 (<h1>标题</h1> 或 <h2>标题</h2>)
    const htmlH1Pattern = new RegExp(
      `<h[12][^>]*>\\s*${escapedTitle}\\s*</h[12]>`,
      "gi"
    );
    processedContent = processedContent.replace(htmlH1Pattern, "");

    // 3.1 针对主标题的HTML标签
    if (mainTitle.length > 3) {
      const mainTitleHtmlPattern = new RegExp(
        `<h[12][^>]*>\\s*${escapedMainTitle}[^<]*</h[12]>`,
        "gi"
      );
      processedContent = processedContent.replace(mainTitleHtmlPattern, "");
    }

    // 4. 移除特殊格式标题
    // 4.1 处理"案："格式 (如 "Valeria Marquez案：...")
    if (title.includes("案")) {
      // 如果标题已经包含"案："，直接匹配整个标题
      const titleWithCasePattern = new RegExp(
        `^\\s*${escapedTitle}\\s*$`,
        "gmi"
      );
      processedContent = processedContent.replace(titleWithCasePattern, "");
    } else {
      // 如果标题不含"案："，尝试匹配"标题案："的模式
      const casePattern = new RegExp(`^\\s*${escapedTitle}案[：:].*?$`, "gmi");
      processedContent = processedContent.replace(casePattern, "");
    }

    // 4.2 处理"腐败迷雾"等格式
    if (
      title.includes("迷雾") ||
      title.includes("挑战") ||
      title.includes("困境")
    ) {
      // 尝试找到标题的关键部分
      const keyWords = [
        "腐败",
        "迷雾",
        "挑战",
        "困境",
        "危机",
        "问题",
        "风险",
        "争议",
        "争端",
        "案例",
        "调查",
        "分析",
        "研究",
      ];

      const titleKeywordsMatch = keyWords.filter((word) =>
        title.includes(word)
      );
      if (titleKeywordsMatch.length > 0) {
        // 针对每个关键词，尝试匹配包含该词的相似行
        for (const keyword of titleKeywordsMatch) {
          // 找出标题中包含关键词的部分及其前后文
          const keywordIndex = title.indexOf(keyword);
          const startIndex = Math.max(0, keywordIndex - 10);
          const endIndex = Math.min(
            title.length,
            keywordIndex + keyword.length + 10
          );
          const keywordContext = title.substring(startIndex, endIndex);

          if (keywordContext.length > 5) {
            const escapedContext = keywordContext.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            );
            const contextPattern = new RegExp(`.*${escapedContext}.*`, "gi");
            processedContent = processedContent.replace(
              contextPattern,
              (match) => {
                // 如果该行与原标题高度相似，移除
                const similarity = calculateSimilarity(match, title);
                return similarity > 0.6 ? "" : match;
              }
            );
          }
        }
      }
    }

    // 5. 如果标题包含冒号分隔符，处理其主副标题
    if (titleParts.length > 1) {
      // 5.1 检查冒号前的主标题部分
      if (mainTitle.length > 3) {
        // 处理可能的变体，如"Pemex的困境与曙光："
        const mainTitleVariations = [
          new RegExp(`^\\s*${escapedMainTitle}\\s*的.*?[：:]`, "gmi"),
          new RegExp(`^\\s*${escapedMainTitle}\\s*与.*?[：:]`, "gmi"),
          new RegExp(`^\\s*${escapedMainTitle}.*?[：:]`, "gmi"),
        ];

        for (const pattern of mainTitleVariations) {
          processedContent = processedContent.replace(pattern, "");
        }
      }

      // 5.2 检查冒号后的副标题部分
      const subTitle = titleParts.slice(1).join("：").trim();
      if (subTitle.length > 5) {
        const escapedSubTitle = subTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // 处理可能的变体
        const subTitlePattern = new RegExp(
          `^\\s*${escapedSubTitle}\\s*$`,
          "gmi"
        );
        processedContent = processedContent.replace(subTitlePattern, "");

        // 副标题也可能作为一个独立的标题出现
        const subTitleHeadingPattern = new RegExp(
          `^\\s*#\\s*${escapedSubTitle}.*?$`,
          "gmi"
        );
        processedContent = processedContent.replace(subTitleHeadingPattern, "");
      }
    }

    // 6. 移除引言部分的重复标题
    // "引言："、"摘要："等开头的部分如果包含标题，也应该检查
    const introPatterns = [
      new RegExp(`引言[：:] *${escapedTitle}`, "gi"),
      new RegExp(`摘要[：:] *${escapedTitle}`, "gi"),
      new RegExp(`简介[：:] *${escapedTitle}`, "gi"),
      new RegExp(`案例[：:] *${escapedTitle}`, "gi"),
    ];

    // 6.1 针对主标题的引言模式
    if (mainTitle.length > 3) {
      introPatterns.push(
        new RegExp(`引言[：:] *${escapedMainTitle}`, "gi"),
        new RegExp(`摘要[：:] *${escapedMainTitle}`, "gi"),
        new RegExp(`简介[：:] *${escapedMainTitle}`, "gi"),
        new RegExp(`案例[：:] *${escapedMainTitle}`, "gi")
      );
    }

    for (const pattern of introPatterns) {
      processedContent = processedContent.replace(pattern, (match) => {
        // 保留"引言："等部分，只移除标题
        return match.split(/[：:]/)[0] + "：";
      });
    }

    // 7. 移除以类似"标题的困境与曙光："开头的段落
    // 只有当原标题不包含"案："时才执行此操作
    const paragraphs = processedContent.split(/\n\n+/);
    const filteredParagraphs = paragraphs.filter((para) => {
      // 检查段落是否以标题相关内容开头
      const trimmedPara = para.trim();
      if (trimmedPara.length < mainTitle.length) return true; // 短段落保留

      // 计算段落开头与标题的相似度
      const paraStart = trimmedPara.substring(
        0,
        Math.min(trimmedPara.length, title.length + 20)
      );
      const similarity = calculateSimilarity(
        paraStart.toLowerCase(),
        title.toLowerCase()
      );

      // 如果相似度高于阈值，可能是重复的标题段落
      return similarity < 0.65;
    });

    processedContent = filteredParagraphs.join("\n\n");

    // 8. 对于更一般的情况，移除所有与标题高度相似的行
    // 检查每一行，如果与标题的相似度很高，则移除
    const lines = processedContent.split("\n");
    const filteredLines = lines.filter((line) => {
      const cleanLine = line.trim();
      // 忽略空行或者很短的行
      if (cleanLine.length < 5) return true;

      // 如果行内容与标题完全相同或几乎相同（忽略空格和标点），则移除
      if (cleanLine.toLowerCase() === title.toLowerCase()) return false;

      // 检查这一行是否与主标题完全相同
      if (
        mainTitle.length > 3 &&
        cleanLine.toLowerCase() === mainTitle.toLowerCase()
      )
        return false;

      // 如果行内容包含标题的大部分（80%以上），可能是重复标题
      // 计算相似度
      const similarity = calculateSimilarity(
        cleanLine.toLowerCase(),
        title.toLowerCase()
      );

      // 如果相似度高于阈值，可能是重复标题
      return similarity < 0.7;
    });

    processedContent = filteredLines.join("\n");

    // 9. 最后一个尝试：特别检查内容开头（前5行）是否包含标题或主标题
    // 这针对某些特殊格式的文章，标题可能出现在内容的最开始
    const contentStart = processedContent.split("\n").slice(0, 5);
    let hasRemoved = false;

    const cleanedStart = contentStart.filter((line) => {
      // 如果已经移除了一行，保留后续行
      if (hasRemoved) return true;

      const trimmedLine = line.trim();
      // 检查是否与标题或主标题高度相似
      if (trimmedLine.length > 10) {
        // 计算与完整标题的相似度
        const titleSimilarity = calculateSimilarity(
          trimmedLine.toLowerCase(),
          title.toLowerCase()
        );

        // 计算与主标题的相似度
        const mainTitleSimilarity =
          mainTitle.length > 3
            ? calculateSimilarity(
                trimmedLine.toLowerCase(),
                mainTitle.toLowerCase()
              )
            : 0;

        // 如果任一相似度高于阈值
        if (titleSimilarity > 0.65 || mainTitleSimilarity > 0.8) {
          hasRemoved = true;
          return false;
        }
      }
      return true;
    });

    if (hasRemoved) {
      const restOfContent = processedContent.split("\n").slice(5);
      processedContent = [...cleanedStart, ...restOfContent].join("\n");
    }

    // 10. 清理处理后可能留下的多余空行
    processedContent = processedContent
      .replace(/^\s+/, "") // 移除开头空白
      .replace(/\n{3,}/g, "\n\n") // 将3个或更多换行符替换为2个
      .trim();

    return processedContent;
  } catch (error) {
    console.error("Error removing repeated title:", error);
    return content; // 发生错误时返回原始内容
  }
}

/**
 * 计算两个字符串的相似度（简化版Levenshtein距离）
 * @param {string} str1 - 第一个字符串
 * @param {string} str2 - 第二个字符串
 * @returns {number} - 相似度分数 (0-1)，1表示完全相同
 */
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;

  // 如果字符串完全相同
  if (str1 === str2) return 1;

  // 如果一个字符串包含另一个
  if (str1.includes(str2)) return str2.length / str1.length;
  if (str2.includes(str1)) return str1.length / str2.length;

  // 计算共同单词的数量
  const words1 = str1.split(/\s+/).filter((w) => w.length > 2);
  const words2 = str2.split(/\s+/).filter((w) => w.length > 2);

  let commonWords = 0;
  for (const word1 of words1) {
    if (
      words2.some((word2) => word2.includes(word1) || word1.includes(word2))
    ) {
      commonWords++;
    }
  }

  // 如果没有共同单词
  if (words1.length === 0 || words2.length === 0) return 0;

  // 返回相似度分数
  return commonWords / Math.max(words1.length, words2.length);
}

/**
 * 规范化内容格式，修复各种格式问题
 * @param {string} content - 要格式化的内容
 * @param {string} title - 文章标题
 * @returns {string} - 格式化后的内容
 */
export function normalizeContent(content, title) {
  if (!content) return "";

  try {
    let normalizedContent = content;

    // 提取主标题（冒号前面的部分）和副标题（冒号后面的部分）
    const titleParts = title.split(/[：:]/);
    const mainTitle = titleParts[0].trim();

    // Pemex特殊处理 - 检测是否是Pemex文章
    const isPemexArticle =
      title.includes("Pemex") &&
      (title.includes("腐败") ||
        title.includes("挑战") ||
        title.includes("困境") ||
        title.includes("迷雾"));

    if (isPemexArticle) {
      console.log("Applying special processing for Pemex article");

      // 直接匹配并移除"Pemex的困境与曙光"和"在腐败丑闻与治理困境中"这两种特定标题格式
      const pemexPatterns = [
        /Pemex的困境与曙光[：:].+?投资逻辑/i,
        /Pemex腐败迷雾与治理挑战[：:].+?投资逻辑/i,
        /Pemex的[^：:]+[：:].+?投资逻辑/i,
        /在腐败丑闻与治理困境中.+?投资逻辑/i,
        /探寻墨西哥能源巨头的投资逻辑/i,
      ];

      for (const pattern of pemexPatterns) {
        normalizedContent = normalizedContent.replace(pattern, "");
      }

      // 专门检查和移除可能的重复标题格式
      const lines = normalizedContent.split("\n");
      const filteredLines = lines.filter((line) => {
        const trimmedLine = line.trim().toLowerCase();

        // 检查是否包含"Pemex"和以下任一关键词
        if (
          trimmedLine.includes("pemex") &&
          (trimmedLine.includes("困境") ||
            trimmedLine.includes("曙光") ||
            trimmedLine.includes("腐败") ||
            trimmedLine.includes("迷雾") ||
            trimmedLine.includes("治理") ||
            trimmedLine.includes("挑战") ||
            trimmedLine.includes("墨西哥能源") ||
            trimmedLine.includes("投资逻辑"))
        ) {
          // 检查这一行是否足够长且看起来像标题
          if (trimmedLine.length > 15) {
            return false; // 丢弃这一行
          }
        }

        return true; // 保留其他行
      });

      normalizedContent = filteredLines.join("\n");
    }

    // 1. 删除任何与标题完全匹配的行（不区分大小写）
    const lines = normalizedContent.split("\n");
    const filteredLines = lines.filter((line) => {
      const trimmedLine = line.trim().toLowerCase();
      const titleLower = title.toLowerCase();

      // 检查是否与完整标题匹配
      if (trimmedLine === titleLower) return false;

      // 如果主标题足够长，检查是否只与主标题匹配
      if (mainTitle.length > 3 && trimmedLine === mainTitle.toLowerCase())
        return false;

      // 检查是否是带有轻微变化的标题行
      if (
        trimmedLine.startsWith(titleLower) &&
        trimmedLine.length - titleLower.length < 5
      )
        return false;

      // 检查是否是带有轻微变化的主标题行
      if (
        mainTitle.length > 3 &&
        trimmedLine.startsWith(mainTitle.toLowerCase()) &&
        trimmedLine.includes("：")
      )
        return false;

      return true;
    });
    normalizedContent = filteredLines.join("\n");

    // 2. 处理中文引号 - 统一为正规引号
    normalizedContent = normalizedContent
      .replace(/「/g, '"')
      .replace(/」/g, '"')
      .replace(/『/g, '"')
      .replace(/』/g, '"')
      .replace(/'/g, "'")
      .replace(/'/g, "'");

    // 3. 处理特殊的引言格式
    // 3.1 "引言：幽灵"这种格式
    const titleEscaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const quotePattern = new RegExp(`引言[：:] *${titleEscaped}`, "gi");
    normalizedContent = normalizedContent.replace(quotePattern, "引言：");

    // 3.2 "引言：主标题"格式
    if (mainTitle.length > 3) {
      const mainTitleEscaped = mainTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const mainTitleQuotePattern = new RegExp(
        `引言[：:] *${mainTitleEscaped}`,
        "gi"
      );
      normalizedContent = normalizedContent.replace(
        mainTitleQuotePattern,
        "引言："
      );
    }

    // 4. 删除内容开头的标题相关文本
    // 检查开始的3-5行
    const startLines = normalizedContent.split("\n").slice(0, 5);
    for (let i = 0; i < startLines.length; i++) {
      const line = startLines[i].trim();

      // 如果是空行，继续检查下一行
      if (line.length < 5) continue;

      // 计算与标题的相似度
      const similarity = calculateSimilarity(
        line.toLowerCase(),
        title.toLowerCase()
      );

      // 如果相似度高于阈值
      if (similarity > 0.65) {
        // 移除该行
        const allLines = normalizedContent.split("\n");
        allLines.splice(i, 1);
        normalizedContent = allLines.join("\n");
        break; // 只移除一次
      }

      // 检查与主标题的相似度
      if (mainTitle.length > 3) {
        const mainSimilarity = calculateSimilarity(
          line.toLowerCase(),
          mainTitle.toLowerCase()
        );
        if (mainSimilarity > 0.8) {
          const allLines = normalizedContent.split("\n");
          allLines.splice(i, 1);
          normalizedContent = allLines.join("\n");
          break; // 只移除一次
        }
      }
    }

    // 5. 特别处理常见的重复格式，例如：
    // "Pemex的困境与曙光：在腐败丑闻与治理困境中探寻墨西哥能源巨头的投资逻辑"
    const commonPatterns = [
      new RegExp(
        `${mainTitle.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}的困境与曙光.*?投资逻辑`,
        "gi"
      ),
      new RegExp(
        `${mainTitle.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}腐败迷雾.*?投资逻辑`,
        "gi"
      ),
      new RegExp(
        `${mainTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}的.*?挑战`,
        "gi"
      ),
    ];

    for (const pattern of commonPatterns) {
      normalizedContent = normalizedContent.replace(pattern, "");
    }

    // 6. 清理连续的空行，保持格式整洁
    normalizedContent = normalizedContent
      .replace(/\n{3,}/g, "\n\n") // 连续3个以上换行替换为2个
      .replace(/^\s+/, "") // 移除开头空白
      .replace(/\s+$/, "") // 移除结尾空白
      .trim();

    return normalizedContent;
  } catch (error) {
    console.error("Error normalizing content:", error);
    return content;
  }
}

/**
 * 处理特定文章内容中的HTML标签
 * @param {string} content - 包含HTML标签的内容
 * @returns {string} - 处理后的内容
 */
export function processHtmlContent(content) {
  if (!content) return "";

  let processedContent = content;

  // 替换HTML标签为Markdown等效格式
  processedContent = processedContent.replace(/<h1>(.*?)<\/h1>/g, "## $1\n\n"); // 注意直接转为h2
  processedContent = processedContent.replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n");
  processedContent = processedContent.replace(/<h3>(.*?)<\/h3>/g, "### $1\n\n");
  processedContent = processedContent.replace(/<p>(.*?)<\/p>/g, "$1\n\n");
  processedContent = processedContent.replace(/<ul>/g, "\n");
  processedContent = processedContent.replace(/<\/ul>/g, "\n");
  processedContent = processedContent.replace(/<li>(.*?)<\/li>/g, "- $1\n");
  processedContent = processedContent.replace(/<em>(.*?)<\/em>/g, "*$1*");
  processedContent = processedContent.replace(
    /<strong>(.*?)<\/strong>/g,
    "**$1**"
  );

  // 处理图片和图片说明
  processedContent = processedContent.replace(
    /<figure>\s*<img src="(.*?)" alt="(.*?)">\s*<figcaption>(.*?)<\/figcaption>\s*<\/figure>/g,
    "![$2]($1)\n*$3*\n\n"
  );

  // 处理链接
  processedContent = processedContent.replace(
    /<a href="(.*?)".*?>(.*?)<\/a>/g,
    "[$2]($1)"
  );

  return processedContent;
}
