import { useNavigate, Link } from "react-router-dom";

const stats = [
  { icon: "📢", label: "Active Job Posts", value: "8", color: "#2563eb" },
  { icon: "👥", label: "Total Applicants", value: "143", color: "#7c3aed" },
  { icon: "🎯", label: "Shortlisted", value: "26", color: "#16a34a" },
  { icon: "📅", label: "Interviews Today", value: "5", color: "#d97706" },
];

const recentApplicants = [
  { name: "Saurabh Kawatra", role: "Backend Developer", exp: "2 yrs", status: "Shortlisted", statusColor: "#16a34a", statusBg: "#dcfce7" },
  { name: "Priya Sharma", role: "Java Engineer", exp: "3 yrs", status: "Under Review", statusColor: "#d97706", statusBg: "#fef9c3" },
  { name: "Rahul Verma", role: "Spring Boot Dev", exp: "1 yr", status: "New", statusColor: "#2563eb", statusBg: "#dbeafe" },
  { name: "Ankit Gupta", role: "Backend Developer", exp: "4 yrs", status: "Rejected", statusColor: "#dc2626", statusBg: "#fee2e2" },
];

const activeJobs = [
  { title: "Senior Java Developer", applicants: 34, posted: "2 days ago", urgent: true },
  { title: "Spring Boot Engineer", applicants: 21, posted: "5 days ago", urgent: false },
  { title: "Backend Architect", applicants: 12, posted: "1 week ago", urgent: false },
];

export default function EMPLOYERDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "EMPLOYER";
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
            }}>
              <span style={{ color: "white", fontSize: "18px", fontWeight: "800", fontFamily: "'Syne', sans-serif" }}>J</span>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: "800", fontSize: "17px" }}>JobPortal</span>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #db2777)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "800", fontSize: "16px", marginBottom: "10px",
          }}>{initials}</div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "white" }}>{name}</p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>EMPLOYER</p>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {[
            { icon: "🏠", label: "Dashboard", active: true },
            { icon: "📢", label: "Post a Job" },
            { icon: "📋", label: "My Job Posts" },
            { icon: "👥", label: "All Applicants" },
            { icon: "📅", label: "Interviews" },
            { icon: "🏢", label: "Company Profile" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "10px", marginBottom: "4px",
              cursor: "pointer", transition: "all 0.2s",
              background: item.active ? "rgba(124,58,237,0.2)" : "transparent",
              color: item.active ? "#c4b5fd" : "#94a3b8",
              fontSize: "14px", fontWeight: item.active ? "600" : "400",
            }}
            onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "white"; }}}
            onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}}
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

      {/* Main */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 4px" }}>EMPLOYER Panel 🏢</p>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: "800",
              color: "#0f172a", margin: 0, letterSpacing: "-0.5px",
            }}>Welcome, {name.split(" ")[0]}!</h1>
          </div>
          <button style={{
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color: "white", border: "none", borderRadius: "10px",
            padding: "12px 22px", fontSize: "14px", fontWeight: "700",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,58,237,0.35)"; }}
          >
            + Post New Job
          </button>
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
          {/* Recent Applicants */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "700",
              color: "#0f172a", margin: "0 0 20px",
            }}>Recent Applicants</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentApplicants.map((a) => (
                <div key={a.name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px", background: "#f8fafc", borderRadius: "10px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: "13px", fontWeight: "700", flexShrink: 0,
                    }}>
                      {a.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", fontSize: "13px", color: "#0f172a" }}>{a.name}</p>
                      <p style={{ margin: "1px 0 0", fontSize: "11px", color: "#64748b" }}>{a.role} · {a.exp}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "100px",
                    background: a.statusBg, color: a.statusColor, whiteSpace: "nowrap",
                  }}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Job Posts */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "700",
              color: "#0f172a", margin: "0 0 20px",
            }}>Active Job Posts</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeJobs.map((job) => (
                <div key={job.title} style={{
                  padding: "16px", border: "1px solid #e5e7eb", borderRadius: "12px",
                  transition: "all 0.2s", cursor: "pointer",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c4b5fd"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(124,58,237,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>{job.title}</p>
                        {job.urgent && (
                          <span style={{
                            fontSize: "10px", fontWeight: "700", padding: "2px 6px",
                            borderRadius: "4px", background: "#fee2e2", color: "#dc2626",
                          }}>URGENT</span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Posted {job.posted}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: "800", fontSize: "20px", color: "#7c3aed" }}>{job.applicants}</p>
                      <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>applicants</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{
              display: "block", width: "100%", marginTop: "16px",
              background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.2)",
              color: "#7c3aed", borderRadius: "10px", padding: "10px",
              fontSize: "13px", fontWeight: "600", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              + Post Another Job
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}