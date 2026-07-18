import { memo } from "react";

const jobTypeColors = {
  FULL_TIME:  { bg: "bg-green-50 dark:bg-green-950/20",  text: "text-green-600 dark:text-green-400" },
  PART_TIME:  { bg: "bg-amber-50 dark:bg-amber-950/20",  text: "text-amber-700 dark:text-amber-400" },
  REMOTE:     { bg: "bg-violet-50 dark:bg-violet-950/20", text: "text-violet-600 dark:text-violet-400" },
  INTERNSHIP: { bg: "bg-blue-50 dark:bg-blue-950/20",   text: "text-blue-600 dark:text-blue-400" },
  CONTRACT:   { bg: "bg-red-50 dark:bg-red-950/20",    text: "text-red-600 dark:text-red-400" },
};

// Memoized to prevent re-render when parent re-renders with same props
const JobCard = memo(function JobCard({ job, isApplied, onViewDetails }) {
  const typeStyle      = jobTypeColors[job.jobType] || { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" };
  const salaryDisplay  = `₹${job.salaryMin?.toLocaleString()} – ₹${job.salaryMax?.toLocaleString()}`;
  const jobTypeDisplay = job.jobType?.replace("_", " ") || "Full Time";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-4 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-0.5 transition-colors duration-200">
      {/* Top row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-['Syne'] text-lg font-bold text-slate-900 dark:text-white mb-1">
            {job.title}
          </h3>
          <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{job.company}</p>
        </div>
        <span className={`${typeStyle.bg} ${typeStyle.text} text-xs font-semibold px-3 py-1 rounded-full ml-3`}>
          {jobTypeDisplay}
        </span>
      </div>

      {/* Details */}
      <div className="flex gap-5 flex-wrap mb-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        {[
          { icon: "📍", value: job.location },
          { icon: "💰", value: salaryDisplay },
          { icon: "🎯", value: job.experienceLevel },
        ].map(({ icon, value }) => (
          <span key={icon} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
            <span>{icon}</span> {value || "N/A"}
          </span>
        ))}
      </div>

      {/* View Details Button */}
      <button
        onClick={() => onViewDetails(job)}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
          isApplied
            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-300 dark:shadow-none hover:bg-emerald-600"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm shadow-blue-300 dark:shadow-none hover:shadow-blue-400 dark:hover:shadow-none hover:-translate-y-0.5"
        }`}
      >
        {isApplied ? "✓ Applied — View Details" : "View Details & Apply"}
      </button>
    </div>
  );
});

export default JobCard;
