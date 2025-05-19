"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackSearch } from "@/lib/analytics";

export default function Search() {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // 跟踪搜索查询
      trackSearch(query, -1); // -1 表示结果数量暂时未知
      // 跳转到搜索页面
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // 当搜索框展开时，自动聚焦
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    }
  };

  return (
    <div className={`search-container ${isExpanded ? "expanded" : ""}`}>
      <button
        type="button"
        className="search-toggle"
        onClick={toggleSearch}
        aria-label={isExpanded ? "Close search" : "Open search"}
      >
        {isExpanded ? "✕" : "🔍"}
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="search-form">
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="search-input"
            aria-label="Search articles"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      )}
    </div>
  );
}
