import { ImageResponse } from "next/og";

/**
 * 生成Open Graph图像的API端点
 * 使用方式: /api/og?title=文章标题
 */
export async function GET(request) {
  try {
    // 从URL参数中获取标题
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Insights Blog Article";

    // 从URL参数中获取可选的分类参数
    const category = searchParams.get("category") || "";

    // 你可以自定义颜色，这里根据分类选择不同的颜色
    let backgroundColor = "#0066cc"; // 默认颜色
    if (category) {
      const colorMap = {
        "politics-diplomacy": "#4a6da7",
        "business-economy": "#4caf50",
        "tech-innovation": "#2196f3",
        "international-relations": "#1a237e",
        "culture-society": "#9c27b0",
      };

      backgroundColor = colorMap[category] || backgroundColor;
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(to bottom right, ${backgroundColor}, #012a5c)`,
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              padding: "40px",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "1000px",
            }}
          >
            <h1
              style={{
                fontSize: 60,
                fontWeight: "bold",
                marginBottom: 20,
              }}
            >
              {title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <h2 style={{ fontSize: 30, fontWeight: "normal" }}>
                Insights Blog
              </h2>
              {category && (
                <div
                  style={{
                    backgroundColor: "white",
                    color: backgroundColor,
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: 24,
                    marginLeft: 20,
                  }}
                >
                  {category.replace("-", " ")}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}

export const runtime = "edge";
