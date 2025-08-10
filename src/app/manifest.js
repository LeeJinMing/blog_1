export default function manifest() {
  return {
    name: "Technology Insights Blog",
    short_name: "Tech Insights",
    description:
      "Discover cutting-edge analysis on AI technology, sustainable business practices, emerging markets, and investment strategies.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#667eea",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
