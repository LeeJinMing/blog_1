import Link from "next/link";
import { FaTag, FaNewspaper, FaChartLine } from "react-icons/fa";
import GlobalLayout from "../components/GlobalLayout";

// Predefined categories
const categories = [
  {
    slug: "politics-diplomacy",
    name: "Politics & Diplomacy",
    description:
      "In-depth analysis of domestic politics and international diplomatic relations",
    icon: "🏛️",
    color: "#4a6da7",
  },
  {
    slug: "business-economy",
    name: "Business & Economy",
    description:
      "Curated content on business trends, economic analysis, and market dynamics",
    icon: "💹",
    color: "#4caf50",
  },
  {
    slug: "tech-innovation",
    name: "Technology & Innovation",
    description:
      "Exploring the latest technology trends, innovation developments, and digital transformation",
    icon: "🚀",
    color: "#2196f3",
  },
  {
    slug: "international-relations",
    name: "International Relations",
    description:
      "Focus on global geopolitics, international organizations, and transnational cooperation",
    icon: "🌍",
    color: "#1a237e",
  },
  {
    slug: "culture-society",
    name: "Culture & Society",
    description:
      "Fascinating content on social phenomena, cultural changes, and humanistic thinking",
    icon: "🎭",
    color: "#9c27b0",
  },
];

export const metadata = {
  title: "Article Categories | Insights Blog",
  description:
    "Browse our article categories and discover content that interests you",
};

// Set 1 week cache time
export const revalidate = 604800;

export default function CategoriesPage() {
  return (
    <GlobalLayout>
      <section className="hero">
        <h1>Article Categories</h1>
        <p className="subtitle">
          Browse our article categories and discover content that interests you
        </p>
      </section>

      <div className="categories-container">
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.slug}
              className="category-card"
              style={{
                "--category-color": category.color,
              }}
            >
              <div className="category-icon">{category.icon}</div>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>

        {/* Middle ad */}
        <div className="mid-content-ad">
          {/* ClientAdPlaceholder removed */}
        </div>

        <div className="other-pages">
          <div className="page-links">
            <Link href="/" className="page-link">
              <div className="page-link-icon">
                <FaNewspaper />
              </div>
              <div className="page-link-content">
                <h3>Latest Articles</h3>
                <p>Check out our most recently published content</p>
              </div>
            </Link>

            <Link href="/" className="page-link">
              <div className="page-link-icon">
                <FaTag />
              </div>
              <div className="page-link-content">
                <h3>Popular Tags</h3>
                <p>Browse popular tags and content on the home page</p>
              </div>
            </Link>

            <Link href="/archives" className="page-link">
              <div className="page-link-icon">
                <FaChartLine />
              </div>
              <div className="page-link-content">
                <h3>Article Archives</h3>
                <p>Browse historical articles by timeline</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Include client-side style component */}
      {/* CategoryStyles removed */}
    </GlobalLayout>
  );
}
