"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { trackSearch } from "@/lib/analytics";

// 格式化日期为YYYYMMDD的URL格式
function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

// 确保URL安全的slug
function getUrlSafeSlug(slug) {
  try {
    let safeSlug = slug;
    // 替换非URL安全字符（保留连字符和字母数字）
    safeSlug = safeSlug.replace(/[^\w-]/g, (char) => {
      return encodeURIComponent(char);
    });
    return safeSlug;
  } catch (e) {
    console.error("Error normalizing slug:", e);
    // 如果出错，回退到原始slug
    return slug;
  }
}

// 处理API返回的数据，确保MongoDB ID被正确序列化
function serializeSearchResults(results) {
  if (!Array.isArray(results)) return [];

  return results.map((post) => ({
    ...post,
    _id:
      post._id && typeof post._id === "object" ? post._id.toString() : post._id,
  }));
}

// 实际的搜索结果组件
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 调用API
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          throw new Error("Search failed");
        }
        const data = await response.json();

        // 序列化搜索结果
        const serializedData = serializeSearchResults(data);
        setResults(serializedData);

        // 跟踪搜索结果
        trackSearch(query, data.length);
      } catch (err) {
        console.error("Error searching:", err);
        setError("Failed to perform search. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  return (
    <>
      {query ? (
        <p className="search-query">
          Showing results for: <strong>{query}</strong>
        </p>
      ) : (
        <p className="search-query">Please enter a search term</p>
      )}

      {loading && <p className="loading">Loading results...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          {results.length === 0 ? (
            <p>No results found for your search.</p>
          ) : (
            <>
              <p>
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              <section className="post-list search-results">
                {results.map((post) => {
                  const yyyymmdd = formatDateToYYYYMMDD(post.createdAt);
                  const safeSlug = getUrlSafeSlug(post.slug);
                  const postUrl = `/posts/${yyyymmdd}/${safeSlug}`;
                  const formattedDate = dayjs(post.createdAt).format(
                    "MMMM D, YYYY"
                  );

                  return (
                    <article key={post._id} className="search-result-item">
                      <Link href={postUrl}>
                        <h2>{post.title}</h2>
                      </Link>
                      <div className="post-meta">
                        <time
                          dateTime={dayjs(post.createdAt).format("YYYY-MM-DD")}
                        >
                          {formattedDate}
                        </time>
                      </div>
                      <p className="post-summary">
                        {post.summary ||
                          (post.content
                            ? String(post.content).substring(0, 150) + "..."
                            : "No summary available.")}
                      </p>
                      <Link href={postUrl} className="read-more">
                        Read Article →
                      </Link>
                    </article>
                  );
                })}
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}

// 加载中的占位组件
function SearchLoading() {
  return <p className="loading">Loading search results...</p>;
}

// 主页面组件，使用 Suspense 包装
export default function SearchPage() {
  return (
    <div className="search-results-page">
      <h1>Search Results</h1>
      <Suspense fallback={<SearchLoading />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
