"use client";

import React from "react";

// A simple fallback cover component that generates a colored rectangle with text
export default function FallbackCover({
  title,
  category = "default",
  width = 800,
  height = 400,
}) {
  // Color mapping for different categories
  const colorMap = {
    Politics: "#4a6da7", // Blue
    Economy: "#4caf50", // Green
    Technology: "#2196f3", // Light Blue
    International: "#1a237e", // Dark Blue
    Society: "#9c27b0", // Purple
    default: "#607d8b", // Gray Blue
  };

  // Find matching category or use default
  let backgroundColor = colorMap.default;
  for (const [key, color] of Object.entries(colorMap)) {
    if (category.includes(key) || (title && title.includes(key))) {
      backgroundColor = color;
      break;
    }
  }

  // Generate a fallback style
  const style = {
    width: "100%",
    height: "auto",
    aspectRatio: `${width} / ${height}`,
    backgroundColor,
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "1rem",
    borderRadius: "4px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  // Get a summary of the title if it's too long
  const displayTitle =
    title && title.length > 50
      ? title.substring(0, 50) + "..."
      : title || "Article";

  return (
    <div style={style}>
      <div
        style={{
          fontSize: "calc(1rem + 1vw)",
          fontWeight: "bold",
          marginBottom: "0.5rem",
        }}
      >
        {displayTitle}
      </div>
      <div style={{ fontSize: "calc(0.7rem + 0.5vw)" }}>
        {category !== "default" ? category : "Blog Post"}
      </div>
    </div>
  );
}
