"use client";

import { useEffect } from "react";

/**
 * SVG阻止器组件
 * 用于监控和阻止可能产生问题的SVG data URL请求
 */
export default function SVGBlocker() {
  useEffect(() => {
    // 创建一个MutationObserver来监控DOM变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // 检查新添加的节点
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查是否有SVG data URL
            const element = node;

            // 检查src属性
            if (element.src && element.src.startsWith("data:image/svg+xml")) {
              console.warn("🚫 阻止了SVG data URL (src):", element.src);
              element.src = "";
              element.style.display = "none";
            }

            // 检查background-image样式
            const bgImage = window.getComputedStyle(element).backgroundImage;
            if (bgImage && bgImage.includes("data:image/svg+xml")) {
              console.warn("🚫 阻止了SVG data URL (background):", bgImage);
              element.style.backgroundImage = "none";
              element.style.display = "none";
            }

            // 递归检查子元素
            const children = element.querySelectorAll("*");
            children.forEach((child) => {
              if (child.src && child.src.startsWith("data:image/svg+xml")) {
                console.warn("🚫 阻止了子元素SVG data URL:", child.src);
                child.src = "";
                child.style.display = "none";
              }

              const childBg = window.getComputedStyle(child).backgroundImage;
              if (childBg && childBg.includes("data:image/svg+xml")) {
                console.warn("🚫 阻止了子元素SVG background:", childBg);
                child.style.backgroundImage = "none";
                child.style.display = "none";
              }
            });
          }
        });
      });
    });

    // 开始观察
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "style"],
    });

    // 清理现有的可能问题元素
    const cleanupExisting = () => {
      // 查找所有可能的SVG data URL元素
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        if (element.src && element.src.startsWith("data:image/svg+xml")) {
          console.warn("🚫 清理现有SVG data URL:", element.src);
          element.src = "";
          element.style.display = "none";
        }

        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage.includes("data:image/svg+xml")) {
          console.warn("🚫 清理现有SVG background:", bgImage);
          element.style.backgroundImage = "none";
          element.style.display = "none";
        }
      });
    };

    // 延迟执行清理，确保DOM完全加载
    setTimeout(cleanupExisting, 1000);

    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // 这个组件不渲染任何内容
}
