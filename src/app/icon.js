import { ImageResponse } from "next/og";

// 图标大小
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// 图标生成器
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
