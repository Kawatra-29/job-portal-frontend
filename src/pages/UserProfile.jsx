import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../Hooks/useApi";
import { ThemeContext } from "../context/ThemeContext.jsx";

const skillColors = {
  BEGINNER: { bg: "bg-yellow-50 dark:bg-yellow-950/20", text: "text-amber-700 dark:text-amber-400" },
  INTERMEDIATE: { bg: "bg-blue-50 dark:bg-blue-950/20", text: "text-blue-700 dark:text-blue-400" },
  ADVANCED: { bg: "bg-green-50 dark:bg-green-950/20", text: "text-green-600 dark:text-green-400" },
  EXPERT: { bg: "bg-violet-50 dark:bg-violet-950/20", text: "text-violet-600 dark:text-violet-400" },
};

const statusStyles = {
  APPLIED: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/20" },
  SHORTLISTED: { color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/20" },
  INTERVIEW: { color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/20" },
  REJECTED: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20" },
  HIRED: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  default: { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/40" }
};

export default function UserProfile() {
  const navigate = useNavigate();
  const { get, del, loading, error } = useApi();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [userData, setUserData] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      const result = await get("/jobseekers/me");
      if (result) {
        setUserData(result);
      }
      const appsResult = await get("/applications/my");
      if (appsResult) {
        setApplications(appsResult);
      }
    };
    fetchUserData();
  }, [get, navigate]);

  const handleWithdraw = async (appId) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      const res = await del(`/applications/${appId}`);
      if (res !== null) {
        const appsResult = await get("/applications/my");
        if (appsResult) {
          setApplications(appsResult);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-['DM_Sans'] flex items-center justify-center">
        <div className="text-slate-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 font-['DM_Sans'] flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 font-['DM_Sans'] flex items-center justify-center">
        <div className="text-slate-500">No data found</div>
      </div>
    );
  }

  const userName = userData.user?.fname || "User";
  const userEmail = userData.user?.email || "Not provided";
  const userPhone = userData.user?.phone || "Not provided";
  const userRole = userData.user?.role || "JOBSEEKER";

  const infoCards = [
    { label: "Email", value: userEmail, icon: "✉️" },
    { label: "Phone", value: userPhone, icon: "📱" },
    { label: "Location", value: userData.location || "Not provided", icon: "📍" },
    { label: "Experience", value: `${userData.yearsOfExperience || 0} Years`, icon: "💼" },
    { label: "Expected Salary", value: userData.expectedSalary ? `₹${userData.expectedSalary.toLocaleString()} / yr` : "Not provided", icon: "💰" },
    { label: "Availability", value: userData.availability || "Not provided", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] transition-colors duration-200">

      {/* Hero Banner */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-blue-800 px-6 pt-12 pb-20 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0 shadow-xl border-[3px] border-white/15">
              <span className="font-['Syne'] text-3xl font-extrabold text-white">
                {userName.split(" ").map(w => w[0]).join("").toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
                {userRole}
              </p>
              <h1 className="font-['Syne'] text-3xl font-extrabold text-white mb-1 tracking-tight">
                {userName}
              </h1>
              <p className="text-slate-400 text-sm">{userData.headline || "Add your headline"}</p>
            </div>
            {/* Action Buttons */}
            <div className="ml-auto flex gap-3 items-center">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer transition-all duration-200"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-amber-350 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => navigate("/me/edit")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="max-w-5xl mx-auto -mt-10 px-6 pb-16 relative">

        {/* Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-5 transition-colors duration-200">
          <h2 className="font-['Syne'] text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Summary
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-[15px]">
            {userData.summary || "Add your summary to tell employers about yourself"}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mb-5">
          {infoCards.map((card) => (
            <div key={card.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xl w-10 h-10 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-center justify-center">
                  {card.icon}
                </span>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {card.label}
                </p>
              </div>
              <p className="text-slate-900 dark:text-white font-semibold text-sm">
                {card.value || "Not provided"}
              </p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors duration-200">
          <h2 className="font-['Syne'] text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            Skills
          </h2>
          {userData.skills && userData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {userData.skills.map((skill, index) => {
                const color = skillColors[skill.proficiencyLevel] || skillColors.BEGINNER;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${color.bg} border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2`}
                  >
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-200">
                      {skill.skillName || skill.skill || skill.name}
                    </span>
                    <span className={`text-[11px] font-semibold uppercase tracking-wide ${color.text}`}>
                      {skill.proficiencyLevel || skill.level || "INTERMEDIATE"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No skills added yet</p>
          )}
        </div>

        {/* Application History */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mt-5 transition-colors duration-200">
          <h2 className="font-['Syne'] text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            Application History
          </h2>
          {Array.isArray(applications) && applications.length > 0 ? (
            <div className="flex flex-col gap-3">
              {applications.map((app) => {
                const style = statusStyles[app.status] || statusStyles.default;
                const companyName = app.job?.employer?.companyName || "Unknown Company";
                const formattedDate = app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "N/A";
                return (
                  <div key={app.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-xl gap-3">
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white m-0">{app.job?.title || "Job Title"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 m-0">{companyName} · 📅 Applied on {formattedDate}</p>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className={`${style.bg} ${style.color} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                        {app.status}
                      </span>
                      {app.status !== "HIRED" && app.status !== "REJECTED" && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer hover:underline"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No applications submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}