"use client";

import React from "react";

export default function CategoryStyles() {
  return (
    <style jsx global>{`
      .categories-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--spacing-md);
      }

      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
      }

      .category-card {
        background-color: white;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        padding: var(--spacing-lg);
        transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        display: flex;
        flex-direction: column;
        color: var(--color-text);
        text-decoration: none;
        height: 100%;
        border-top: 4px solid var(--category-color, var(--color-accent));
      }

      .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        text-decoration: none;
        color: var(--color-text);
        border-color: var(--category-color, var(--color-accent));
      }

      .category-icon {
        font-size: 2.5rem;
        margin-bottom: var(--spacing-md);
      }

      .category-card h2 {
        margin-top: 0;
        margin-bottom: var(--spacing-sm);
        font-size: 1.5rem;
        color: var(--category-color, var(--color-text));
        border-bottom: none;
        padding-bottom: 0;
      }

      .category-card p {
        margin-bottom: 0;
        color: var(--color-text-light);
        font-size: 0.95rem;
      }

      .other-pages {
        margin: var(--spacing-xl) 0;
      }

      .page-links {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--spacing-md);
      }

      .page-link {
        display: flex;
        align-items: center;
        padding: var(--spacing-md);
        background-color: var(--color-background-alt);
        border-radius: var(--border-radius);
        color: var(--color-text);
        text-decoration: none;
        transition: background-color 0.2s;
      }

      .page-link:hover {
        background-color: var(--color-border);
        text-decoration: none;
        color: var(--color-text);
      }

      .page-link-icon {
        font-size: 1.5rem;
        color: var(--color-accent);
        margin-right: var(--spacing-md);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .page-link-content h3 {
        margin: 0;
        font-size: 1.1rem;
      }

      .page-link-content p {
        margin: var(--spacing-xs) 0 0;
        font-size: 0.9rem;
        color: var(--color-text-light);
      }

      @media (max-width: 768px) {
        .categories-grid {
          grid-template-columns: 1fr;
        }

        .page-links {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
