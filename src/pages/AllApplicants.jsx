import { useState } from "react";
import {
  useAllApplicants,
  useUpdateApplicationStatus,
} from "../queries/employerQueries";
import { SidebarLayout } from "../components/SidebarLayout";
import { Helmet } from "react-helmet-async";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard/employer" },
  { icon: "📢", label: "Post a Job", path: "/post-job" },
  { icon: "📋", label: "My Job Posts", path: "/my-jobs" },
  { icon: "👥", label: "All Applicants", path: "/all-applicants", active: true },
  { icon: "📅", label: "Interviews", path: "/interviews" },
  { icon: "👤", label: "My Profile", path: "/employer/profile" },
];

const statusBadge = {
  APPLIED: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40",
  SHORTLISTED: "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/40",
  INTERVIEW: "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-800/40",
  REJECTED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/40",
  HIRED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40",
  default: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/20 dark:text-slate-400 dark:border-slate-700",
};

export default function AllApplicants() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedAppIds, setExpandedAppIds] = useState(new Set());
  const size = 10;

  const toggleExpand = (appId) => {
    setExpandedAppIds((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) {
        next.delete(appId);
      } else {
        next.add(appId);
      }
      return next;
    });
  };

  const filters = statusFilter ? { status: statusFilter } : {};
  const { data, isLoading, isError, refetch } = useAllApplicants(page, size, filters);
  const { mutate: updateStatus, isPending: updating } = useUpdateApplicationStatus();

  const applicants = data?.content || [];
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
    <SidebarLayout navItems={navItems} title="All Applicants" subtitle="Employer Panel 👥">
      <Helmet>
        <title>Manage Candidates & Applications | Stride Employer</title>
        <meta name="description" content="View resumes, shortlist profiles, schedule interviews and hire candidates on Stride." />
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Filters Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors duration-200">
          <div>
            <h2 className="font-['Syne'] text-base font-bold text-slate-900 dark:text-white m-0">Filter Applicants</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 m-0">Manage and filter applications across all your active jobs</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-655 text-slate-600 dark:text-slate-300 whitespace-nowrap">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all font-medium cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">All Statuses</option>
              <option value="APPLIED" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Applied</option>
              <option value="SHORTLISTED" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Shortlisted</option>
              <option value="INTERVIEW" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Interview</option>
              <option value="REJECTED" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Rejected</option>
              <option value="HIRED" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Hired</option>
            </select>
          </div>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse flex items-center justify-between transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                  </div>
                </div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-28" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-2xl text-center">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="font-semibold">Failed to load applicants. Please try again.</p>
            <button onClick={() => refetch()} className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all">
              Retry
            </button>
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-16 text-center text-slate-400 transition-colors duration-200">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">No applicants found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">There are no candidates matching the status filters.</p>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {applicants.map((app) => {
                  const jobTitle = app._jobTitle || app.jobTitle || "Job Opportunity";
                  const badgeCls = statusBadge[app.status] || statusBadge.default;
                  const formattedDate = app.appliedAt
                    ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "N/A";
                  
                  const jobSeeker = app.jobSeeker;
                  const candidateName = jobSeeker?.user?.fname || "Anonymous Candidate";
                  const initials = candidateName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  const isExpanded = expandedAppIds.has(app.id);

                  return (
                    <div key={app.id} className="p-5 flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-all">
                      
                      {/* Header Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          {/* Initials Avatar */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-500 to-blue-500 flex items-center justify-center font-extrabold text-white text-base shadow-sm shrink-0">
                            {initials}
                          </div>
                          
                          {/* Profile Header Details */}
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white m-0 truncate">
                              {candidateName}
                            </h3>
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 m-0 mt-0.5 truncate">
                              {jobSeeker?.headline || "No Headline Provided"}
                            </p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-400 dark:text-slate-550 font-medium">
                              <span>📍 {jobSeeker?.location || "N/A"}</span>
                              <span>•</span>
                              <span>💼 {jobSeeker?.yearsOfExperience || 0} yrs exp</span>
                            </div>
                          </div>
                        </div>

                        {/* Mid Section: Applied Job Details */}
                        <div className="md:text-center text-xs text-slate-500 dark:text-slate-400 font-medium border-l border-slate-100 dark:border-slate-800 md:pl-6 md:pr-6 py-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 m-0">Applied for: {jobTitle}</p>
                          <p className="m-0 mt-1 text-slate-455 text-slate-400 dark:text-slate-500">📅 {formattedDate} · ID: #{app.id}</p>
                        </div>

                        {/* Right Section: Status Control */}
                        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                          <span className={`text-xs font-bold border px-3 py-1.5 rounded-full ${badgeCls}`}>
                            {app.status}
                          </span>

                          <select
                            disabled={updating}
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer shadow-sm hover:border-slate-300 dark:hover:border-slate-600"
                          >
                            <option value="APPLIED" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Applied</option>
                            <option value="SHORTLISTED" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Shortlisted</option>
                            <option value="INTERVIEW" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Interview</option>
                            <option value="REJECTED" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Rejected</option>
                            <option value="HIRED" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">Hired</option>
                          </select>
                        </div>
                      </div>

                      {/* Expand / Collapsible Profile Details Toggle */}
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-dashed border-slate-100 dark:border-slate-800">
                        <div>
                          {jobSeeker?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {jobSeeker.skills.slice(0, 3).map((s, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-slate-500 dark:text-slate-400 text-[10px] font-semibold rounded-md capitalize">
                                  {s.skillName}
                                </span>
                              ))}
                              {jobSeeker.skills.length > 3 && (
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold self-center">
                                  +{jobSeeker.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => toggleExpand(app.id)}
                          className="text-xs font-bold text-violet-600 hover:text-violet-850 bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline select-none"
                        >
                          {isExpanded ? "Hide Candidate Profile ▴" : "View Candidate Profile ▾"}
                        </button>
                      </div>

                      {/* Collapsible Panel */}
                      {isExpanded && (
                        <div className="mt-2 p-5 bg-slate-50/55 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-xl flex flex-col gap-4 animate-slide-down">
                          
                          {/* Summary section */}
                          {jobSeeker?.summary && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-455 text-slate-400 dark:text-slate-500 uppercase tracking-wider m-0 mb-1">CANDIDATE SUMMARY</p>
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic m-0 bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-lg p-3">
                                "{jobSeeker.summary}"
                              </p>
                            </div>
                          )}
 
                          {/* Detail Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-slate-455 text-slate-400 dark:text-slate-550 m-0 mb-1">EXPECTED SALARY</p>
                              <p className="text-slate-800 dark:text-slate-200 m-0 flex items-center gap-1">💰 {jobSeeker?.expectedSalary ? `₹${jobSeeker.expectedSalary.toLocaleString()}L` : "Not Specified"}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-slate-455 text-slate-400 dark:text-slate-550 m-0 mb-1">AVAILABILITY</p>
                              <p className="text-slate-800 dark:text-slate-200 m-0 flex items-center gap-1 capitalize">⏰ {jobSeeker?.availability?.toLowerCase()?.replace("_", " ") || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-slate-455 text-slate-400 dark:text-slate-550 m-0 mb-1">CONTACT CHANNELS</p>
                              <div className="flex gap-3 mt-0.5">
                                {jobSeeker?.user?.email && (
                                  <a href={`mailto:${jobSeeker.user.email}`} className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                                    📧 Email
                                  </a>
                                )}
                                {jobSeeker?.user?.phone && (
                                  <a href={`tel:${jobSeeker.user.phone}`} className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                                    📞 Call
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
 
                          {/* Full Skills List */}
                          {jobSeeker?.skills?.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-455 text-slate-400 dark:text-slate-500 uppercase tracking-wider m-0 mb-2">FULL SKILL SET</p>
                              <div className="flex flex-wrap gap-2">
                                {jobSeeker.skills.map((s, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-lg capitalize flex items-center gap-1">
                                    <span>⚙️</span> {s.skillName} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">({s.proficiencyLevel?.toLowerCase()})</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
 
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-655 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition cursor-pointer ${page === i
                          ? "bg-violet-600 text-white"
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-750 dark:text-slate-300"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-655 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}

            <p className="text-center text-xs text-slate-400">
              Showing page {page + 1} of {totalPages} ({totalElements} total applicants)
            </p>
          </>
        )}
      </div>
    </SidebarLayout>
  );
}
