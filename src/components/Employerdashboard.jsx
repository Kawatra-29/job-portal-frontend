import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useEmployerStats,
  useRecentApplicants,
  useActiveJobs,
  useUpdateApplicationStatus,
  useUpdateJobStatus,
  useDeleteJob,
} from "../queries/employerQueries";
import ConfirmModal from "./ConfirmModal";
import SidebarLayout from "./SidebarLayout";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBriefcase,
  faUsers,
  faArrowRight,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard/employer", active: true },
  { icon: "📢", label: "Post a Job", path: "/post-job" },
  { icon: "📋", label: "My Job Posts", path: "/my-jobs" },
  { icon: "👥", label: "All Applicants", path: "/all-applicants" },
  { icon: "📅", label: "Interviews", path: "/interviews" },
  { icon: "🏢", label: "Company Profile", path: "/employer/profile" },
];

const statusStyles = {
  APPLIED: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
  SHORTLISTED: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40",
  INTERVIEW: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
  REJECTED: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40",
  HIRED: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900/40",
  ACCEPTED: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900/40",
};

export default function EmployerDashboard() {
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Queries
  const { data: stats, isLoading: statsLoading } = useEmployerStats();
  const { data: recentApplicants, isLoading: applicantsLoading, refetch: refetchApplicants } = useRecentApplicants();
  const { data: activeJobs, isLoading: jobsLoading, refetch: refetchJobs } = useActiveJobs();
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { mutate: updateJobStatus } = useUpdateJobStatus();
  const { mutate: deleteJob, isPending: deleting } = useDeleteJob();

  const handleStatusChange = (appId, newStatus) => {
    updateStatus(
      { id: appId, status: newStatus },
      {
        onSuccess: () => refetchApplicants(),
      }
    );
  };

  const handleJobStatusToggle = (jobId, currentStatus) => {
    const newStatus = currentStatus === "OPEN" ? "PAUSED" : "OPEN";
    updateJobStatus(
      { id: jobId, status: newStatus },
      {
        onSuccess: () => refetchJobs(),
      }
    );
  };

  const confirmDeleteJob = () => {
    if (!deleteTarget) return;
    deleteJob(deleteTarget.id, {
      onSuccess: () => {
        refetchJobs();
        setDeleteTarget(null);
      },
    });
  };

  const applicantsList = Array.isArray(recentApplicants) ? recentApplicants : [];
  const jobsList = Array.isArray(activeJobs) ? activeJobs : [];

  return (
    <SidebarLayout
      navItems={navItems}
      title="Employer Console"
      subtitle="Recruiter Dashboard & Talent Pipeline"
      actions={
        <Link
          to="/post-job"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors no-underline"
        >
          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
          <span>Post a Job</span>
        </Link>
      }
    >
      <Helmet>
        <title>Employer Dashboard | STRIDE</title>
        <meta
          name="description"
          content="Manage your job vacancies, candidate pipeline, and scheduled interviews in the Stride Employer Portal."
        />
      </Helmet>

      <div className="space-y-8">
        
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Jobs</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">
                📢
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular">
              {statsLoading ? "..." : stats?.activeJobs ?? jobsList.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Published open positions</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Applicants</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                👥
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular">
              {statsLoading ? "..." : stats?.totalApplicants ?? applicantsList.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Across all active postings</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interviews</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">
                📅
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular">
              {statsLoading
                ? "..."
                : stats?.scheduledInterviews ??
                  applicantsList.filter((a) => a.status === "INTERVIEW").length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Candidates in interview round</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Shortlisted</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                ⭐
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular">
              {statsLoading
                ? "..."
                : applicantsList.filter((a) => a.status === "SHORTLISTED").length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Pre-selected for review</p>
          </div>
        </div>

        {/* Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Job Postings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBriefcase} className="text-blue-600 text-sm" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">
                    Active Job Openings
                  </h3>
                </div>
                <Link
                  to="/my-jobs"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline no-underline"
                >
                  Manage all
                </Link>
              </div>

              {jobsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : jobsList.length === 0 ? (
                <div className="text-center py-8 text-slate-500 space-y-2">
                  <p className="text-sm">No jobs published yet.</p>
                  <Link
                    to="/post-job"
                    className="inline-block px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold no-underline"
                  >
                    Post your first job
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobsList.slice(0, 4).map((job) => (
                    <div
                      key={job.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate m-0">
                          {job.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>{job.location || "Pan India"}</span>
                          <span>•</span>
                          <span className="capitalize">{job.jobType?.toLowerCase() || "Full-time"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleJobStatusToggle(job.id, job.status)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border cursor-pointer ${
                            job.status === "OPEN"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200"
                          }`}
                        >
                          {job.status === "OPEN" ? "Open" : "Paused"}
                        </button>

                        <button
                          onClick={() => setDeleteTarget(job)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 border-none bg-transparent cursor-pointer"
                          title="Delete job"
                        >
                          <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
              <Link
                to="/post-job"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-blue-400 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors no-underline"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Publish New Job Vacancy</span>
              </Link>
            </div>
          </div>

          {/* Recent Applicants Pipeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-sm" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">
                    Recent Applications
                  </h3>
                </div>
                <Link
                  to="/all-applicants"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline no-underline"
                >
                  View pipeline
                </Link>
              </div>

              {applicantsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : applicantsList.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">No applications received yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Applications from job seekers will show up here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applicantsList.slice(0, 4).map((app) => {
                    const badgeClass = statusStyles[app.status] || statusStyles.APPLIED;
                    const jobTitle = app._jobTitle || app.jobTitle || "Job Opening";

                    return (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate m-0">
                            Applied for: {jobTitle}
                          </p>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            ID: #{app.id} • Candidate Profile
                          </span>
                        </div>

                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${badgeClass}`}
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="HIRED">Hired</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-center">
              <Link
                to="/all-applicants"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline no-underline"
              >
                <span>Open Candidate Pipeline Console</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Job Vacancy"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? All applicant history for this job will be impacted.`}
        confirmText={deleting ? "Deleting..." : "Delete Permanently"}
        cancelText="Cancel"
        onConfirm={confirmDeleteJob}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
        isDanger={true}
      />
    </SidebarLayout>
  );
}
