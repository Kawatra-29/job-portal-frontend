import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useEmployerJobs,
  useUpdateJobStatus,
  useDeleteJob,
} from "../queries/employerQueries";
import { SidebarLayout } from "../components/SidebarLayout";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard/employer" },
  { icon: "📢", label: "Post a Job", path: "/post-job" },
  { icon: "📋", label: "My Job Posts", path: "/my-jobs", active: true },
  { icon: "👥", label: "All Applicants", path: "/all-applicants" },
  { icon: "📅", label: "Interviews", path: "/interviews" },
  { icon: "👤", label: "My Profile", path: "/employer/profile" },
];

const statusBadge = {
  OPEN: "bg-green-50 text-green-600 border-green-250",
  CLOSED: "bg-slate-100 text-slate-500 border-slate-200",
  PAUSED: "bg-amber-50 text-amber-600 border-amber-250",
  FILLED: "bg-blue-50 text-blue-600 border-blue-250",
};

export default function MyJobs() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const size = 10;

  const { data, isLoading, isError, refetch } = useEmployerJobs(page, size);
  const { mutate: updateStatus } = useUpdateJobStatus();
  const { mutate: deleteJob } = useDeleteJob();

  const allJobs = Array.isArray(data) ? data : (data?.content || []);
  const totalElements = allJobs.length;
  const totalPages = Math.ceil(totalElements / size);
  const jobs = allJobs.slice(page * size, (page + 1) * size);

  const handleStatusChange = (jobId, newStatus) => {
    updateStatus(
      { id: jobId, status: newStatus },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleDelete = (jobId, title) => {
    if (window.confirm(`Are you sure you want to delete the job post "${title}"?`)) {
      deleteJob(jobId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  return (
    <SidebarLayout
      navItems={navItems}
      title="My Job Posts"
      subtitle="Employer Panel 📋"
      actions={
        <button
          onClick={() => navigate("/post-job")}
          className="bg-linear-to-br from-violet-600 to-violet-800 text-white border-none rounded-xl px-5 py-3 text-sm font-bold cursor-pointer shadow-lg shadow-violet-500/35 font-['DM_Sans'] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/50"
        >
          + Post New Job
        </button>
      }
    >
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Main list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse flex flex-col gap-4 transition-colors duration-200">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-28" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-2xl text-center">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="font-semibold">Failed to load jobs. Please try again.</p>
            <button onClick={() => refetch()} className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all">
              Retry
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-16 text-center text-slate-400 shadow-sm transition-colors duration-200">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-lg font-semibold text-slate-655 text-slate-600 dark:text-slate-300">No job posts yet</p>
            <p className="text-sm text-slate-455 text-slate-400 dark:text-slate-500 mt-1">Get started by creating your first job posting.</p>
            <button
              onClick={() => navigate("/post-job")}
              className="mt-5 px-5 py-2.5 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-none"
            >
              Post a Job Now
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => {
                const badgeCls = statusBadge[job.status] || "bg-slate-100 text-slate-500";
                const deadlineStr = job.deadline
                  ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : null;
                const isUrgent = job.deadline && new Date(job.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000;

                return (
                  <div key={job.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-colors duration-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white m-0">{job.title}</h3>
                        {isUrgent && (
                          <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900/30">URGENT</span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeCls}`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold m-0">
                        📍 {job.location || "Remote"} &nbsp;·&nbsp; {job.jobType?.replace("_", " ")} &nbsp;·&nbsp; {job.workMode}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {deadlineStr && <span>⏰ Deadline: {deadlineStr}</span>}
                        <span>ID: #{job.id}</span>
                        {job.experienceLevel && <span>🎯 Exp: {job.experienceLevel.replace("_", " ")}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                      <div className="text-right mr-2">
                        {job.salaryMin && (
                          <p className="font-['Syne'] font-extrabold text-lg text-violet-650 dark:text-violet-400 m-0">
                            ₹{(job.salaryMin / 100000).toFixed(0)}L
                          </p>
                        )}
                        {job.salaryMax && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium m-0">
                            to ₹{(job.salaryMax / 100000).toFixed(0)}L / yr
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2.5">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white cursor-pointer shadow-sm hover:border-slate-300"
                        >
                          <option value="OPEN">Open</option>
                          <option value="CLOSED">Closed</option>
                          <option value="PAUSED">Paused</option>
                          <option value="FILLED">Filled</option>
                        </select>
                        <button
                          onClick={() => handleDelete(job.id, job.title)}
                          className="text-xs text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer font-bold transition-all hover:underline"
                        >
                          🗑️ Delete Post
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-655 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition cursor-pointer ${
                        page === i
                          ? "bg-violet-600 text-white"
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-655 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
 
            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              Showing page {page + 1} of {totalPages} ({totalElements} total job posts)
            </p>
          </>
        )}
      </div>
    </SidebarLayout>
  );
}
