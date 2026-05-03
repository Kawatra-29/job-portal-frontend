import { useNavigate, Link } from "react-router-dom";

const stats = [
  { icon: "📋", label: "Applications Sent", value: "12", color: "#2563eb" },
  { icon: "👁️", label: "Profile Views", value: "84", color: "#7c3aed" },
  { icon: "💼", label: "Saved Jobs", value: "7", color: "#d97706" },
  { icon: "✅", label: "Interviews Scheduled", value: "3", color: "#16a34a" },
];

const recentApplications = [
  { company: "Amazon", role: "Backend Developer", status: "Under Review", statusColor: "#d97706", statusBg: "#fef9c3" },
  { company: "Flipkart", role: "Java Engineer", status: "Shortlisted", statusColor: "#16a34a", statusBg: "#dcfce7" },
  { company: "TCS", role: "Software Trainee", status: "Applied", statusColor: "#2563eb", statusBg: "#dbeafe" },
  { company: "Infosys", role: "System Engineer", status: "Rejected", statusColor: "#dc2626", statusBg: "#fee2e2" },
];

const recommendedJobs = [
  { title: "Spring Boot Developer", company: "HCL Technologies", location: "Noida", salary: "₹4L–6L", type: "Full Time" },
  { title: "Java Backend Engineer", company: "Wipro", location: "Bangalore", salary: "₹5L–8L", type: "Full Time" },
  { title: "REST API Developer", company: "Paytm", location: "Remote", salary: "₹6L–10L", type: "Remote" },
];

export default function JobSeekerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Job Seeker";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f8fafc" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside style={{
        width: "240px", background: "#0f172a", color: "white",
        display: "flex", flexDirection: "column",
        padding: "24px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link to="/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
            }}>
              <span style={{ color: "white", fontSize: "18px", fontWeight: "800", fontFamily: "'Syne', sans-serif" }}>J</span>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: "800", fontSize: "17px", color: "white" }}>JobPortal</span>
          </Link>
        </div>

        {/* User info */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "800", fontSize: "16px", marginBottom: "10px",
          }}>{initials}</div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "white" }}>{name}</p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>Job Seeker</p>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {[
            { icon: "🏠", label: "Dashboard", active: true },
            { icon: "💼", label: "Browse Jobs", to: "/jobs" },
            { icon: "📋", label: "My Applications" },
            { icon: "🔖", label: "Saved Jobs" },
            { icon: "👤", label: "My Profile", to: "/me" },
          ].map((item) => (
            <div key={item.label}
              onClick={() => item.to && navigate(item.to)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 12px", borderRadius: "10px", marginBottom: "4px",
                cursor: "pointer", transition: "all 0.2s",
                background: item.active ? "rgba(37,99,235,0.2)" : "transparent",
                color: item.active ? "#60a5fa" : "#94a3b8",
                fontSize: "14px", fontWeight: item.active ? "600" : "400",
              }}
              onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "white"; } }}
              onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; } }}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
            color: "#f87171", fontSize: "14px", transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            🚪 Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 4px" }}>Good morning 👋</p>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: "800",
            color: "#0f172a", margin: 0, letterSpacing: "-0.5px",
          }}>Welcome back, {name.split(" ")[0]}!</h1>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px", marginBottom: "32px",
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: "white", border: "1px solid #e5e7eb",
              borderRadius: "16px", padding: "20px", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: `${s.color}15`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "20px", marginBottom: "12px",
              }}>{s.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Recent Applications */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "700",
              color: "#0f172a", margin: "0 0 20px",
            }}>Recent Applications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentApplications.map((app) => (
                <div key={app.company} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px", background: "#f8fafc", borderRadius: "10px",
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>{app.role}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>{app.company}</p>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "100px",
                    background: app.statusBg, color: app.statusColor,
                  }}>{app.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "700",
              color: "#0f172a", margin: "0 0 20px",
            }}>Recommended Jobs</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recommendedJobs.map((job) => (
                <div key={job.title} style={{
                  padding: "14px", border: "1px solid #e5e7eb", borderRadius: "12px",
                  transition: "all 0.2s", cursor: "pointer",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#bfdbfe"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(37,99,235,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>{job.title}</p>
                      <p style={{ margin: "2px 0 4px", fontSize: "12px", color: "#2563eb", fontWeight: "500" }}>{job.company}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>📍 {job.location} · 💰 {job.salary}</p>
                    </div>
                    <span style={{
                      fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "100px",
                      background: "#dbeafe", color: "#1d4ed8",
                    }}>{job.type}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/jobs" style={{
              display: "block", textAlign: "center", marginTop: "16px",
              color: "#2563eb", fontSize: "13px", fontWeight: "600", textDecoration: "none",
            }}>View all jobs →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}