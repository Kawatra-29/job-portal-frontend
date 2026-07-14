import { useNavigate } from "react-router-dom";
import useApi from "../Hooks/useApi";
import { useForm } from "react-hook-form";

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP", "TEMPORARY"];
const WORK_MODES = ["ONSITE", "REMOTE", "HYBRID"];
const EXPERIENCE_LEVELS = ["INTERN", "ENTRY", "MID_LEVEL", "SENIOR", "LEAD", "EXECUTIVE"];

export default function PostJob() {

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      jobType: "FULL_TIME",
      workMode: "ONSITE",
      currency: "INR",
      experienceLevel: "ENTRY",
    },
  });
  const navigate = useNavigate();
  const { post, loading } = useApi();

  const name = localStorage.getItem("name") || "Employer";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const onSubmit = async (data) => {
    const response = await post("http://localhost:8080/api/v1/jobs", data);

    if (response) {
      navigate("/dashboard/employer");
    }
  };

  const navItems = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard/employer" },
    { icon: "📢", label: "Post a Job", path: "/post-job", active: true },
    { icon: "📋", label: "My Job Posts", path: "/my-jobs" },
    { icon: "👥", label: "All Applicants", path: "/all-applicants" },
    { icon: "📅", label: "Interviews", path: "/interviews" },
    { icon: "👤", label: "My Profile", path: "/employer/profile" },
  ];

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
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 cursor-pointer text-sm transition-all ${item.active
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm m-0 mb-1">Employer Panel 🏢</p>
            <h1 className="font-['Syne'] text-3xl font-extrabold text-slate-900 m-0 tracking-tight">
              Post New Job
            </h1>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "title is required" })}
                  placeholder="e.g. Senior Java Developer"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description", { required: "description is required" })}
                  placeholder="Describe the role, team, and what makes this opportunity unique..."
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              {/* Requirements & Responsibilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Requirements
                  </label>
                  <textarea
                    {...register("requirements")}
                    placeholder="List skills, qualifications..."
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                  />
                  {errors.requirements && <p className="text-red-500 text-sm">{errors.requirements.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Responsibilities
                  </label>
                  <textarea
                    {...register("responsibilities")}
                    placeholder="List key responsibilities..."
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                  />
                  {errors.responsibilities && <p className="text-red-500 text-sm">{errors.responsibilities.message}</p>}
                </div>
              </div>

              {/* Job Type & Work Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Type</label>
                  <select
                    {...register("jobType")}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white"
                  >
                    {JOB_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Mode</label>
                  <select
                    {...register("workMode")}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white"
                  >
                    {WORK_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode.charAt(0) + mode.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("location", { required: "location is required" })}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Min Salary
                  </label>
                  <input
                    {...register("salaryMin", { valueAsNumber: true })}
                    placeholder="500000"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  {errors.salaryMin && <p className="text-red-500 text-sm">{errors.salaryMin.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Max Salary
                  </label>
                  <input
                    {...register("salaryMax", { valueAsNumber: true })}
                    placeholder="1000000"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  {errors.salaryMax && <p className="text-red-500 text-sm">{errors.salaryMax.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Currency</label>
                  <select
                    {...register("currency")}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  {errors.currency && <p className="text-red-500 text-sm">{errors.currency.message}</p>}
                </div>
              </div>

              {/* Experience Level & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    {...register("experienceLevel")}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white"
                  >
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0) + level.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.experienceLevel && <p className="text-red-500 text-sm">{errors.experienceLevel.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Application Deadline
                  </label>
                  <input
                    {...register("deadline")}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/employer")}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-linear-to-br from-violet-600 to-violet-800 text-white border-none rounded-xl px-6 py-3 text-sm font-bold cursor-pointer shadow-lg shadow-violet-500/35 font-['DM_Sans'] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Posting..." : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}