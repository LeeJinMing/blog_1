// 广告系统配置
export const ADS_CONFIG = {
  // 第三方广告配置 (TraverseSeven)
  THIRD_PARTY: {
    enabled: false, // 🔴 禁用第三方广告
    provider: "TraverseSeven",
    native: {
      scriptUrl:
        "//traverseseven.com/286b7c3c4b411bead9e284ad6036f16b/invoke.js",
      containerId: "container-286b7c3c4b411bead9e284ad6036f16b",
      scriptId: "traverse-seven-native-script",
    },
    popunder: {
      scriptUrl: "//traverseseven.com/POPUNDER_ID/invoke.js",
      containerId: "container-POPUNDER_ID",
      scriptId: "traverse-seven-popunder-script",
    },
  },

  // Google AdSense 配置
  GOOGLE_ADSENSE: {
    enabled: true, // ✅ 启用Google AdSense
    publisherId: "ca-pub-1911238866563211",
    autoAds: true, // 启用自动广告
    units: {
      // 横幅广告单元
      displayBanner: {
        slot: "1234567890", // 需要从AdSense后台获取
        format: "auto" as const,
        responsive: true,
      },
      // 信息流广告
      inFeed: {
        slot: "2345678901", // 需要从AdSense后台获取
        format: "fluid" as const,
        layout: "in-feed" as const,
        layoutKey: "-6t+ed+2i-1n-4w",
      },
      // 文章内广告
      inArticle: {
        slot: "3456789012", // 需要从AdSense后台获取
        format: "fluid" as const,
        layout: "in-article" as const,
      },
      // 多重广告
      multiplex: {
        slot: "4567890123", // 需要从AdSense后台获取
        format: "autorelaxed" as const,
      },
    },
  },

  // 广告位置配置
  POSITIONS: {
    // 主页广告位
    homepage: {
      hero: { enabled: true, type: "google_display" },
      featured: { enabled: true, type: "google_infeed" },
      categories: { enabled: true, type: "google_display" },
      newsletter: { enabled: true, type: "google_display" },
      footer: { enabled: true, type: "google_multiplex" },
    },
    // 文章页广告位
    article: {
      top: { enabled: true, type: "google_display" },
      content: { enabled: true, type: "google_inarticle", count: 3 },
      bottom: { enabled: true, type: "google_display" },
      sidebar: { enabled: true, type: "google_display", count: 2 },
    },
    // 分类页广告位
    category: {
      top: { enabled: true, type: "google_display" },
      middle: { enabled: true, type: "google_infeed" },
      stats: { enabled: true, type: "google_display" },
      bottom: { enabled: true, type: "google_multiplex" },
    },
    // About页广告位
    about: {
      middle: { enabled: true, type: "google_display" },
      bottom: { enabled: true, type: "google_display" },
    },
  },

  // 合规和安全配置
  COMPLIANCE: {
    enabled: true,
    blockedKeywords: [
      // 赌博相关
      "casino",
      "gambling",
      "poker",
      "slots",
      "bet",
      "betting",
      "wagering",
      "roulette",
      "blackjack",
      "lottery",
      "jackpot",
      "spin to win",

      // 成人内容
      "dating",
      "hookup",
      "adult dating",
      "escort",
      "webcam",

      // 加密货币赌博
      "crypto casino",
      "bitcoin gambling",
      "crypto betting",

      // 其他可疑内容
      "get rich quick",
      "miracle cure",
      "enhancement pills",
    ],
    autoBlock: true,
    logEvents: true,
  },

  // 开发环境配置
  DEVELOPMENT: {
    showPlaceholders: true,
    showDebugInfo: true,
    disableThirdParty: true, // 开发环境强制禁用第三方广告
    mockGoogleAds: false, // 是否在开发环境模拟Google广告
  },
};

// 获取当前环境
export const isDevelopment = () => {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("localhost")
  );
};

// 检查广告是否应该显示
export const shouldShowAd = (
  adType: "third_party" | "google_adsense"
): boolean => {
  const isDev = isDevelopment();

  if (adType === "third_party") {
    return (
      ADS_CONFIG.THIRD_PARTY.enabled &&
      (!isDev || !ADS_CONFIG.DEVELOPMENT.disableThirdParty)
    );
  }

  if (adType === "google_adsense") {
    return ADS_CONFIG.GOOGLE_ADSENSE.enabled;
  }

  return false;
};

export default ADS_CONFIG;
