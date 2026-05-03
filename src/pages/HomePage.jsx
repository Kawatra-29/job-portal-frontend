import Search from "../components/Search";

const stats = [
  { number: "5L+", label: "Active Jobs" },
  { number: "10K+", label: "Companies" },
  { number: "2M+", label: "Job Seekers" },
  { number: "95%", label: "Placement Rate" },
];

const features = [
  {
    icon: "💼",
    title: "5L+ Jobs",
    desc: "Explore over 5 lakh curated opportunities across all industries and experience levels.",
  },
  {
    icon: "🏢",
    title: "Top Companies",
    desc: "Connect with India's leading companies — from startups to Fortune 500 giants.",
  },
  {
    icon: "⚡",
    title: "Easy Apply",
    desc: "One-click applications with your saved profile. Apply to 10 jobs in under a minute.",
  },
  {
    icon: "🚀",
    title: "Fast Hiring",
    desc: "Get noticed faster with our smart matching algorithm that puts you in front of the right EMPLOYERs.",
  },
];

const HomePage = () => {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)",
        padding: "80px 24px 120px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background circles */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "400px", height: "400px",
          background: "rgba(37,99,235,0.15)",
          borderRadius: "50%", filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "10%",
          width: "300px", height: "300px",
          background: "rgba(99,102,241,0.1)",
          borderRadius: "50%", filter: "blur(50px)",
        }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <span style={{
            display: "inline-block",
            background: "rgba(37,99,235,0.25)",
            border: "1px solid rgba(99,179,237,0.3)",
            color: "#93c5fd",
            padding: "6px 16px",
            borderRadius: "100px",
            fontSize: "13px",
            fontWeight: "500",
            marginBottom: "24px",
            letterSpacing: "0.5px",
          }}>
            🔥 India's Fastest Growing Job Platform
          </span>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: "800",
            color: "white",
            lineHeight: "1.1",
            marginBottom: "20px",
            letterSpacing: "-1.5px",
          }}>
            Find Your{" "}
            <span style={{
              background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Dream Job
            </span>{" "}
            Today
          </h1>
          <p style={{
            fontSize: "18px",
            color: "#94a3b8",
            marginBottom: "48px",
            lineHeight: "1.6",
          }}>
            Over 5 lakh opportunities waiting for you. Connect with top companies and land your perfect role — faster than ever before.
          </p>

          <Search />
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "24px",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          textAlign: "center",
        }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "28px",
                fontWeight: "800",
                color: "#2563eb",
              }}>{s.number}</div>
              <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "36px",
            fontWeight: "800",
            color: "#0f172a",
            letterSpacing: "-0.8px",
            marginBottom: "12px",
          }}>Why Choose Us?</h2>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Everything you need to land your next opportunity, in one place.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "32px 28px",
              transition: "all 0.25s",
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.12)";
              e.currentTarget.style.borderColor = "#bfdbfe";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            >
              <div style={{
                fontSize: "36px",
                marginBottom: "16px",
                width: "60px", height: "60px",
                background: "#eff6ff",
                borderRadius: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "18px",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "10px",
              }}>{f.title}</h3>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: "linear-gradient(135deg, #1e40af, #4f46e5)",
        margin: "0 24px 80px",
        borderRadius: "24px",
        padding: "56px 40px",
        textAlign: "center",
        maxWidth: "1052px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "32px",
          fontWeight: "800",
          color: "white",
          marginBottom: "12px",
          letterSpacing: "-0.5px",
        }}>Ready to get hired?</h2>
        <p style={{ color: "#bfdbfe", marginBottom: "32px", fontSize: "16px" }}>
          Join 2 million+ professionals who found their dream jobs here.
        </p>
        <a href="/auth" style={{
          display: "inline-block",
          background: "white",
          color: "#1e40af",
          padding: "14px 36px",
          borderRadius: "10px",
          fontWeight: "700",
          fontSize: "15px",
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}>
          Create Free Account →
        </a>
      </section>
    </div>
  );
};

export default HomePage;