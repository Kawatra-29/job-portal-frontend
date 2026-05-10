import useApi from "../hooks/useApi";
import JobCard from "../components/JobCard";

export default function JobList() {
  const { data, loading, error } = useApi("http://localhost:8080/api/v1/jobs?page=0&size=10");
  const jobs = data?.content || [];
  const totalJobs = data?.totalElements || 0;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "32px 24px",
      }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "32px",
            fontWeight: "800",
            color: "#0f172a",
            margin: "0 0 8px",
            letterSpacing: "-0.5px",
          }}>Latest Jobs</h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
            {loading ? "Loading opportunities..." : jobs.length > 0 ? `${totalJobs} jobs available` : "Explore all open positions"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #e5e7eb",
              }}>
                <div style={{ height: "20px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "12px", width: "60%" }} />
                <div style={{ height: "14px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "20px", width: "35%" }} />
                <div style={{ height: "40px", background: "#f1f5f9", borderRadius: "10px" }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            color: "#dc2626",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚠️</div>
            <p style={{ fontWeight: "600", margin: "0 0 4px" }}>Failed to load jobs</p>
            <p style={{ fontSize: "13px", color: "#ef4444", margin: 0 }}>{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "#94a3b8" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontSize: "18px", fontWeight: "600", color: "#64748b" }}>No jobs found</p>
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}