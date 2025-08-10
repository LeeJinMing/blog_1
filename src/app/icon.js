import { ImageResponse } from "next/og";

// 图标配置 - 完全覆盖Next.js默认图标生成
export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

// 图标生成器 - 防止默认SVG图标生成
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          borderRadius: "4px",
        }}
      >
        B
      </div>
    ),
    {
      ...size,
    }
  );
}

// 生成多尺寸图标以完全覆盖默认行为
export function generateMetadata() {
  return {
    icons: {
      icon: [
        { url: "/icon", sizes: "32x32", type: "image/png" },
        { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      ],
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    },
  };
}
