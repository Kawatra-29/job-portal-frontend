import { useNavigate, Link } from "react-router-dom";
import {
  useEmployerStats,
  useRecentApplicants,
  useActiveJobs,
  useUpdateApplicationStatus,
  useUpdateJobStatus,
  useDeleteJob
} from "../queries/employerQueries";
import { SidebarLayout } from "./SidebarLayout";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard/employer" },
  { icon: "📢", label: "Post a Job", path: "/post-job" },
  { icon: "📋", label: "My Job Posts", path: "/my-jobs" },
  { icon: "👥", label: "All Applicants", path: "/all-applicants" },
  { icon: "📅", label: "Interviews", path: "/interviews" },
  { icon: "👤", label: "My Profile", path: "/employer/profile" },
];

const statusStyles = {
  SHORTLISTED: { color: "text-green-600", bg: "bg-green-50" },
  APPLIED: { color: "text-blue-600", bg: "bg-blue-50" },
  INTERVIEW: { color: "text-violet-600", bg: "bg-violet-50" },
  REJECTED: { color: "text-red-600", bg: "bg-red-50" },
  HIRED: { color: "text-emerald-700", bg: "bg-emerald-50" },
  default: { color: "text-slate-600", bg: "bg-slate-50" },
};


// ApplicationResponseDto: { id, jobId, jobTitle, companyName, status, appliedAt, _jobTitle }
function ApplicantRow({ applicant }) {
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const style = statusStyles[applicant.status] || statusStyles.default;
  const jobTitle = applicant._jobTitle || applicant.jobTitle || "Unknown Job";
  const initials = jobTitle.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const appliedDate = applicant.appliedAt
    ? new Date(applicant.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "";

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    updateStatus({ id: applicant.id, status: newStatus });
  };

  return (
    <div className="flex justify-between items-center px-3 py-3 bg-slate-50 dark:bg-slate-800/40 transition-colors duration-200 rounded-xl">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-slate-900 dark:text-white m-0 truncate">Applied for: {jobTitle}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 m-0">{appliedDate && `📅 ${appliedDate}`}</p>
        </div>
      </div>
      <select
        value={applicant.status}
        onChange={handleStatusChange}
        className={`text-xs font-semibold px-2.5 py-1 rounded-full outline-none border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer ${style.bg} ${style.color}`}
      >
        <option value="APPLIED">Applied</option>
        <option value="SHORTLISTED">Shortlisted</option>
        <option value="INTERVIEW">Interview</option>
        <option value="REJECTED">Rejected</option>
        <option value="HIRED">Hired</option>
      </select>
    </div>
  );
}

// JobResponseDto: { id, title, location, jobType, workMode, status, experienceLevel, salaryMin, salaryMax, currency, deadline }
const statusBadge = {
  OPEN: "bg-green-50 text-green-600",
  CLOSED: "bg-slate-100 text-slate-500",
  PAUSED: "bg-amber-50 text-amber-600",
  FILLED: "bg-blue-50 text-blue-600",
};

