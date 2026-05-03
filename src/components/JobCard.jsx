import { useState } from "react";
import useApi from "../Hooks/useApi";

const jobTypeColors = {
  FULL_TIME: { bg: "#dcfce7", text: "#16a34a" },
  PART_TIME: { bg: "#fef9c3", text: "#b45309" },
  REMOTE: { bg: "#ede9fe", text: "#7c3aed" },
  INTERNSHIP: { bg: "#dbeafe", text: "#1d4ed8" },
  CONTRACT: { bg: "#fee2e2", text: "#dc2626" },
};

function JobCard({ job }) {
  const [applied, setApplied] = useState(false);
  const { post, loading } = useApi();

  const apply = async (e) => {
    e.preventDefault();
    if (!job?.id) return;
    const url = `http://localhost:8080/api/v1/applications/${job.id}/apply`;
    const res = await post(url);
    if (res) setApplied(true);
  };

  const typeStyle = jobTypeColors[job.jobType] || { bg: "#f1f5f9", text: "#475569" };

  return (
    <div style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "16px",
      transition: "all 0.25s",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.1)";
      e.currentTarget.style.borderColor = "#bfdbfe";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#e5e7eb";
      e.currentTarget.style.transform = "translateY(0)";
    }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "18px",
            fontWeight: "700",
            color: "#0f172a",
            margin: "0 0 4px",
          }}>{job.title}</h3>
          <p style={{ color: "#2563eb", fontWeight: "600", fontSize: "14px", margin: 0 }}>{job.company}</p>
        </div>
        <span style={{
          background: typeStyle.bg,
          color: typeStyle.text,
          fontSize: "12px",
          fontWeight: "600",
          padding: "4px 12px",
          borderRadius: "100px",
          whiteSpace: "nowrap",
          marginLeft: "12px",
        }}>
          {job.jobType?.replace("_", " ") || "Full Time"}
        </span>
      </div>

      {/* Details */}
      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "20px",
        paddingTop: "12px",
        borderTop: "1px solid #f1f5f9",
      }}>
        {[
          { icon: "📍", value: job.location },
          { icon: "💰", value: `₹${job.salaryMin?.toLocaleString()} – ₹${job.salaryMax?.toLocaleString()}` },
          { icon: "🎯", value: job.experienceLevel },
        ].map(({ icon, value }) => (
          <span key={icon} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "13px" }}>
            <span>{icon}</span> {value || "N/A"}
          </span>
        ))}
      </div>

      {/* Apply Button */}
      <button
        onClick={apply}
        disabled={loading || applied}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          fontSize: "14px",
          fontWeight: "600",
          cursor: applied ? "default" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.2s",
          background: applied
            ? "linear-gradient(135deg, #16a34a, #15803d)"
            : loading
            ? "#93c5fd"
            : "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "white",
          boxShadow: applied ? "0 2px 8px rgba(22,163,74,0.3)" : "0 2px 8px rgba(37,99,235,0.3)",
        }}
      >
        {applied ? "✓ Applied Successfully!" : loading ? "Applying..." : "View Details & Apply"}
      </button>
    </div>
  );
}

export default JobCard;