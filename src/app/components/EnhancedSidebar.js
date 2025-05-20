"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import styles from "./EnhancedSidebar.module.css";
import { trackClick } from "@/lib/analytics";
import { getAllTags, getTagTextById } from "@/lib/tags";
import SearchBar from "./SearchBar";

// Tag data, using ID instead of text
const defaultTags = [
  { id: "ai", count: 42 },
  { id: "economy", count: 38 },
  { id: "technology", count: 35 },
  { id: "investment", count: 29 },
  { id: "global-affairs", count: 26 },
  { id: "sustainable-development", count: 24 },
  { id: "innovation", count: 22 },
  { id: "finance", count: 21 },
  { id: "business-strategy", count: 18 },
  { id: "leadership", count: 17 },
  { id: "climate-change", count: 16 },
  { id: "trends", count: 15 },
];

const EnhancedSidebar = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [popularTags, setPopularTags] = useState(defaultTags);
  const [popularPosts, setPopularPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 获取热门文章
  useEffect(() => {
    async function fetchPopularPosts() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/popular-posts");

        if (!response.ok) {
          throw new Error("Failed to fetch popular posts");
        }

        const data = await response.json();
        setPopularPosts(data.popularPosts || []);
      } catch (err) {
        console.error("Error fetching popular posts:", err);
        setError("Failed to load popular posts");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopularPosts();
  }, []);

  // Initialize tags from the tag system
  useEffect(() => {
    // Get all tags and add default counts
    const allTags = getAllTags().map((tag) => ({
      id: tag.id,
      text: tag.text,
      count: Math.floor(Math.random() * 40) + 10, // Random count, should come from API in real application
    }));

    // Limit the number of tags displayed
    setPopularTags(allTags.slice(0, 12));
  }, []);

  // Handle subscription form submission
  const handleSubscribe = (e) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Here you can add an actual API call to handle subscription
    console.log("Subscription email:", email);
    trackClick("subscribe-button", "subscription", email);

    // Simulate successful response
    setSubscribed(true);
  };

  // Handle tag click
  const handleTagClick = (tagId, tagText) => {
    trackClick(`tag-${tagId}`, "sidebar-tag", tagText);
  };

  // Handle article click
  const handleArticleClick = (postId, title) => {
    trackClick(`popular-post-${postId}`, "sidebar-popular-post", title);
  };

  // 获取格式化的日期，用于URL
  const formatDateForUrl = (dateString) => {
    return dayjs(dateString).format("YYYYMMDD");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.search}>
        <SearchBar />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Popular Articles</h3>

        {isLoading ? (
          <div className={styles.loading}>Loading popular articles...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : popularPosts.length > 0 ? (
          <ul className={styles.popularList}>
            {popularPosts.map((post) => (
              <li key={post._id} className={styles.popularItem}>
                <Link
                  href={`/posts/${formatDateForUrl(post.date)}/${post.slug}`}
                  className={styles.popularLink}
                >
                  <span className={styles.popularTitle}>{post.title}</span>
                  <span className={styles.popularViews}>
                    {post.views} views
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>No popular articles found</div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Categories</h3>
        <ul className={styles.categoryList}>
          <li>
            <Link href="/category/technology">Technology</Link>
          </li>
          <li>
            <Link href="/category/business">Business</Link>
          </li>
          <li>
            <Link href="/category/finance">Finance</Link>
          </li>
          <li>
            <Link href="/category/investment">Investment</Link>
          </li>
        </ul>
      </div>

      {/* Subscription form section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Subscribe to Newsletter</h3>
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
            <p className={styles.subscribeText}>
              Get the latest insights and analysis delivered directly to your
              inbox
            </p>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.subscribeButton}>
                Subscribe
              </button>
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
        ) : (
          <div className={styles.successMessage}>
            <p>
              <span className={styles.checkmark}>✓</span> Thank you for
              subscribing!
            </p>
            <p>We've sent a confirmation email to your inbox.</p>
          </div>
        )}
      </section>

      {/* Tag cloud section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Explore Topics</h3>
        <div className={styles.tagCloud}>
          {popularTags.map((tag) => {
            const tagText = tag.text || getTagTextById(tag.id);
            return (
              <Link
                key={tag.id}
                href={`/tags/${encodeURIComponent(tag.id)}`}
                className={`${styles.tagItem} ${
                  styles[
                    `tagSize${Math.min(
                      5,
                      Math.max(1, Math.ceil(tag.count / 10))
                    )}`
                  ]
                }`}
                onClick={() => handleTagClick(tag.id, tagText)}
              >
                {tagText}
                <span className={styles.tagCount}>{tag.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* About blog section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>About This Blog</h3>
        <div className={styles.aboutBlog}>
          <p>
            This blog is dedicated to providing in-depth analysis and
            cutting-edge insights across technology, business, and global
            affairs.
          </p>
          <Link href="/about" className={styles.aboutLink}>
            Learn More →
          </Link>
        </div>
      </section>
    </aside>
  );
};

export default EnhancedSidebar;
