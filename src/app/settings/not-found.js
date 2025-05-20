import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        padding: "100px 20px",
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>
        404 - Page Not Found
      </h1>
      <p style={{ marginBottom: "30px", color: "#666" }}>
        The page you are trying to access does not exist or has been removed.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: "#1a8917",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: "500",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
