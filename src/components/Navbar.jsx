import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    { to: "/companies", label: "Companies" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const handleDashboard = () => {
    if (role === "EMPLOYER") navigate("/dashboard/EMPLOYER");
    else navigate("/dashboard/jobseeker");
  };

  return (
    <nav style={{
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky",
      top: 0,
      zIndex: 100,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link to="/home" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}>
              <span style={{ color: "white", fontSize: "18px", fontWeight: "800" }}>J</span>
            </div>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: "800",
              fontSize: "20px",
              color: "#0f172a",
              letterSpacing: "-0.5px",
            }}>JobPortal</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: active ? "#2563eb" : "#64748b",
                background: active ? "#eff6ff" : "transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!active) { e.target.style.color = "#1e293b"; e.target.style.background = "#f8fafc"; } }}
              onMouseLeave={e => { if (!active) { e.target.style.color = "#64748b"; e.target.style.background = "transparent"; } }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {token ? (
            <>
              <button onClick={handleDashboard} style={{
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                border: "1.5px solid #d1d5db",
                background: "white",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#374151"; }}
              >
                Dashboard
              </button>
              <button onClick={handleLogout} style={{
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 2px 8px rgba(220,38,38,0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" style={{
                textDecoration: "none",
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                border: "1.5px solid #d1d5db",
                background: "white",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#374151"; }}
              >
                Login
              </Link>
              <Link to="/auth" style={{
                textDecoration: "none",
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.35)"; }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;