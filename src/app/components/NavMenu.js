"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./NavMenu.module.css";

export default function NavMenu() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  // Define main categories
  const categories = [
    { name: "Politics & Diplomacy", slug: "politics-diplomacy" },
    { name: "Business & Economy", slug: "business-economy" },
    { name: "Technology & Innovation", slug: "tech-innovation" },
    { name: "International Relations", slug: "international-relations" },
    { name: "Culture & Society", slug: "culture-society" },
  ];

  // Define archives by date
  const archives = [{ name: "2025", slug: "2025" }];

  // Toggle dropdown menu state
  const toggleCategory = () => {
    setCategoryOpen(!categoryOpen);
    if (dateOpen) setDateOpen(false);
  };

  const toggleDate = () => {
    setDateOpen(!dateOpen);
    if (categoryOpen) setCategoryOpen(false);
  };

  // Close all dropdown menus
  const closeMenus = () => {
    setCategoryOpen(false);
    setDateOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.navLink} onClick={closeMenus}>
            Home
          </Link>
        </li>

        <li className={`${styles.navItem} ${styles.dropdown}`}>
          <button
            className={`${styles.navLink} ${styles.dropdownToggle}`}
            onClick={toggleCategory}
            aria-expanded={categoryOpen}
          >
            By Topic <span className={styles.arrow}>▼</span>
          </button>

          {categoryOpen && (
            <ul className={styles.dropdownMenu}>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className={styles.dropdownItem}
                    onClick={closeMenus}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className={`${styles.dropdownItem} ${styles.viewAll}`}
                  onClick={closeMenus}
                >
                  View All Categories →
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className={`${styles.navItem} ${styles.dropdown}`}>
          <button
            className={`${styles.navLink} ${styles.dropdownToggle}`}
            onClick={toggleDate}
            aria-expanded={dateOpen}
          >
            By Date <span className={styles.arrow}>▼</span>
          </button>

          {dateOpen && (
            <ul className={styles.dropdownMenu}>
              {archives.map((archive) => (
                <li key={archive.slug}>
                  <Link
                    href={`/archive/${archive.slug}`}
                    className={styles.dropdownItem}
                    onClick={closeMenus}
                  >
                    {archive.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li className={styles.navItem}>
          <Link href="/about" className={styles.navLink} onClick={closeMenus}>
            About Us
          </Link>
        </li>
      </ul>
    </nav>
  );
}
