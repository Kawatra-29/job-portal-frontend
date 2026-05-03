import { useState } from "react";

const skillColors = {
  BEGINNER: { bg: "#fef9c3", text: "#b45309" },
  INTERMEDIATE: { bg: "#dbeafe", text: "#1d4ed8" },
  ADVANCED: { bg: "#dcfce7", text: "#16a34a" },
  EXPERT: { bg: "#ede9fe", text: "#7c3aed" },
};

export default function UserProfile() {
  const [userData] = useState({
    name: "Saurabh Kawatra",
    email: "saurabhkawatra2001@gmail.com",
    phone: "9876543210",
    role: "JOBSEEKER",
    headline: "Java Backend Developer · Fresher",
    summary: "Passionate backend developer with strong knowledge of Java, Spring Boot, and REST APIs.",
    location: "Delhi, India",
    yearsOfExperience: 2,
    expectedSalary: 400000,
    availability: "Immediate",
    skills: [
      { skillName: "Java", proficiencyLevel: "INTERMEDIATE" },
      { skillName: "Spring Boot", proficiencyLevel: "BEGINNER" },
      { skillName: "REST APIs", proficiencyLevel: "INTERMEDIATE" },
      { skillName: "MySQL", proficiencyLevel: "BEGINNER" },
    ],
  });

  const infoCards = [
    { label: "Email", value: userData.email, icon: "✉️" },
    { label: "Phone", value: userData.phone, icon: "📱" },
    { label: "Location", value: userData.location, icon: "📍" },
    { label: "Experience", value: `${userData.yearsOfExperience} Years`, icon: "💼" },
    { label: "Expected Salary", value: `₹${userData.expectedSalary?.toLocaleString()} / yr`, icon: "💰" },
    { label: "Availability", value: userData.availability, icon: "⚡" },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a, #1e3a5f, #1e40af)",
        padding: "48px 24px 80px",
        position: "relative",
      }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{
              width: "80px", height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Syne', sans-serif",
              fontSize: "32px",
              fontWeight: "800",
              color: "white",
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              border: "3px solid rgba(255,255,255,0.15)",
            }}>
              {userData.name.split(" ").map(w => w[0]).join("")}
            </div>
            <div>
              <p style={{ color: "#93c5fd", fontSize: "12px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>
                {userData.role}
              </p>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "28px",
                fontWeight: "800",
                color: "white",
                margin: "0 0 6px",
                letterSpacing: "-0.5px",
              }}>{userData.name}</h1>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>{userData.headline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div style={{ maxWidth: "860px", margin: "-40px auto 0", padding: "0 24px 60px", position: "relative" }}>
        
        {/* Summary */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          padding: "24px",
          marginBottom: "20px",
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: "700",
            color: "#0f172a", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>Summary</h2>
          <p style={{ color: "#475569", lineHeight: "1.7", margin: 0, fontSize: "15px" }}>{userData.summary}</p>
        </div>

        {/* Info Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}>
          {infoCards.map((card) => (
            <div key={card.label} style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{
                  fontSize: "20px",
                  width: "38px", height: "38px",
                  background: "#eff6ff",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{card.icon}</span>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                  {card.label}
                </p>
              </div>
              <p style={{ color: "#0f172a", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                {card.value || "Not provided"}
              </p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: "700",
            color: "#0f172a", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {userData.skills.map((skill) => {
              const color = skillColors[skill.proficiencyLevel] || skillColors.BEGINNER;
              return (
                <div key={skill.skillName} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: color.bg,
                  border: `1px solid ${color.text}30`,
                  borderRadius: "8px",
                  padding: "8px 14px",
                }}>
                  <span style={{ fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>{skill.skillName}</span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: color.text,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>{skill.proficiencyLevel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}