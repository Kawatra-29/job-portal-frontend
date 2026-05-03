import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      textAlign: "center",
      padding: "24px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      
      <div style={{
        fontSize: "96px",
        fontFamily: "'Syne', sans-serif",
        fontWeight: "800",
        color: "#e5e7eb",
        lineHeight: "1",
        marginBottom: "16px",
        letterSpacing: "-4px",
      }}>404</div>

      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "24px",
        fontWeight: "800",
        color: "#0f172a",
        margin: "0 0 12px",
      }}>Page not found</h1>

      <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "360px", lineHeight: "1.6", margin: "0 0 32px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/home" style={{
        textDecoration: "none",
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "white",
        padding: "12px 28px",
        borderRadius: "10px",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
      }}>
        ← Back to Home
      </Link>
    </div>
  );
};

export default PageNotFound;