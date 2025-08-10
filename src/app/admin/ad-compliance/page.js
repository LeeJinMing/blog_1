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
        return "🎰 Gambling Content";
      case "adult_dating":
        return "💋 Adult Dating";
      case "illegal_streaming":
        return "📺 Illegal Streaming";
      default:
        return "⚠️ Other Violations";
    }
  };

  return (
    <GlobalLayout>
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "2rem", color: "#dc3545" }}>
          🛡️ Ad Compliance Monitoring Center
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
              Total Ads
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
              Blocked Ads
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
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>
              Compliance Rate
            </h3>
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
            ⚠️ Google AdSense Compliance Warning
          </h4>
          <p style={{ margin: 0, color: "#856404" }}>
            Project has fully switched to Google AdSense Auto Ads, all
            third-party ad platforms have been removed. Please ensure your
            website content continues to meet Google AdSense policy
            requirements.
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
            <h3 style={{ margin: 0, color: "#495057" }}>
              Violation Event Records
            </h3>
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
                No compliance violations recorded
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
                        Container: {violation.adContainer}
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
                        {violation.status === "blocked"
                          ? "Blocked"
                          : "Processed"}
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
            🔧 Google AdSense Optimization Suggestions
          </h4>
          <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#0c5460" }}>
            <li>
              Regularly check Google AdSense console for policy compliance
              status
            </li>
            <li>
              Ensure website content meets Google AdSense content policies
            </li>
            <li>Monitor ad performance and revenue performance</li>
            <li>Optimize page load speed for better ad display</li>
            <li>Maintain strict compliance with Google AdSense policies</li>
          </ol>
        </div>
      </div>
    </GlobalLayout>
  );
}
