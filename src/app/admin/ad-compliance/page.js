"use client";

import { useState, useEffect } from "react";
import GlobalLayout from "../../components/GlobalLayout";

export default function AdCompliancePage() {
  const [violations, setViolations] = useState([]);
  const [stats, setStats] = useState({
    totalAds: 0,
    blockedAds: 0,
    complianceRate: 100,
  });

  useEffect(() => {
    // 模拟加载违规数据
    const mockViolations = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        adContainer: "container-700ea3e86e07b32845dc284c7138afa9",
        violationType: "gambling",
        content: "Online Casino Accepts: BTC, USDT",
        status: "blocked",
        severity: "high",
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        adContainer: "container-700ea3e86e07b32845dc284c7138afa9",
        violationType: "adult_dating",
        content: "Beautiful girls looking for a date",
        status: "blocked",
        severity: "high",
      },
    ];

    setViolations(mockViolations);
    setStats({
      totalAds: 150,
      blockedAds: mockViolations.length,
      complianceRate: (((150 - mockViolations.length) / 150) * 100).toFixed(1),
    });
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#dc3545";
      case "medium":
        return "#fd7e14";
      case "low":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  const getViolationTypeLabel = (type) => {
    switch (type) {
      case "gambling":
        return "🎰 赌博内容";
      case "adult_dating":
        return "💋 成人约会";
      case "illegal_streaming":
        return "📺 非法流媒体";
      default:
        return "⚠️ 其他违规";
    }
  };

  return (
    <GlobalLayout>
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "2rem", color: "#dc3545" }}>
          🛡️ 广告合规监控中心
        </h1>

        {/* 统计卡片 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>
              总广告数
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: 0,
                color: "#007bff",
              }}
            >
              {stats.totalAds}
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>
              违规被屏蔽
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: 0,
                color: "#dc3545",
              }}
            >
              {stats.blockedAds}
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>合规率</h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: 0,
                color: "#28a745",
              }}
            >
              {stats.complianceRate}%
            </p>
          </div>
        </div>

        {/* 警告信息 */}
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#856404" }}>
            ⚠️ Google AdSense 合规警告
          </h4>
          <p style={{ margin: 0, color: "#856404" }}>
            检测到违规广告内容。建议立即联系TraverseSeven调整广告过滤设置，避免影响Google
            AdSense账户状态。
          </p>
        </div>

        {/* 违规事件列表 */}
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#f8f9fa",
              padding: "1rem",
              borderBottom: "1px solid #dee2e6",
            }}
          >
            <h3 style={{ margin: 0, color: "#495057" }}>违规事件记录</h3>
          </div>

          <div style={{ padding: "1rem" }}>
            {violations.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#6c757d",
                  margin: "2rem 0",
                }}
              >
                暂无违规事件记录
              </p>
            ) : (
              violations.map((violation) => (
                <div
                  key={violation.id}
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderLeft: `4px solid ${getSeverityColor(
                      violation.severity
                    )}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span
                          style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          {getViolationTypeLabel(violation.violationType)}
                        </span>
                        <span
                          style={{
                            background: getSeverityColor(violation.severity),
                            color: "white",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                          }}
                        >
                          {violation.severity.toUpperCase()}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: "0.5rem 0",
                          fontFamily: "monospace",
                          background: "#f8f9fa",
                          padding: "0.5rem",
                          borderRadius: "4px",
                        }}
                      >
                        "{violation.content}"
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "#6c757d",
                        }}
                      >
                        容器: {violation.adContainer}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          margin: "0 0 0.5rem 0",
                          fontSize: "0.9rem",
                          color: "#6c757d",
                        }}
                      >
                        {new Date(violation.timestamp).toLocaleString("zh-CN")}
                      </p>
                      <span
                        style={{
                          background:
                            violation.status === "blocked"
                              ? "#dc3545"
                              : "#28a745",
                          color: "white",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {violation.status === "blocked" ? "已屏蔽" : "已处理"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 建议行动 */}
        <div
          style={{
            background: "#d1ecf1",
            border: "1px solid #bee5eb",
            borderRadius: "8px",
            padding: "1rem",
            marginTop: "2rem",
          }}
        >
          <h4 style={{ margin: "0 0 1rem 0", color: "#0c5460" }}>
            🔧 推荐解决方案
          </h4>
          <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#0c5460" }}>
            <li>立即联系TraverseSeven客服，要求加强内容过滤</li>
            <li>要求提供"Google AdSense友好"的广告类别设置</li>
            <li>考虑暂时禁用赌博和成人内容类别</li>
            <li>监控广告收益，如有下降及时调整策略</li>
            <li>保持与Google AdSense政策的严格合规</li>
          </ol>
        </div>
      </div>
    </GlobalLayout>
  );
}
