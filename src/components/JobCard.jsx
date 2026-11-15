import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faIndianRupeeSign,
  faBriefcase,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const jobTypeColors = {
  FULL_TIME:  { bg: "bg-[#dcfce7] dark:bg-[#16a34a]/10",  text: "text-[#16a34a] dark:text-[#4cc38a]" },
  PART_TIME:  { bg: "bg-[#fef9c3] dark:bg-amber-900/10",  text: "text-amber-700 dark:text-amber-400" },
  REMOTE:     { bg: "bg-[#ede9fe] dark:bg-violet-900/10", text: "text-violet-700 dark:text-violet-400" },
  INTERNSHIP: { bg: "bg-[#dbeafe] dark:bg-blue-900/10",   text: "text-blue-700 dark:text-blue-400" },
  CONTRACT:   { bg: "bg-[#fee2e2] dark:bg-red-900/10",    text: "text-[#dc2626] dark:text-[#e5484d]" },
};

// Memoized to prevent re-render when parent re-renders with same props
const JobCard = memo(function JobCard({ job, isApplied, onViewDetails }) {
  const min = Array.isArray(job.salaryMin) ? job.salaryMin[1] : job.salaryMin;
  const max = Array.isArray(job.salaryMax) ? job.salaryMax[1] : job.salaryMax;
  const salaryDisplay  = min && max ? `₹${Number(min).toLocaleString("en-IN")} – ₹${Number(max).toLocaleString("en-IN")}` : min ? `₹${Number(min).toLocaleString("en-IN")}+` : "Negotiable";
  const rawJobType     = Array.isArray(job.jobType) ? job.jobType[1] : job.jobType;
  const typeStyle      = jobTypeColors[rawJobType] || { bg: "bg-[#f7f4ee] dark:bg-[#232325]", text: "text-[#5e554a] dark:text-[#aaa398]" };
  const jobTypeDisplay = rawJobType?.replace("_", " ") || "Full time";
  const companyDisplay = job.companyName || job.company || "Company";
  const expDisplay     = Array.isArray(job.experienceLevel) ? job.experienceLevel[1] : job.experienceLevel;

  const details = [
    { icon: faLocationDot, value: job.location },
    { icon: faIndianRupeeSign, value: salaryDisplay },
    { icon: faBriefcase, value: expDisplay },
  ];

  return (
    <div className="bg-[#fdfbf7] dark:bg-[#19191b] border border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] rounded-2xl p-5 mb-3 transition-colors duration-150 hover:border-[#1f1b16]/18 dark:hover:border-[#efe9de]/15">
      {/* Top row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-['DM_Sans'] text-base font-medium text-[#1f1b16] dark:text-[#efe9de] mb-0.5 truncate">
            {job.title}
          </h3>
          <p className="text-[#5e554a] dark:text-[#aaa398] text-sm">{companyDisplay}</p>
        </div>
        <span className={`${typeStyle.bg} ${typeStyle.text} text-xs font-medium px-2.5 py-1 rounded-md ml-3 shrink-0`}>
          {jobTypeDisplay}
        </span>
      </div>

      {/* Details */}
      <div className="flex gap-4 flex-wrap mb-4 pt-3 border-t border-[#1f1b16]/[0.06] dark:border-[#efe9de]/[0.06]">
        {details.map(({ icon, value }) => (
          <span key={icon.iconName} className="flex items-center gap-1.5 text-[#7b7266] dark:text-[#8a847a] text-sm">
            <FontAwesomeIcon icon={icon} className="text-xs shrink-0" />
            {value || "N/A"}
          </span>
        ))}
      </div>

      {/* Action button */}
      <button
        onClick={() => onViewDetails(job)}
        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 cursor-pointer border-none ${
          isApplied
            ? "bg-[#16a34a]/10 dark:bg-[#4cc38a]/10 text-[#16a34a] dark:text-[#4cc38a]"
            : "bg-[#1a1714] dark:bg-[#efe9de] text-[#efe9de] dark:text-[#1a1714] hover:bg-[#2c2520] dark:hover:bg-white"
        }`}
      >
        {isApplied ? (
          <span className="flex items-center justify-center gap-1.5">
            <FontAwesomeIcon icon={faCheck} className="text-xs" />
            Applied — View details
          </span>
        ) : (
          "View details & apply"
        )}
      </button>
    </div>
  );
});

export default JobCard;
