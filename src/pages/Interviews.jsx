import { useState } from "react";
import {
  useInterviews,
  useUpdateApplicationStatus,
} from "../queries/employerQueries";
import { SidebarLayout } from "../components/SidebarLayout";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard/employer" },
  { icon: "📢", label: "Post a Job", path: "/post-job" },
  { icon: "📋", label: "My Job Posts", path: "/my-jobs" },
  { icon: "👥", label: "All Applicants", path: "/all-applicants" },
  { icon: "📅", label: "Interviews", path: "/interviews", active: true },
  { icon: "👤", label: "My Profile", path: "/employer/profile" },
];

export default function Interviews() {
  const [page, setPage] = useState(0);
  const size = 10;

  const { data, isLoading, isError, refetch } = useInterviews(page, size);
  const { mutate: updateStatus, isPending: updating } = useUpdateApplicationStatus();

  const interviews = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  const handleStatusChange = (appId, newStatus) => {
    updateStatus(
      { id: appId, status: newStatus },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <SidebarLayout navItems={navItems} title="Interviews Scheduled" subtitle="Employer Panel 📅">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Helper Banner */}
        <div className="bg-violet-50 border border-violet-200 text-violet-800 p-5 rounded-2xl shadow-sm">
          <h2 className="font-['Syne'] text-base font-bold m-0 flex items-center gap-2">
            <span>📅</span> Active Interview Pipeline
          </h2>
          <p className="text-violet-700 text-sm mt-1 mb-0">
            Below are candidates currently in the interview stage. You can advance them to Hired or mark them as Rejected after the evaluation.
          </p>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-48" />
                    <div className="h-3 bg-slate-200 rounded w-32" />
                  </div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-28" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-2xl text-center">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="font-semibold">Failed to load interviews. Please try again.</p>
            <button onClick={() => refetch()} className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all">
              Retry
            </button>
          </div>
        ) : interviews.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center text-slate-400">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-lg font-semibold text-slate-600">No interviews scheduled</p>
            <p className="text-sm text-slate-400 mt-1">There are no candidates in the "INTERVIEW" stage right now.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviews.map((app) => {
                const jobTitle = app._jobTitle || app.jobTitle || "Job Opportunity";
                const formattedDate = app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "N/A";
                const initials = jobTitle.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

                return (
                  <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center font-extrabold text-white text-base shadow-sm shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Interview Status
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5 mb-1 truncate">{jobTitle}</h3>
                        <p className="text-xs text-slate-500 font-semibold m-0">{app.companyName || "Your Company"}</p>
                        <p className="text-xs text-slate-400 mt-2 m-0">📅 Applied: {formattedDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-400 font-bold">ID: #{app.id}</span>
                      
                      <div className="flex items-center gap-2">
                        <select
                          disabled={updating}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white cursor-pointer shadow-sm hover:border-slate-300"
                        >
                          <option value="INTERVIEW">Interviewing</option>
                          <option value="HIRED">Hired</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="APPLIED">Applied</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                        </select>
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
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${
                        page === i
                          ? "bg-violet-600 text-white"
                          : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  Next →
                </button>
              </div>
            )}

            <p className="text-center text-xs text-slate-400">
              Showing page {page + 1} of {totalPages} ({totalElements} total interviews)
            </p>
          </>
        )}
      </div>
    </SidebarLayout>
  );
}
