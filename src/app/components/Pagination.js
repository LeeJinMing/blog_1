"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./Pagination.module.css";

const Pagination = ({ currentPage, totalPages, basePath }) => {
  const router = useRouter();

  // 客户端逻辑：窗口大小状态
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // 安全地确保页码和总页数是有效的（不依赖于状态）
  const safePage = useMemo(
    () => Math.max(1, Math.min(totalPages || 1, currentPage || 1)),
    [currentPage, totalPages]
  );

  const safeTotalPages = useMemo(
    () => Math.max(1, totalPages || 1),
    [totalPages]
  );

  // 仅在客户端初始化窗口大小
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setIsMounted(true);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 重定向逻辑移至客户端
  useEffect(() => {
    if (isMounted && currentPage > safeTotalPages && currentPage !== 1) {
      router.push(getPageUrl(1));
    }
  }, [currentPage, safeTotalPages, isMounted, router]);

  // 如果没有足够页面，不渲染分页
  if (safeTotalPages <= 1) {
    return null;
  }

  // 生成页码 URL
  const getPageUrl = (page) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}?page=${page}`;
  };

  // 计算要显示的页码
  // 使用 isSmallScreen 作为本地变量而不是状态，避免服务器/客户端不一致
  const getPageNumbers = () => {
    // 确保在服务器端渲染中使用较大的屏幕配置
    const isSmallScreen = isMounted ? windowWidth < 640 : false;
    const maxPagesToShow = isSmallScreen ? 3 : 5;

    let startPage = Math.max(1, safePage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(safeTotalPages, startPage + maxPagesToShow - 1);

    // 调整起始页以尽可能显示最大页码数
    startPage = Math.max(1, endPage - maxPagesToShow + 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <ul className={styles.paginationList}>
        {/* 首页按钮 */}
        {safePage > 1 && (
          <li className={styles.paginationItem}>
            <Link
              href={getPageUrl(1)}
              className={styles.paginationLink}
              aria-label="Go to first page"
            >
              «
            </Link>
          </li>
        )}

        {/* 上一页按钮 */}
        {safePage > 1 && (
          <li className={styles.paginationItem}>
            <Link
              href={getPageUrl(safePage - 1)}
              className={styles.paginationLink}
              aria-label="Go to previous page"
            >
              ‹
            </Link>
          </li>
        )}

        {/* 页码按钮 */}
        {pageNumbers.map((page) => (
          <li key={page} className={styles.paginationItem}>
            <Link
              href={getPageUrl(page)}
              className={`${styles.paginationLink} ${
                page === safePage ? styles.active : ""
              }`}
              aria-current={page === safePage ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Link>
          </li>
        ))}

        {/* 下一页按钮 */}
        {safePage < safeTotalPages && (
          <li className={styles.paginationItem}>
            <Link
              href={getPageUrl(safePage + 1)}
              className={styles.paginationLink}
              aria-label="Go to next page"
            >
              ›
            </Link>
          </li>
        )}

        {/* 末页按钮 */}
        {safePage < safeTotalPages && (
          <li className={styles.paginationItem}>
            <Link
              href={getPageUrl(safeTotalPages)}
              className={styles.paginationLink}
              aria-label="Go to last page"
            >
              »
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
