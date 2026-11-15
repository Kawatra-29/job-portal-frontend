import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ConfirmModal from "../components/ConfirmModal";
import JobDetailModal from "../components/JobDetailModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faLocationDot,
  faTrashCan,
  faClock,
  faBriefcase,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const STATUS_CONFIG = {
  APPLIED: {
    label: "Applied",
    step: 1,
    badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    step: 2,
    badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40",
  },
  INTERVIEW: {
    label: "Interview Scheduled",
    step: 3,
    badge: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
  },
  HIRED: {
    label: "Offer Accepted / Hired",
    step: 4,
    badge: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900/40",
  },
  ACCEPTED: {
    label: "Accepted",
    step: 4,
    badge: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900/40",
  },
  REJECTED: {
    label: "Not Selected",
    step: 4,
    badge: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40",
  },
};

export default function MyApplications({
  applications: propApplications,
  loading: propLoading,
  handleWithdraw: propHandleWithdraw,
}) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [withdrawTargetId, setWithdrawTargetId] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Self-fetching fallback if loaded directly via route /my-applications
  const { data: fetchedApps, isLoading: fetchedLoading } = useQuery({
    queryKey: ["applications", "my"],
    queryFn: async () => {
      const res = await apiClient.get("/applications/my");
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: propApplications === undefined,
    staleTime: 1000 * 60,
  });

  const rawList = useMemo(() => {
    if (propApplications !== undefined) {
      return Array.isArray(propApplications) ? propApplications : [];
    }
    return Array.isArray(fetchedApps) ? fetchedApps : [];
  }, [propApplications, fetchedApps]);

  const loading = propLoading !== undefined ? propLoading : fetchedLoading;

  const filteredApps = useMemo(() => {
    let list = [...rawList];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((app) => {
        const title = app.job?.title?.toLowerCase() || "";
        const comp = (app.job?.companyName || app.job?.company || "").toLowerCase();
        return title.includes(term) || comp.includes(term);
      });
    }

    if (statusFilter !== "ALL") {
      list = list.filter((app) => app.status === statusFilter);
    }

    list.sort((a, b) => {
      const dateA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
      const dateB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
      return dateB - dateA;
    });

    return list;
  }, [rawList, searchTerm, statusFilter]);

  const confirmWithdraw = async () => {
    if (!withdrawTargetId) return;
    setWithdrawing(true);
    try {
      if (propHandleWithdraw) {
        await propHandleWithdraw(withdrawTargetId);
      } else {
        await apiClient.delete(`/applications/${withdrawTargetId}`);
        queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
      }
    } finally {
      setWithdrawing(false);
      setWithdrawTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>My Job Applications | STRIDE</title>
        <meta
          name="description"
          content="Track and manage your submitted job applications and interview updates on Stride."
        />
      </Helmet>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white m-0">
            Submitted Applications
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 m-0 mt-0.5">
            Real-time status tracking for roles you've applied to on STRIDE
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-64 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400 text-xs" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role or company..."
              className="w-full bg-transparent text-xs font-medium outline-none border-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses ({rawList.length})</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Not Selected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse space-y-3"
            >
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 text-lg">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No applications match your filter
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {rawList.length === 0
              ? "You haven't applied to any job postings yet. Find open roles and apply in one click!"
              : "Try clearing your search keyword or selecting 'All Statuses'."}
          </p>
          {rawList.length === 0 && (
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors no-underline"
            >
              <span>Explore Jobs</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const job = app.job || {};
            const company = job.companyName || job.company || "Enterprise Employer";
            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED;
            const appliedDate = app.appliedAt
              ? new Date(app.appliedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Recently";

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-blue-400 dark:hover:border-blue-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-base shrink-0">
                    {company.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug truncate m-0">
                      {job.title || "Job Opportunity"}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                        {company}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faLocationDot} className="text-[10px]" />
                          <span>{job.location}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-slate-400">
                        <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                        <span>Applied on {appliedDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${cfg.badge}`}
                  >
                    {cfg.label}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent cursor-pointer"
                    >
                      View Job
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithdrawTargetId(app.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors border-none bg-transparent cursor-pointer"
                      title="Withdraw application"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(withdrawTargetId)}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this job application? This action cannot be undone."
        confirmText={withdrawing ? "Withdrawing..." : "Confirm Withdrawal"}
        cancelText="Keep Application"
        onConfirm={confirmWithdraw}
        onCancel={() => setWithdrawTargetId(null)}
        isLoading={withdrawing}
        isDanger={true}
      />

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isApplied={true}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
