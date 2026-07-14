import { memo } from "react";

const jobTypeColors = {
  FULL_TIME:  { bg: "bg-green-50",  text: "text-green-600" },
  PART_TIME:  { bg: "bg-amber-50",  text: "text-amber-700" },
  REMOTE:     { bg: "bg-violet-50", text: "text-violet-600" },
  INTERNSHIP: { bg: "bg-blue-50",   text: "text-blue-600" },
  CONTRACT:   { bg: "bg-red-50",    text: "text-red-600" },
};

// Memoized to prevent re-render when parent re-renders with same props
const JobCard = memo(function JobCard({ job, isApplied, onViewDetails }) {
  const typeStyle      = jobTypeColors[job.jobType] || { bg: "bg-slate-100", text: "text-slate-600" };
  const salaryDisplay  = `₹${job.salaryMin?.toLocaleString()} – ₹${job.salaryMax?.toLocaleString()}`;
  const jobTypeDisplay = job.jobType?.replace("_", " ") || "Full Time";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-4 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:-translate-y-0.5">
      {/* Top row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-['Syne'] text-lg font-bold text-slate-900 mb-1">
            {job.title}
          </h3>
          <p className="text-blue-600 font-semibold text-sm">{job.company}</p>
        </div>
        <span className={`${typeStyle.bg} ${typeStyle.text} text-xs font-semibold px-3 py-1 rounded-full ml-3`}>
          {jobTypeDisplay}
        </span>
      </div>

      {/* Details */}
      <div className="flex gap-5 flex-wrap mb-5 pt-3 border-t border-slate-100">
        {[
          { icon: "📍", value: job.location },
          { icon: "💰", value: salaryDisplay },
          { icon: "🎯", value: job.experienceLevel },
        ].map(({ icon, value }) => (
          <span key={icon} className="flex items-center gap-1.5 text-slate-500 text-sm">
            <span>{icon}</span> {value || "N/A"}
          </span>
        ))}
      </div>

      {/* View Details Button */}
      <button
        onClick={() => onViewDetails(job)}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
          isApplied
            ? "bg-emerald-500 text-white cursor-pointer shadow-sm shadow-emerald-300 hover:bg-emerald-600"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm shadow-blue-300 hover:shadow-blue-400 hover:-translate-y-0.5"
        }`}
      >
        {isApplied ? "✓ Applied — View Details" : "View Details & Apply"}
      </button>
    </div>
  );
});

export default JobCard;
