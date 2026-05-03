const colors = [
  "#2563eb", "#7c3aed", "#db2777", "#16a34a", "#d97706",
  "#dc2626", "#0891b2", "#9333ea", "#ca8a04", "#0d9488",
];

function CompanyCard({ companies, index = 0 }) {
  const color = colors[index % colors.length];
  const initials = companies.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        padding: "24px",
        transition: "all 0.25s",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "#bfdbfe";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      {/* Logo avatar */}
      <div style={{
        width: "52px",
        height: "52px",
        borderRadius: "12px",
        background: `${color}18`,
        border: `2px solid ${color}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Syne', sans-serif",
        fontWeight: "800",
        fontSize: "18px",
        color: color,
      }}>
        {initials}
      </div>

      <div style={{ flex: 1 }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "15px",
          fontWeight: "700",
          color: "#0f172a",
          margin: "0 0 6px",
          lineHeight: "1.3",
        }}>
          {companies.name}
        </h2>
        <p style={{
          fontSize: "13px",
          color: "#64748b",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}>
          📍 {companies.location}
        </p>
      </div>

      <button
        style={{
          background: `${color}10`,
          color: color,
          border: `1.5px solid ${color}30`,
          borderRadius: "8px",
          padding: "10px",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.2s",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = color;
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${color}10`;
          e.currentTarget.style.color = color;
        }}
      >
        View Jobs →
      </button>
    </div>
  );
}

export default CompanyCard;