function JobRow({ job }) {
  const { mutate: updateJobStatus } = useUpdateJobStatus();
  const { mutate: deleteJob } = useDeleteJob();

  const deadlineStr = job.deadline
    ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;
  const isUrgent = job.deadline && new Date(job.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000;
  const badgeCls = statusBadge[job.status] || "bg-slate-100 text-slate-500";

  const handleStatusChange = (e) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    updateJobStatus({ id: job.id, status: newStatus });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the job post "${job.title}"?`)) {
      deleteJob(job.id);
    }
  };

  return (
    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl transition-all hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-md">
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-semibold text-sm text-slate-900 dark:text-white m-0">{job.title}</p>
            {isUrgent && (
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">URGENT</span>
            )}
            <select
              value={job.status}
              onChange={handleStatusChange}
              onClick={(e) => e.stopPropagation()}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded outline-none border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer ${badgeCls}`}
            >
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="PAUSED">Paused</option>
              <option value="FILLED">Filled</option>
            </select>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
            📍 {job.location || "Remote"} &nbsp;·&nbsp; {job.jobType?.replace("_", " ")} &nbsp;·&nbsp; {job.workMode}
          </p>
          {deadlineStr && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 m-0">⏰ Deadline: {deadlineStr}</p>
          )}
        </div>
        <div className="flex flex-col items-end justify-between min-h-12 shrink-0">
          <div className="text-right">
            {job.salaryMin && (
              <p className="font-['Syne'] font-extrabold text-base text-violet-600 dark:text-violet-400 m-0">
                ₹{(job.salaryMin / 100000).toFixed(0)}L
              </p>
            )}
            {job.salaryMax && (
              <p className="text-xs text-slate-400 dark:text-slate-500 m-0">– ₹{(job.salaryMax / 100000).toFixed(0)}L</p>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-700 bg-transparent border-none mt-2 cursor-pointer transition-colors"
            title="Delete Job Post"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ stat, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-slate-200 mb-3" />
        <div className="h-8 bg-slate-200 rounded w-24" />
        <div className="h-3 bg-slate-200 rounded w-full mt-1" />
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-200 rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-950/30 flex items-center justify-center text-xl mb-3`}>
        {stat.icon}
      </div>
      <div className="font-['Syne'] text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</div>
    </div>
  );
}

export default function EmployerDashboard() {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useEmployerStats();
  const { data: recentApplicants, isLoading: applicantsLoading } = useRecentApplicants(5);
  const { data: activeJobs, isLoading: jobsLoading } = useActiveJobs();

  const statItems = stats ? [
    { icon: "📢", label: "Active Job Posts", value: String(stats.activeJobPosts || 0), color: "blue" },
    { icon: "👥", label: "Total Applicants", value: String(stats.totalApplicants || 0), color: "violet" },
    { icon: "🎯", label: "Shortlisted", value: String(stats.shortlisted || 0), color: "green" },
    { icon: "📅", label: "Interviews Today", value: String(stats.interviewsToday || 0), color: "amber" },
  ] : [
    { icon: "📢", label: "Active Job Posts", value: "0", color: "blue" },
    { icon: "👥", label: "Total Applicants", value: "0", color: "violet" },
    { icon: "🎯", label: "Shortlisted", value: "0", color: "green" },
    { icon: "📅", label: "Interviews Today", value: "0", color: "amber" },
  ];

  return (
    <SidebarLayout
      user={null}
      navItems={navItems}
      title="Welcome back, Employer!"
      subtitle="Employer Panel 🏢"
      actions={
        <button
          onClick={() => navigate("/post-job")}
          className="bg-linear-to-br from-violet-600 to-violet-800 text-white border-none rounded-xl px-5 py-3 text-sm font-bold cursor-pointer shadow-lg shadow-violet-500/35 font-['DM_Sans'] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/50"
        >
          + Post New Job
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statItems.map((stat) => (
          <StatCard key={stat.label} stat={stat} isLoading={statsLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Applicants */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-200 rounded-2xl p-6">
          <h2 className="font-['Syne'] text-base font-bold text-slate-900 dark:text-white m-0 mb-5">Recent Applicants</h2>
          <div className="flex flex-col gap-3">
            {applicantsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentApplicants?.length > 0 ? (
              recentApplicants.map((applicant) => <ApplicantRow key={applicant.id || applicant.name} applicant={applicant} />)
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-4xl mb-2">👥</p>
                <p className="font-medium">No applicants yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Job Posts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-200 rounded-2xl p-6">
          <h2 className="font-['Syne'] text-base font-bold text-slate-900 dark:text-white m-0 mb-5">Active Job Posts</h2>
          <div className="flex flex-col gap-3">
            {jobsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : activeJobs?.length > 0 ? (
              activeJobs.map((job) => <JobRow key={job.id || job.title} job={job} />)
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-4xl mb-2">📋</p>
                <p className="font-medium">No active job posts</p>
              </div>
            )}
          </div>
          <Link
            to="/post-job"
            className="block w-full mt-4 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/40 text-violet-600 dark:text-violet-400 rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer font-['DM_Sans'] hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-all text-center"
          >
            + Post Another Job
          </Link>
        </div>
      </div>
    </SidebarLayout>
  );
}