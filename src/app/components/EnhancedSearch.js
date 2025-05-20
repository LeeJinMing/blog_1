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

  // Load recent searches from local storage on initialization
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

  // Listen for click events to close search when clicking outside
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

  // Search suggestion logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Here you can connect to your actual suggestion API
        // Now we are simulating some suggestions
        setTimeout(() => {
          const mockSuggestions = [
            `${query} analysis`,
            `${query} history`,
            `${query} case studies`,
            `${query} latest developments`,
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
      // Record search to analytics system
      trackSearch(query, -1);

      // Save to recent searches
      const updatedSearches = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

      // Navigate to search page
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Auto-focus when search box expands
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    trackSearch(suggestion, -1);

    // Save to recent searches
    const updatedSearches = [
      suggestion,
      ...recentSearches.filter((s) => s !== suggestion),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    // Navigate to search page
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
        aria-label={isExpanded ? "Close Search" : "Open Search"}
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
              placeholder="Search articles, topics, or keywords..."
              className={styles.searchInput}
              aria-label="Search articles"
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>

          {/* Search suggestions */}
          {query.length > 1 && (
            <div className={styles.suggestionsContainer}>
              {isLoading ? (
                <div className={styles.loadingIndicator}>
                  Loading suggestions...
                </div>
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
              ) : (
                <div className={styles.noSuggestions}>
                  No matching results found
                </div>
              )}
            </div>
          )}

          {/* Recent searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className={styles.recentSearchesContainer}>
              <div className={styles.recentSearchesHeader}>
                <h3>Recent Searches</h3>
                <button
                  onClick={clearRecentSearches}
                  className={styles.clearRecentButton}
                >
                  Clear
                </button>
              </div>
              <ul className={styles.recentSearchesList}>
                {recentSearches.map((search, index) => (
                  <li key={index} className={styles.recentSearchItem}>
                    <button
                      onClick={() => handleRecentSearchClick(search)}
                      className={styles.recentSearchButton}
                    >
                      <span className={styles.historyIcon}>⏱️</span>
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
