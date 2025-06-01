import GlobalLayout from "../components/GlobalLayout";
import { AdManager } from "../components/AdManager";
import styles from "./page.module.css";

export const metadata = {
  title:
    "About Us - Insights Blog | Professional Business Analysis & Tech Insights",
  description:
    "Learn about Insights Blog's mission to provide expert analysis on AI technology, sustainable business practices, emerging markets, and investment strategies.",
  keywords:
    "about insights blog, business analysis team, tech insights experts, AI technology analysis",
  openGraph: {
    title:
      "About Insights Blog - Your Trusted Source for Business Intelligence",
    description:
      "Professional analysis team providing expert insights on AI technology and emerging markets.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <GlobalLayout>
      <div className={styles.aboutPage}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <h1 className={styles.mainTitle}>About Insights Blog</h1>
            <p className={styles.subtitle}>
              Your trusted source for professional business analysis, AI
              technology insights, and emerging market intelligence
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className={styles.missionSection}>
          <div className={styles.container}>
            <div className={styles.contentGrid}>
              <div className={styles.missionCard}>
                <h2 className={styles.sectionTitle}>Our Mission</h2>
                <p className={styles.sectionContent}>
                  To democratize access to high-quality business intelligence
                  and technology insights, empowering individuals and
                  organizations to make informed decisions in our rapidly
                  evolving global economy.
                </p>
                <ul className={styles.featureList}>
                  <li>Provide actionable business analysis</li>
                  <li>Decode complex AI and technology trends</li>
                  <li>Identify emerging market opportunities</li>
                  <li>Deliver evidence-based investment insights</li>
                </ul>
              </div>

              <div className={styles.visionCard}>
                <h2 className={styles.sectionTitle}>Our Vision</h2>
                <p className={styles.sectionContent}>
                  To become the leading platform for business professionals
                  seeking reliable, cutting-edge analysis of technology,
                  markets, and economic trends.
                </p>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>50K+</span>
                    <span className={styles.statLabel}>Monthly Readers</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>500+</span>
                    <span className={styles.statLabel}>Research Articles</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>95%</span>
                    <span className={styles.statLabel}>Accuracy Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mid-page Ad */}
        <section className={styles.adSection}>
          <div className={styles.container}>
            <AdManager
              adType="native"
              position="middle"
              size="large"
              className="about-mid-ad"
            />
          </div>
        </section>

        {/* Expertise Areas */}
        <section className={styles.expertiseSection}>
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.centered}`}>
              Our Areas of Expertise
            </h2>
            <div className={styles.expertiseGrid}>
              <div className={styles.expertiseCard}>
                <div className={styles.cardIcon}>🤖</div>
                <h3 className={styles.cardTitle}>AI & Technology</h3>
                <p className={styles.cardDescription}>
                  In-depth analysis of artificial intelligence trends and
                  emerging technologies.
                </p>
              </div>

              <div className={styles.expertiseCard}>
                <div className={styles.cardIcon}>📈</div>
                <h3 className={styles.cardTitle}>Market Analysis</h3>
                <p className={styles.cardDescription}>
                  Comprehensive research on global markets and investment
                  opportunities.
                </p>
              </div>

              <div className={styles.expertiseCard}>
                <div className={styles.cardIcon}>🌱</div>
                <h3 className={styles.cardTitle}>Sustainable Business</h3>
                <p className={styles.cardDescription}>
                  Analysis of sustainability trends and ESG investing
                  strategies.
                </p>
              </div>

              <div className={styles.expertiseCard}>
                <div className={styles.cardIcon}>🌍</div>
                <h3 className={styles.cardTitle}>Global Affairs</h3>
                <p className={styles.cardDescription}>
                  Insights into geopolitical developments and their business
                  impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Ad */}
        <section className={styles.adSection}>
          <div className={styles.container}>
            <AdManager
              adType="native"
              position="bottom"
              size="large"
              className="about-bottom-ad"
            />
          </div>
        </section>

        {/* Contact CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Join Our Community</h2>
              <p className={styles.ctaDescription}>
                Stay ahead with our expert analysis and insights.
              </p>
              <div className={styles.ctaButtons}>
                <a href="/" className={`${styles.ctaButton} ${styles.primary}`}>
                  Explore Articles
                </a>
                <a
                  href="/contact"
                  className={`${styles.ctaButton} ${styles.secondary}`}
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </GlobalLayout>
  );
}
