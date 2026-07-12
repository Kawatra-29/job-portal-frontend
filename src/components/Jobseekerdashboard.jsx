import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import useApi from "../Hooks/useApi";
import UserProfile from "../pages/UserProfile";
import JobList from "../pages/JobList";

const stats = [
  { icon: "📋", label: "Applications Sent", value: "12", color: "blue" },
  { icon: "👁️", label: "Profile Views", value: "84", color: "violet" },
  { icon: "💼", label: "Saved Jobs", value: "7", color: "amber" },
  { icon: "✅", label: "Interviews Scheduled", value: "3", color: "green" },
];

const recentApplications = [
  { company: "Amazon", role: "Backend Developer", status: "Under Review", statusColor: "text-amber-600", statusBg: "bg-amber-50" },
  { company: "Flipkart", role: "Java Engineer", status: "Shortlisted", statusColor: "text-green-600", statusBg: "bg-green-50" },
  { company: "TCS", role: "Software Trainee", status: "Applied", statusColor: "text-blue-600", statusBg: "bg-blue-50" },
  { company: "Infosys", role: "System Engineer", status: "Rejected", statusColor: "text-red-600", statusBg: "bg-red-50" },
];

const recommendedJobs = [
  { title: "Spring Boot Developer", company: "HCL Technologies", location: "Noida", salary: "₹4L–6L", type: "Full Time" },
  { title: "Java Backend Engineer", company: "Wipro", location: "Bangalore", salary: "₹5L–8L", type: "Full Time" },
  { title: "REST API Developer", company: "Paytm", location: "Remote", salary: "₹6L–10L", type: "Remote" },
];

export default function JobSeekerDashboard() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const { data: profile, loading, error } = useApi("http://localhost:8080/api/v1/jobseekers/me");

  const user = profile?.user;
  const name = user?.fname || localStorage.getItem("name") || "Job Seeker";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-['DM_Sans']">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col py-6 shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 pb-7 border-b border-white/10">
          <Link to="/home" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
              <span className="text-white text-lg font-bold font-['Syne']">J</span>
            </div>
            <span className="font-['Syne'] font-extrabold text-lg text-white">JobPortal</span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-6 py-5 border-b border-white/10">
          {user ? (
            <>
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-500 to-violet-500 flex items-center justify-center font-extrabold text-base mb-2.5">
                {user.fname.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-semibold text-white m-0">{user.fname}</p>
              <p className="text-xs text-slate-400 mt-0.5 m-0">{user.email}</p>
            </>
          ) : (
            <div className="animate-pulse">
              <div className="w-11 h-11 rounded-full bg-slate-700 mb-2.5" />
              <div className="h-4 bg-slate-700 rounded w-24 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-32" />
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="p-4 flex-1">
          {[
            { icon: "🏠", label: "Dashboard", active: !showProfile && !showJobs, onClick: () => { setShowProfile(false); setShowJobs(false); } },
            { icon: "💼", label: "Browse Jobs", onClick: () => { setShowProfile(false); setShowJobs(true); } },
            { icon: "📋", label: "My Applications" },
            { icon: "🔖", label: "Saved Jobs" },
            { icon: "👤", label: "My Profile", onClick: () => { setShowProfile(true); setShowJobs(false); } },
          ].map((item) => (
            <div key={item.label}
              onClick={() => item.to ? navigate(item.to) : item.onClick?.()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 cursor-pointer text-sm transition-all ${
                item.active
                  ? "bg-blue-500/20 text-blue-400 font-semibold"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <div onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-red-400 hover:bg-red-500/10 transition-all">
            🚪 Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {showProfile ? (
          <UserProfile />
        ) : showJobs ? (
          <JobList />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <p className="text-slate-500 text-sm m-0 mb-1">Good morning 👋</p>
              <h1 className="font-['Syne'] text-3xl font-extrabold text-slate-900 m-0 tracking-tight">
                Welcome back, {name.split(" ")[0]}!
              </h1>
            </div>

        {loading && (
          <div className="space-y-4 animate-pulse mb-6">
            <div className="h-40 bg-slate-200 rounded-2xl" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
            Failed to load profile: {error}
          </div>
        )}

        {/* Profile Section */}
        {profile && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-violet-500 flex items-center justify-center font-extrabold text-3xl text-white shrink-0">
                {user?.fname?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h2 className="font-['Syne'] text-xl font-extrabold text-slate-900 m-0">{user?.fname}</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {profile.headline || "Add headline"}
                      {profile.location && ` • 📍 ${profile.location}`}
                    </p>
                  </div>
                  <div className="text-right">
                    {profile.expectedSalary && (
                      <p className="text-lg font-bold text-slate-900">₹{profile.expectedSalary}L</p>
                    )}
                    <p className="text-xs text-slate-500">Expected Salary</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-3 text-sm text-slate-600">
                  <span>📧 {user?.email}</span>
                  {user?.phone && <span>📱 {user.phone}</span>}
                  {profile.yearsOfExperience && <span>💼 {profile.yearsOfExperience} yrs exp</span>}
                  {profile.availability && <span>⏰ {profile.availability}</span>}
                </div>

                {profile.skills?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2">SKILLS</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                          {skill.skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.summary && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-500 mb-1">SUMMARY</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{profile.summary}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
              <div className="font-['Syne'] text-3xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Applications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-base font-bold text-slate-900 m-0 mb-5">Recent Applications</h2>
            <div className="flex flex-col gap-3">
              {recentApplications.map((app) => (
                <div key={app.company} className="flex justify-between items-center px-3 py-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-sm text-slate-900 m-0">{app.role}</p>
                    <p className="text-xs text-slate-500 mt-0.5 m-0">{app.company}</p>
                  </div>
                  <span className={`${app.statusBg} ${app.statusColor} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-base font-bold text-slate-900 m-0 mb-5">Recommended Jobs</h2>
            <div className="flex flex-col gap-3">
              {recommendedJobs.map((job) => (
                <div key={job.title} className="p-4 border border-slate-200 rounded-xl transition-all cursor-pointer hover:border-blue-300 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-slate-900 m-0">{job.title}</p>
                      <p className="text-sm text-blue-600 font-medium mt-0.5 m-0">{job.company}</p>
                      <p className="text-xs text-slate-500 mt-1 m-0">📍 {job.location} · 💰 {job.salary}</p>
                    </div>
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {job.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/jobs" className="block text-center mt-4 text-blue-600 text-sm font-semibold no-underline hover:underline">
              View all jobs →
            </Link>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
