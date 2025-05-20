"use client";

import { useState } from "react";
import styles from "./settings.module.css";

export default function ClientSettings() {
  // 设置页面的活动标签状态
  const [activeTab, setActiveTab] = useState("account");

  // 用户信息状态
  const [userInfo, setUserInfo] = useState({
    username: "janedoe",
    email: "jane.doe@example.com",
    bio: "",
  });

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加保存数据的逻辑
    alert("Settings saved!");
  };

  // 切换活动标签
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // 根据活动标签渲染不同的内容
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <>
            <section className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Account Information</h2>

              <div className={styles.formGroup}>
                <div className={styles.profileSection}>
                  <div className={styles.profileImageContainer}>
                    <div className={styles.profileImage}>
                      <span>JD</span>
                    </div>
                    <button className={styles.changeImageButton}>Change</button>
                  </div>
                  <div className={styles.profileInfo}>
                    <h3 className={styles.userName}>Jane Doe</h3>
                    <p className={styles.userEmail}>{userInfo.email}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Username</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    name="username"
                    value={userInfo.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                  />
                  <p className={styles.formHelper}>
                    This username will be displayed in your profile page URL:
                    insights.blog.com/@username
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Bio</label>
                  <textarea
                    className={styles.formTextarea}
                    name="bio"
                    value={userInfo.bio}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Briefly introduce yourself"
                  ></textarea>
                  <p className={styles.formHelper}>
                    Your bio will be displayed in your profile and article
                    bylines
                  </p>
                </div>

                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
              </form>
            </section>

            <section className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Login & Security</h2>

              <div className={styles.cardOption}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Change Password</h3>
                  <p className={styles.cardDescription}>
                    Regularly changing your password improves your account
                    security
                  </p>
                </div>
                <button className={styles.actionButton}>Change</button>
              </div>

              <div className={styles.cardOption}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    Two-Factor Authentication
                  </h3>
                  <p className={styles.cardDescription}>
                    Add an extra layer of security by using verification codes
                  </p>
                </div>
                <button className={styles.actionButton}>Enable</button>
              </div>

              <div className={styles.cardOption}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Logged-in Devices</h3>
                  <p className={styles.cardDescription}>
                    Manage devices currently logged into your account
                  </p>
                </div>
                <button className={styles.actionButton}>View</button>
              </div>
            </section>
          </>
        );

      case "membership":
        return (
          <section className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>Membership & Payments</h2>

            <div className={styles.membershipInfo}>
              <div className={styles.currentPlan}>
                <h3 className={styles.planTitle}>Current Membership Plan</h3>
                <div className={styles.planCard}>
                  <div className={styles.planHeader}>
                    <h4>Free Plan</h4>
                    <p>Basic features access</p>
                  </div>
                  <button className={styles.upgradeButton}>
                    Upgrade to Premium
                  </button>
                </div>
              </div>

              <div className={styles.memberBenefits}>
                <h3 className={styles.benefitsTitle}>Premium Benefits</h3>
                <ul className={styles.benefitsList}>
                  <li>Unlimited reading of all articles</li>
                  <li>Save unlimited articles for offline reading</li>
                  <li>Support quality content creation</li>
                  <li>Ad-free reading experience</li>
                </ul>
              </div>
            </div>
          </section>
        );

      case "preferences":
        return (
          <section className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>Reading Preferences</h2>

            <div className={styles.preferenceGroup}>
              <h3 className={styles.preferenceTitle}>Display Settings</h3>

              <div className={styles.preferenceOption}>
                <div className={styles.optionLabel}>
                  <span>Dark Mode</span>
                </div>
                <div className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    id="darkMode"
                    className={styles.toggleInput}
                  />
                  <label
                    htmlFor="darkMode"
                    className={styles.toggleLabel}
                  ></label>
                </div>
              </div>

              <div className={styles.preferenceOption}>
                <div className={styles.optionLabel}>
                  <span>Font Size</span>
                </div>
                <div className={styles.fontSizeOptions}>
                  <button className={styles.fontSizeButton}>Small</button>
                  <button
                    className={`${styles.fontSizeButton} ${styles.active}`}
                  >
                    Medium
                  </button>
                  <button className={styles.fontSizeButton}>Large</button>
                </div>
              </div>
            </div>

            <div className={styles.preferenceGroup}>
              <h3 className={styles.preferenceTitle}>Content Preferences</h3>

              <div className={styles.tagSelection}>
                <p className={styles.tagHelper}>
                  Select topics you're interested in for personalized
                  recommendations
                </p>
                <div className={styles.tagContainer}>
                  <span className={`${styles.tag} ${styles.selected}`}>
                    Technology
                  </span>
                  <span className={styles.tag}>Business</span>
                  <span className={`${styles.tag} ${styles.selected}`}>
                    Science
                  </span>
                  <span className={styles.tag}>Politics</span>
                  <span className={styles.tag}>Health</span>
                  <span className={`${styles.tag} ${styles.selected}`}>
                    Culture
                  </span>
                  <span className={styles.tag}>Sports</span>
                  <span className={styles.tag}>Arts</span>
                </div>
              </div>
            </div>

            <button className={styles.saveButton}>Save Preferences</button>
          </section>
        );

      default:
        return (
          <div className={styles.placeholderSection}>
            <h2 className={styles.sectionTitle}>{activeTab}</h2>
            <p>This feature is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h1 className={styles.settingsTitle}>Settings</h1>
        <p className={styles.settingsDescription}>
          Manage your account, subscriptions, and reading preferences
        </p>
      </div>

      <div className={styles.settingsSections}>
        <div className={styles.sideNav}>
          <ul className={styles.navList}>
            <li
              className={`${styles.navItem} ${
                activeTab === "account" ? styles.active : ""
              }`}
            >
              <button
                className={styles.navButton}
                onClick={() => handleTabChange("account")}
              >
                Account
              </button>
            </li>
            <li
              className={`${styles.navItem} ${
                activeTab === "membership" ? styles.active : ""
              }`}
            >
              <button
                className={styles.navButton}
                onClick={() => handleTabChange("membership")}
              >
                Membership & Payments
              </button>
            </li>
            <li
              className={`${styles.navItem} ${
                activeTab === "preferences" ? styles.active : ""
              }`}
            >
              <button
                className={styles.navButton}
                onClick={() => handleTabChange("preferences")}
              >
                Reading Preferences
              </button>
            </li>
            <li
              className={`${styles.navItem} ${
                activeTab === "notifications" ? styles.active : ""
              }`}
            >
              <button
                className={styles.navButton}
                onClick={() => handleTabChange("notifications")}
              >
                Notifications
              </button>
            </li>
            <li
              className={`${styles.navItem} ${
                activeTab === "privacy" ? styles.active : ""
              }`}
            >
              <button
                className={styles.navButton}
                onClick={() => handleTabChange("privacy")}
              >
                Privacy & Security
              </button>
            </li>
            <li
              className={`${styles.navItem} ${
                activeTab === "connections" ? styles.active : ""
              }`}
            >
              <button
                className={styles.navButton}
                onClick={() => handleTabChange("connections")}
              >
                Connected Accounts
              </button>
            </li>
          </ul>
        </div>

        <div className={styles.settingsContent}>{renderContent()}</div>
      </div>
    </div>
  );
}
