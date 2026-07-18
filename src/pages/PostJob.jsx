import { useNavigate } from "react-router-dom";
import useApi from "../Hooks/useApi";
import { useForm } from "react-hook-form";
import { SidebarLayout } from "../components/SidebarLayout";

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

  const onSubmit = async (data) => {
    const response = await post("/jobs", data);

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
    <SidebarLayout
      navItems={navItems}
      title="Post New Job"
      subtitle="Employer Panel 🏢"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "title is required" })}
                  placeholder="e.g. Senior Java Developer"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-550"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description", { required: "description is required" })}
                  placeholder="Describe the role, team, and what makes this opportunity unique..."
                  rows="4"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-550"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              {/* Requirements & Responsibilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Requirements
                  </label>
                  <textarea
                    {...register("requirements")}
                    placeholder="List skills, qualifications..."
                    rows="3"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-555"
                  />
                  {errors.requirements && <p className="text-red-500 text-sm">{errors.requirements.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Responsibilities
                  </label>
                  <textarea
                    {...register("responsibilities")}
                    placeholder="List key responsibilities..."
                    rows="3"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-555"
                  />
                  {errors.responsibilities && <p className="text-red-500 text-sm">{errors.responsibilities.message}</p>}
                </div>
              </div>

              {/* Job Type & Work Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Job Type</label>
                  <select
                    {...register("jobType")}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    {JOB_TYPES.map((type) => (
                      <option key={type} value={type} className="dark:bg-slate-900">
                        {type.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Work Mode</label>
                  <select
                    {...register("workMode")}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    {WORK_MODES.map((mode) => (
                      <option key={mode} value={mode} className="dark:bg-slate-900">
                        {mode.charAt(0) + mode.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("location", { required: "location is required" })}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-555"
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Min Salary
                  </label>
                  <input
                    {...register("salaryMin", { valueAsNumber: true })}
                    placeholder="500000"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-555"
                  />
                  {errors.salaryMin && <p className="text-red-500 text-sm">{errors.salaryMin.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Max Salary
                  </label>
                  <input
                    {...register("salaryMax", { valueAsNumber: true })}
                    placeholder="1000000"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-555"
                  />
                  {errors.salaryMax && <p className="text-red-500 text-sm">{errors.salaryMax.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
                  <select
                    {...register("currency")}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="INR" className="dark:bg-slate-900">INR</option>
                    <option value="USD" className="dark:bg-slate-900">USD</option>
                    <option value="EUR" className="dark:bg-slate-900">EUR</option>
                  </select>
                  {errors.currency && <p className="text-red-500 text-sm">{errors.currency.message}</p>}
                </div>
              </div>

              {/* Experience Level & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    {...register("experienceLevel")}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level} className="dark:bg-slate-900">
                        {level.charAt(0) + level.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.experienceLevel && <p className="text-red-500 text-sm">{errors.experienceLevel.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Application Deadline
                  </label>
                  <input
                    {...register("deadline")}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-555"
                  />
                  {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/employer")}
                  className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-750 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer bg-transparent"
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
      </SidebarLayout>
  );
}