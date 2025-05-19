"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackSearch } from "@/lib/analytics";
import styles from "./EnhancedSearch.module.css";

export default function EnhancedSearch() {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // 初始化时从本地存储加载最近的搜索记录
  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  // 监听点击事件，实现点击外部关闭搜索
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 搜索建议逻辑
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // 这里可以连接到你的实际建议API
        // 现在我们模拟一些建议
        setTimeout(() => {
          const mockSuggestions = [
            `${query} 分析`,
            `${query} 历史`,
            `${query} 案例`,
            `${query} 最新动态`,
          ].filter((s) => s.length > query.length);

          setSuggestions(mockSuggestions);
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // 记录搜索到分析系统
      trackSearch(query, -1);

      // 保存到最近搜索记录
      const updatedSearches = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

      // 跳转到搜索页面
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // 当搜索框展开时，自动聚焦
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    trackSearch(suggestion, -1);

    // 保存到最近搜索记录
    const updatedSearches = [
      suggestion,
      ...recentSearches.filter((s) => s !== suggestion),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    // 跳转到搜索页面
    router.push(`/search?q=${encodeURIComponent(suggestion.trim())}`);
    setIsExpanded(false);
  };

  const handleRecentSearchClick = (search) => {
    setQuery(search);
    handleSuggestionClick(search);
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div
      ref={searchRef}
      className={`${styles.searchContainer} ${
        isExpanded ? styles.expanded : ""
      }`}
    >
      <button
        type="button"
        className={styles.searchToggle}
        onClick={toggleSearch}
        aria-label={isExpanded ? "关闭搜索" : "打开搜索"}
      >
        {isExpanded ? (
          <span className={styles.closeIcon}>✕</span>
        ) : (
          <span className={styles.searchIcon}>🔍</span>
        )}
      </button>

      {isExpanded && (
        <div className={styles.searchExpanded}>
          <form onSubmit={handleSubmit} className={styles.searchForm}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章、主题或关键词..."
              className={styles.searchInput}
              aria-label="搜索文章"
            />
            <button type="submit" className={styles.searchButton}>
              搜索
            </button>
          </form>

          {/* 搜索建议 */}
          {query.length > 1 && (
            <div className={styles.suggestionsContainer}>
              {isLoading ? (
                <div className={styles.loadingIndicator}>加载建议中...</div>
              ) : suggestions.length > 0 ? (
                <ul className={styles.suggestionsList}>
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className={styles.suggestionItem}>
                      <button
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={styles.suggestionButton}
                      >
                        <span className={styles.searchIcon}>🔍</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: suggestion.replace(
                              new RegExp(`(${query})`, "gi"),
                              "<strong>$1</strong>"
                            ),
                          }}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {/* 最近搜索 */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className={styles.recentSearches}>
              <div className={styles.recentHeader}>
                <span>最近搜索</span>
                <button
                  className={styles.clearButton}
                  onClick={clearRecentSearches}
                >
                  清除
                </button>
              </div>
              <ul className={styles.recentList}>
                {recentSearches.map((search, index) => (
                  <li key={index} className={styles.recentItem}>
                    <button
                      onClick={() => handleRecentSearchClick(search)}
                      className={styles.recentButton}
                    >
                      <span className={styles.historyIcon}>⟲</span>
                      {search}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
