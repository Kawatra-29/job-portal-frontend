import { useNavigate } from "react-router-dom";

const stats = [
  { icon: "📢", label: "Active Job Posts", value: "8", color: "blue" },
  { icon: "👥", label: "Total Applicants", value: "143", color: "violet" },
  { icon: "🎯", label: "Shortlisted", value: "26", color: "green" },
  { icon: "📅", label: "Interviews Today", value: "5", color: "amber" },
];

const recentApplicants = [
  { name: "Saurabh Kawatra", role: "Backend Developer", exp: "2 yrs", status: "Shortlisted", statusColor: "text-green-600", statusBg: "bg-green-50" },
  { name: "Priya Sharma", role: "Java Engineer", exp: "3 yrs", status: "Under Review", statusColor: "text-amber-600", statusBg: "bg-amber-50" },
  { name: "Rahul Verma", role: "Spring Boot Dev", exp: "1 yr", status: "New", statusColor: "text-blue-600", statusBg: "bg-blue-50" },
  { name: "Ankit Gupta", role: "Backend Developer", exp: "4 yrs", status: "Rejected", statusColor: "text-red-600", statusBg: "bg-red-50" },
];

const activeJobs = [
  { title: "Senior Java Developer", applicants: 34, posted: "2 days ago", urgent: true },
  { title: "Spring Boot Engineer", applicants: 21, posted: "5 days ago", urgent: false },
  { title: "Backend Architect", applicants: 12, posted: "1 week ago", urgent: false },
];

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Employer";

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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-linear-to-br from-violet-600 to-violet-800 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/40">
              <span className="text-white text-lg font-bold font-['Syne']">J</span>
            </div>
            <span className="font-['Syne'] font-extrabold text-lg text-white">JobPortal</span>
          </div>
        </div>

        {/* User info */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="w-11 h-11 rounded-full bg-linear-to-br from-violet-600 to-pink-600 flex items-center justify-center font-extrabold text-base mb-2.5">
            {name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <p className="text-sm font-semibold text-white m-0">{name}</p>
          <p className="text-xs text-slate-400 mt-0.5 m-0">Employer</p>
        </div>

        {/* Nav */}
        <nav className="p-4 flex-1">
          {[
            { icon: "🏠", label: "Dashboard", path: "/dashboard/employer", active: true },
            { icon: "📢", label: "Post a Job", path: "/post-job" },
            { icon: "📋", label: "My Job Posts", path: "/my-jobs" },
            { icon: "👥", label: "All Applicants", path: "/all-applicants" },
            { icon: "📅", label: "Interviews", path: "/interviews" },
            { icon: "🏢", label: "Company Profile", path: "/company-profile" },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 cursor-pointer text-sm transition-all ${
                item.active
                  ? "bg-violet-500/20 text-violet-400 font-semibold"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}>
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

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-slate-500 text-sm m-0 mb-1">Employer Panel 🏢</p>
            <h1 className="font-['Syne'] text-3xl font-extrabold text-slate-900 m-0 tracking-tight">
              Welcome, {name.split(" ")[0]}!
            </h1>
          </div>
          <button onClick={() => navigate("/post-job")} className="bg-linear-to-br from-violet-600 to-violet-800 text-white border-none rounded-xl px-5 py-3 text-sm font-bold cursor-pointer shadow-lg shadow-violet-500/35 font-['DM_Sans'] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/50">
            + Post New Job
          </button>
        </div>

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
          {/* Recent Applicants */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-base font-bold text-slate-900 m-0 mb-5">Recent Applicants</h2>
            <div className="flex flex-col gap-3">
              {recentApplicants.map((a) => (
                <div key={a.name} className="flex justify-between items-center px-3 py-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {a.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 m-0">{a.name}</p>
                      <p className="text-xs text-slate-500 m-0">{a.role} · {a.exp}</p>
                    </div>
                  </div>
                  <span className={`${a.statusBg} ${a.statusColor} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Job Posts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-base font-bold text-slate-900 m-0 mb-5">Active Job Posts</h2>
            <div className="flex flex-col gap-3">
              {activeJobs.map((job) => (
                <div key={job.title} className="p-4 border border-slate-200 rounded-xl transition-all cursor-pointer hover:border-violet-300 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-slate-900 m-0">{job.title}</p>
                        {job.urgent && (
                          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 m-0">Posted {job.posted}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-['Syne'] font-extrabold text-2xl text-violet-600 m-0">{job.applicants}</p>
                      <p className="text-xs text-slate-400 m-0">applicants</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/post-job")} className="block w-full mt-4 bg-violet-50 border border-violet-200 text-violet-600 rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer font-['DM_Sans'] hover:bg-violet-100 transition-all">
              + Post Another Job
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
