"use client";

import { useEffect } from "react";
import { trackPostView, trackExternalLinkClick } from "@/lib/analytics";

/**
 * 客户端组件，用于跟踪文章阅读事件和外部链接点击
 */
export default function PostViewTracker({ post }) {
  useEffect(() => {
    if (post?._id) {
      // 文章加载完成后，跟踪阅读事件
      trackPostView(post);

      // 添加外部链接点击跟踪
      const trackExternalLinks = () => {
        const links = document.querySelectorAll(
          '.post-content a[href^="http"], .post-references a[href^="http"]'
        );
        links.forEach((link) => {
          if (!link.getAttribute("data-tracked")) {
            link.setAttribute("data-tracked", "true");
            link.addEventListener("click", () => {
              trackExternalLinkClick(link.href, link.textContent);
            });
          }
        });
      };

      // 页面完全加载后跟踪外部链接
      setTimeout(trackExternalLinks, 1000);
    }
  }, [post]);

  // 这个组件不需要渲染任何内容
  return null;
}
