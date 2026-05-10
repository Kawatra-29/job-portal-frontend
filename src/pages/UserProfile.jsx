import { useState } from "react";

const skillColors = {
  BEGINNER: { bg: "bg-yellow-50", text: "text-amber-700" },
  INTERMEDIATE: { bg: "bg-blue-50", text: "text-blue-700" },
  ADVANCED: { bg: "bg-green-50", text: "text-green-600" },
  EXPERT: { bg: "bg-violet-50", text: "text-violet-600" },
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
    <div className="min-h-screen bg-slate-50 font-['DM_Sans']">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Hero Banner */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-blue-800 px-6 pt-12 pb-20 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0 shadow-xl border-[3px] border-white/15">
              <span className="font-['Syne'] text-3xl font-extrabold text-white">
                {userData.name.split(" ").map(w => w[0]).join("")}
              </span>
            </div>
            <div>
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
                {userData.role}
              </p>
              <h1 className="font-['Syne'] text-3xl font-extrabold text-white mb-1 tracking-tight">
                {userData.name}
              </h1>
              <p className="text-slate-400 text-sm">{userData.headline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="max-w-5xl mx-auto -mt-10 px-6 pb-16 relative">
        
        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
          <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Summary
          </h2>
          <p className="text-slate-600 leading-relaxed text-[15px]">
            {userData.summary}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mb-5">
          {infoCards.map((card) => (
            <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xl w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  {card.icon}
                </span>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  {card.label}
                </p>
              </div>
              <p className="text-slate-900 font-semibold text-sm">
                {card.value || "Not provided"}
              </p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {userData.skills.map((skill) => {
              const color = skillColors[skill.proficiencyLevel] || skillColors.BEGINNER;
              return (
                <div
                  key={skill.skillName}
                  className={`flex items-center gap-2 ${color.bg} border rounded-lg px-3.5 py-2`}
                >
                  <span className="font-semibold text-sm text-slate-900">
                    {skill.skillName}
                  </span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wide ${color.text}`}>
                    {skill.proficiencyLevel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
