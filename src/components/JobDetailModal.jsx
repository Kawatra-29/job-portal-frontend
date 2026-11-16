import { useState } from "react";
import { useJob } from "../queries/jobQueries";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faIndianRupeeSign,
  faShieldHalved,
  faClock,
  faCheck,
  faPaperPlane,
  faBookmark as faBookmarkSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";

export default function JobDetailModal({
  job: initialJob,
  isApplied: initialApplied,
  onClose,
}) {
  const [applied, setApplied] = useState(initialApplied);
  const [applying, setApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const { data: fullJob } = useJob(initialJob?.id);
  const job = fullJob || initialJob;

  // Initialize saved state from localStorage
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("stride_saved_jobs") || "[]");
      return saved.includes(initialJob?.id);
    } catch {
      return false;
    }
  });

  const queryClient = useQueryClient();

  const toggleSave = () => {
    if (!job?.id) return;
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

  const handleApply = async () => {
    if (!job?.id) return;
    setApplying(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await apiClient.post(`/applications/${job.id}/apply`, {});
      setApplied(true);
      setSuccessMsg("Application submitted successfully! Track it in your candidate dashboard.");
      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.response?.data;
      if (status === 400 || msg?.includes("already applied")) {
        setApplied(true);
        setErrorMsg("You have already applied for this position.");
      } else if (status === 401 || status === 403) {
        setErrorMsg("Please sign in as a Job Seeker to apply for this job.");
      } else {
        setErrorMsg(typeof msg === "string" ? msg : "Failed to submit application. Please try again.");
      }
    } finally {
      setApplying(false);
    }
  };

  if (!job) return null;

  const min = Array.isArray(job.salaryMin) ? job.salaryMin[0] : job.salaryMin;
  const max = Array.isArray(job.salaryMax) ? job.salaryMax[0] : job.salaryMax;
  let salaryDisplay = "Undisclosed";
  if (min && max) {
    salaryDisplay = `₹${(Number(min) / 100000).toFixed(1)} Lakh – ₹${(Number(max) / 100000).toFixed(1)} Lakh PA`;
  } else if (min) {
    salaryDisplay = `₹${(Number(min) / 100000).toFixed(1)} Lakh+ PA`;
  }

  const rawJobType = Array.isArray(job.jobType) ? job.jobType[0] : job.jobType;
  const rawWorkMode = Array.isArray(job.workMode) ? job.workMode[0] : job.workMode;
  const companyName = job.companyName || job.company || "Enterprise Employer";
  const deadlineStr = job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              {companyName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-1 truncate">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {companyName}
                </span>
                {job.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 px-2 py-0.5 rounded-md">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                    Verified Partner
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleSave}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
              title={isSaved ? "Saved" : "Save Job"}
            >
              <FontAwesomeIcon icon={isSaved ? faBookmarkSolid : faBookmarkRegular} className={`text-lg ${isSaved ? "text-blue-600" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
              title="Close modal"
            >
              <FontAwesomeIcon icon={faXmark} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300">
          
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center gap-2.5">
              <FontAwesomeIcon icon={faCheck} className="text-emerald-600 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Employment Type</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                {rawJobType ? rawJobType.replace("_", " ").toLowerCase() : "Full time"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Work Mode</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                {rawWorkMode ? rawWorkMode.toLowerCase() : "On-site"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Location</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
                {job.location || "Pan India"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Experience</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                {job.experienceLevel ? job.experienceLevel.replace("_", " ").toLowerCase() : "Not specified"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base">
                <FontAwesomeIcon icon={faIndianRupeeSign} />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Estimated Annual Compensation</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{salaryDisplay}</span>
              </div>
            </div>
            {deadlineStr && (
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 sm:text-right">
                <FontAwesomeIcon icon={faClock} className="text-blue-600 dark:text-blue-400" />
                <span>Application Deadline: <strong>{deadlineStr}</strong></span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm uppercase font-bold text-slate-900 dark:text-white tracking-wider mb-2.5">
              Role Overview & Responsibilities
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl">
              {job.description || "The employer has not provided a detailed description for this position."}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <FontAwesomeIcon icon={faShieldHalved} className="text-blue-600 dark:text-blue-400 text-base shrink-0" />
            <span>
              This job posting is officially registered on the STRIDE network. Applications submitted here are forwarded directly to the hiring manager.
            </span>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={applied || applying}
            className={`px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer border-none ${
              applied
                ? "bg-emerald-600 text-white cursor-default"
                : applying
                ? "bg-blue-400 text-white cursor-wait"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-500/25"
            }`}
          >
            {applied ? (
              <>
                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                <span>Applied</span>
              </>
            ) : applying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                <span>Apply Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
