import { useState } from "react";

const Search = () => {
  const [focused, setFocused] = useState(null);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "8px 8px 8px 20px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        width: "100%",
        maxWidth: "640px",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: "18px" }}>🔍</span>
        <input
          type="text"
          placeholder="Job title, skills, or company"
          onFocus={() => setFocused("title")}
          onBlur={() => setFocused(null)}
          style={{
            border: "none",
            outline: "none",
            fontSize: "15px",
            color: "#0f172a",
            fontFamily: "'DM Sans', sans-serif",
            flex: "1",
            minWidth: "140px",
            padding: "10px 0",
            background: "transparent",
          }}
        />
        <div style={{ width: "1px", height: "28px", background: "#e5e7eb" }} />
        <span style={{ fontSize: "16px" }}>📍</span>
        <input
          type="text"
          placeholder="City or remote"
          onFocus={() => setFocused("location")}
          onBlur={() => setFocused(null)}
          style={{
            border: "none",
            outline: "none",
            fontSize: "15px",
            color: "#0f172a",
            fontFamily: "'DM Sans', sans-serif",
            flex: "1",
            minWidth: "120px",
            padding: "10px 0",
            background: "transparent",
          }}
        />
        <button
          type="submit"
          style={{
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px 28px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          Search Jobs
        </button>
      </div>
    </div>
  );
};

export default Search;