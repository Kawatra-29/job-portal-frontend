import { useState, useEffect, useCallback } from "react";
import { useJob } from "../queries/jobQueries";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// ─── Toast Component ───────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-emerald-500 shadow-emerald-300/50",
    error:   "bg-red-500 shadow-red-300/50",
  };

  const icons = { success: "✓", error: "✕" };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-semibold text-sm shadow-xl ${styles[type]} animate-slide-up`}
    >
      <span className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center font-bold text-xs">
        {icons[type]}
      </span>
      {message}
      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-white font-bold text-base leading-none"
      >
        ×
      </button>
    </div>
  );
}

// ─── Badge helpers ─────────────────────────────────────────────────────────────
const jobTypeColors = {
  FULL_TIME:  { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200" },
  PART_TIME:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
  REMOTE:     { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
  INTERNSHIP: { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200" },
  CONTRACT:   { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200" },
};

const workModeColors = {
  ONSITE: { bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200" },
  REMOTE: { bg: "bg-teal-50",   text: "text-teal-600",   border: "border-teal-200" },
  HYBRID: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
};

function DetailChip({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 min-w-0">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 truncate">
        <span>{icon}</span> {value}
      </span>
    </div>
  );
}

function Section({ title, content }) {
  if (!content) return null;
  const lines = content.split(/\n|\\n/).filter(Boolean);
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">{title}</h3>
      <ul className="space-y-2">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            {line.replace(/^[-•*]\s*/, "")}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export default function JobDetailModal({ job: cardJob, isApplied: initialApplied, onClose }) {
  const [applied, setApplied]   = useState(initialApplied);
  const [toast,   setToast]     = useState(null);
  const [visible, setVisible]   = useState(false);
  const [applying, setApplying] = useState(false);
  const queryClient             = useQueryClient();

  // Fetch full job details (description, requirements, responsibilities, etc.)
  const { data: fullJob, isLoading: jobLoading } = useJob(cardJob?.id);
  const job = fullJob || cardJob;

  // Slide-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  // ESC key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleApply = useCallback(async () => {
    if (!job?.id || applied || applying) return;
    setApplying(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${BASE_URL}/applications/${job.id}/apply`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplied(true);
      setToast({ message: "Application submitted successfully! 🎉", type: "success" });
      // Invalidate cache — job will disappear from browse list
      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        // Already applied — treat as success
        setApplied(true);
        setToast({ message: "You've already applied to this job.", type: "success" });
        queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
      } else if (status === 401) {
        setToast({ message: "Please log in to apply.", type: "error" });
      } else {
        const msg = err.response?.data?.message || "Failed to apply. Please try again.";
        setToast({ message: msg, type: "error" });
      }
    } finally {
      setApplying(false);
    }
  }, [job, applied, applying, queryClient]);

  // Derived display values
  const typeStyle     = jobTypeColors[job?.jobType]   || { bg: "bg-slate-100",  text: "text-slate-600",  border: "border-slate-200" };
  const modeStyle     = workModeColors[job?.workMode] || { bg: "bg-slate-50",   text: "text-slate-600",  border: "border-slate-200" };
  const salaryDisplay = job?.salaryMin && job?.salaryMax
    ? `₹${(job.salaryMin / 100000).toFixed(1)}L – ₹${(job.salaryMax / 100000).toFixed(1)}L / yr`
    : job?.salaryMin ? `₹${(job.salaryMin / 100000).toFixed(1)}L+` : null;
  const deadlineStr   = job?.deadline
    ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const isDeadlineSoon = job?.deadline && new Date(job.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[1000] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-[1001] h-full w-full max-w-xl bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-slate-100 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                {job?.jobType?.replace("_", " ") || "Full Time"}
              </span>
              {job?.workMode && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${modeStyle.bg} ${modeStyle.text} ${modeStyle.border}`}>
                  {job.workMode}
                </span>
              )}
              {isDeadlineSoon && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 animate-pulse">
                  ⚡ Closing Soon
                </span>
              )}
            </div>
            <h2 className="font-['Syne'] text-2xl font-extrabold text-slate-900 leading-tight truncate">
              {job?.title || "—"}
            </h2>
            <p className="text-blue-600 font-semibold text-sm mt-1">{job?.company || "—"}</p>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-lg font-bold transition-all shrink-0"
          >
            ×
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

          {/* Detail chips */}
          <div className="grid grid-cols-2 gap-3">
            <DetailChip icon="📍" label="Location"   value={job?.location} />
            <DetailChip icon="💰" label="Salary"     value={salaryDisplay} />
            <DetailChip icon="🎯" label="Experience" value={job?.experienceLevel?.replace("_", " ")} />
            <DetailChip icon="📅" label="Deadline"   value={deadlineStr} />
          </div>

          {/* Loading shimmer */}
          {jobLoading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
              <div className="h-3 bg-slate-100 rounded-lg w-full" />
              <div className="h-3 bg-slate-100 rounded-lg w-5/6" />
              <div className="h-3 bg-slate-100 rounded-lg w-4/5" />
            </div>
          )}

          {/* Description */}
          {job?.description && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">About the Role</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {/* Divider */}
          {(job?.requirements || job?.responsibilities) && (
            <div className="border-t border-slate-100" />
          )}

          <Section title="Requirements"      content={job?.requirements} />
          <Section title="Responsibilities"  content={job?.responsibilities} />

          {/* Extra padding so content clears the sticky footer */}
          <div className="h-4" />
        </div>

        {/* ── Sticky Footer ── */}
        <div className="px-7 py-5 border-t border-slate-100 bg-white shrink-0">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              disabled={applying || applied}
              className={`flex-[2] py-3 rounded-xl text-sm font-bold transition-all ${
                applied
                  ? "bg-emerald-500 text-white cursor-default shadow-sm shadow-emerald-300"
                  : applying
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-300 hover:shadow-blue-400 hover:-translate-y-0.5"
              }`}
            >
              {applied ? "✓ Already Applied" : applying ? "Applying..." : "Apply Now 🚀"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Inline keyframe for toast slide-up */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </>
  );
}
