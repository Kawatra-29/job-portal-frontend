import { memo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faIndianRupeeSign,
  faCheck,
  faBookmark as faBookmarkSolid,
  faClock,
  faShieldHalved,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";

// Canonical job type stylings
const jobTypeBadge = {
  FULL_TIME: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
    label: "Full Time",
  },
  PART_TIME: {
    bg: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
    label: "Part Time",
  },
  CONTRACT: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40",
    label: "Contract",
  },
  FREELANCE: {
    bg: "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/40",
    label: "Freelance",
  },
  INTERNSHIP: {
    bg: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40",
    label: "Internship",
  },
  TEMPORARY: {
    bg: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40",
    label: "Temporary",
  },
};

const workModeBadge = {
  REMOTE: {
    bg: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800/40",
    label: "Remote",
  },
  HYBRID: {
    bg: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40",
    label: "Hybrid",
  },
  ONSITE: {
    bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    label: "On-site",
  },
};

const JobCard = memo(function JobCard({ job, isApplied, onViewDetails }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("stride_saved_jobs") || "[]");
      setIsSaved(saved.includes(job.id));
    } catch {
      setIsSaved(false);
    }
  }, [job.id]);

  const toggleSave = (e) => {
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("stride_saved_jobs") || "[]");
      let updated;
      if (saved.includes(job.id)) {
        updated = saved.filter((id) => id !== job.id);
        setIsSaved(false);
      } else {
        updated = [...saved, job.id];
        setIsSaved(true);
      }
      localStorage.setItem("stride_saved_jobs", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const min = Array.isArray(job.salaryMin) ? job.salaryMin[0] : job.salaryMin;
  const max = Array.isArray(job.salaryMax) ? job.salaryMax[0] : job.salaryMax;
  
  let salaryDisplay = "Compensation Undisclosed";
  if (min && max) {
    salaryDisplay = `₹${(Number(min) / 100000).toFixed(1)}L – ₹${(Number(max) / 100000).toFixed(1)}L PA`;
  } else if (min) {
    salaryDisplay = `₹${(Number(min) / 100000).toFixed(1)}L+ PA`;
  }

  const rawJobType = Array.isArray(job.jobType) ? job.jobType[1] : job.jobType;
  const typeConfig = jobTypeBadge[rawJobType] || {
    bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    label: rawJobType?.replace("_", " ") || "Full Time",
  };

  const rawWorkMode = Array.isArray(job.workMode) ? job.workMode[1] : job.workMode;
  const modeConfig = workModeBadge[rawWorkMode] || {
    bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    label: rawWorkMode || "On-site",
  };

  const companyDisplay = job.companyName || job.company || "Enterprise Partner";
  const expDisplay = Array.isArray(job.experienceLevel) ? job.experienceLevel[1] : job.experienceLevel;
  const formattedExp = expDisplay ? expDisplay.replace("_", " ").toLowerCase() : "1+ Yrs Exp";
  const deadlineStr = job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : null;
  const companyInitial = companyDisplay.charAt(0).toUpperCase();

  return (
    <article
      onClick={() => onViewDetails(job)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/40 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
              {companyInitial}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors m-0">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
                  {companyDisplay}
                </span>
                {job.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 px-1.5 py-0.5 rounded-md">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleSave}
            title={isSaved ? "Saved to local bookmarks" : "Save job"}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer shrink-0"
            aria-label="Save Job"
          >
            <FontAwesomeIcon
              icon={isSaved ? faBookmarkSolid : faBookmarkRegular}
              className={`text-base ${isSaved ? "text-blue-600 dark:text-blue-400" : ""}`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${typeConfig.bg}`}>
            {typeConfig.label}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${modeConfig.bg}`}>
            {modeConfig.label}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize border border-slate-200/60 dark:border-slate-700/60">
            {formattedExp}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="flex items-center gap-2 truncate">
            <FontAwesomeIcon icon={faLocationDot} className="text-slate-400 text-xs shrink-0" />
            <span className="truncate">{job.location || "Pan India"}</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-200 truncate">
            <FontAwesomeIcon icon={faIndianRupeeSign} className="text-slate-400 text-xs shrink-0" />
            <span>{salaryDisplay}</span>
          </div>
        </div>

        {job.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {job.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 gap-3">
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          {deadlineStr && (
            <>
              <FontAwesomeIcon icon={faClock} className="text-[10px]" />
              <span>Apply by {deadlineStr}</span>
            </>
          )}
        </div>

        <div>
          {isApplied ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
              <FontAwesomeIcon icon={faCheck} className="text-xs" />
              Applied
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
              <span>View Details</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
});

export default JobCard;
