"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./NavMenu.module.css";

export default function NavMenu() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  // 定义主要分类
  const categories = [
    { name: "政治与外交", slug: "politics-diplomacy" },
    { name: "商业与经济", slug: "business-economy" },
    { name: "科技与创新", slug: "tech-innovation" },
    { name: "国际关系", slug: "international-relations" },
    { name: "文化与社会", slug: "culture-society" },
  ];

  // 定义按日期归档
  const archives = [
    { name: "2024年", slug: "2024" },
    { name: "2023年", slug: "2023" },
    { name: "2022年", slug: "2022" },
    { name: "更早", slug: "earlier" },
  ];

  // 切换下拉菜单状态
  const toggleCategory = () => {
    setCategoryOpen(!categoryOpen);
    if (dateOpen) setDateOpen(false);
  };

  const toggleDate = () => {
    setDateOpen(!dateOpen);
    if (categoryOpen) setCategoryOpen(false);
  };

  // 关闭所有下拉菜单
  const closeMenus = () => {
    setCategoryOpen(false);
    setDateOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.navLink} onClick={closeMenus}>
            首页
          </Link>
        </li>

        <li className={`${styles.navItem} ${styles.dropdown}`}>
          <button
            className={`${styles.navLink} ${styles.dropdownToggle}`}
            onClick={toggleCategory}
            aria-expanded={categoryOpen}
          >
            按主题 <span className={styles.arrow}>▼</span>
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
                  查看所有分类 →
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
            按日期 <span className={styles.arrow}>▼</span>
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
            关于我们
          </Link>
        </li>
      </ul>
    </nav>
  );
}
