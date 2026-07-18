import { useState, useMemo } from "react";

const STATUS_STAGES = {
  APPLIED: 1,
  SHORTLISTED: 2,
  INTERVIEW: 3,
  HIRED: 4,
  REJECTED: 4, // Final stage either Hired or Rejected
};

const statusStyles = {
  APPLIED: { color: "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-950/20", bg: "bg-blue-500" },
  SHORTLISTED: { color: "text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/40 bg-green-50/50 dark:bg-green-950/20", bg: "bg-green-500" },
  INTERVIEW: { color: "text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-950/20", bg: "bg-violet-500" },
  REJECTED: { color: "text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40 bg-red-50/50 dark:bg-red-950/20", bg: "bg-red-500" },
  HIRED: { color: "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20", bg: "bg-emerald-500" },
  default: { color: "text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20", bg: "bg-slate-500" }
};

export default function MyApplications({ applications, loading, handleWithdraw, onViewDetails }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  // Calculate statistics based on raw applications
  const stats = useMemo(() => {
    const list = Array.isArray(applications) ? applications : [];
    return {
      total: list.length,
      shortlisted: list.filter((app) => app.status === "SHORTLISTED").length,
      interview: list.filter((app) => app.status === "INTERVIEW").length,
      hired: list.filter((app) => app.status === "HIRED").length,
    };
  }, [applications]);

  // Filter and sort applications
  const filteredApps = useMemo(() => {
    let list = Array.isArray(applications) ? [...applications] : [];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((app) => {
        const title = app.job?.title?.toLowerCase() || "";
        const company = (app.job?.employer?.companyName || app.job?.company || "").toLowerCase();
        return title.includes(term) || company.includes(term);
      });
    }

    // Status filter
    if (statusFilter !== "ALL") {
      list = list.filter((app) => app.status === statusFilter);
    }

    // Sorting
    list.sort((a, b) => {
      const dateA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
      const dateB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
      return sortBy === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [applications, searchTerm, statusFilter, sortBy]);

  // Timeline renderer helper
  const renderTimeline = (currentStatus) => {
    const currentStage = STATUS_STAGES[currentStatus] || 1;
    const isRejected = currentStatus === "REJECTED";
    const isHired = currentStatus === "HIRED";

    const stages = [
      { id: 1, label: "Applied", color: "blue" },
      { id: 2, label: "Shortlisted", color: "green" },
      { id: 3, label: "Interview", color: "violet" },
      { 
        id: 4, 
        label: isRejected ? "Rejected" : isHired ? "Hired" : "Decision", 
        color: isRejected ? "red" : isHired ? "emerald" : "slate" 
      }
    ];

    return (
      <div className="flex items-center w-full mt-4 py-2">
        {stages.map((stage, idx) => {
          const isActive = currentStage >= stage.id;
          const isCurrent = currentStage === stage.id;
          
          let circleColorClass = "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500";
          let labelColorClass = "text-slate-400 dark:text-slate-500 font-normal";
          let lineColorClass = "bg-slate-200 dark:bg-slate-850";

          if (isActive) {
            if (stage.id === 4) {
              circleColorClass = isRejected ? "bg-red-500 text-white shadow-md shadow-red-200 dark:shadow-none" : "bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none";
              labelColorClass = isRejected ? "text-red-600 dark:text-red-400 font-bold" : "text-emerald-700 dark:text-emerald-400 font-bold";
            } else {
              circleColorClass = stage.id === 1 ? "bg-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-none" : 
                                stage.id === 2 ? "bg-green-500 text-white shadow-md shadow-green-200 dark:shadow-none" : 
                                "bg-violet-500 text-white shadow-md shadow-violet-200 dark:shadow-none";
              labelColorClass = "text-slate-700 dark:text-slate-300 font-semibold";
            }
          }

          if (idx < stages.length - 1) {
            const nextStageActive = currentStage > stage.id;
            if (nextStageActive) {
              lineColorClass = stage.id === 1 ? "bg-blue-400 dark:bg-blue-600" : stage.id === 2 ? "bg-green-400 dark:bg-green-600" : "bg-violet-400 dark:bg-violet-600";
            }
          }

          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-initial text-center justify-center relative">
              {/* Dot & Label Container */}
              <div className="flex flex-col items-center relative group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${circleColorClass} ${isCurrent ? "scale-110 ring-4 ring-offset-2 ring-slate-100 dark:ring-offset-slate-900 dark:ring-slate-800" : ""}`}>
                  {isActive ? "✓" : stage.id}
                </div>
                <span className={`text-[11px] absolute top-9 whitespace-nowrap transition-colors duration-300 ${labelColorClass}`}>
                  {stage.label}
                </span>
              </div>
              
              {/* Connector line */}
              {idx < stages.length - 1 && (
                <div className="flex-1 h-[3px] mx-2 rounded-full relative overflow-hidden">
                  <div className={`absolute inset-0 transition-colors duration-500 ${lineColorClass}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="font-['Syne'] text-3xl font-extrabold text-slate-900 dark:text-white m-0 tracking-tight">
          My Applications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
          Track, search, and manage your applied jobs and hiring progress
        </p>
      </div>
 
      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Applications", value: stats.total, icon: "📋", color: "blue" },
          { label: "Shortlisted", value: stats.shortlisted, icon: "✨", color: "green" },
          { label: "Interviews Scheduled", value: stats.interview, icon: "📅", color: "violet" },
          { label: "Offers Received", value: stats.hired, icon: "🎉", color: "emerald" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5 transition-colors duration-200">
            <div className="flex justify-between items-start mb-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? "…" : item.value}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
      
      {/* Filter and Search Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white dark:focus:bg-slate-850 transition-all text-slate-800 dark:text-white"
            />
          </div>
 
          {/* Sort By Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-white cursor-pointer focus:outline-none focus:border-blue-400 focus:bg-white dark:focus:bg-slate-850 transition-all"
            >
              <option value="NEWEST">Newest Applied</option>
              <option value="OLDEST">Oldest Applied</option>
            </select>
          </div>
        </div>
 
        {/* Status Filter Tabs/Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
          {[
            { key: "ALL", label: "All Applications" },
            { key: "APPLIED", label: "Applied" },
            { key: "SHORTLISTED", label: "Shortlisted" },
            { key: "INTERVIEW", label: "Interviewing" },
            { key: "HIRED", label: "Hired" },
            { key: "REJECTED", label: "Rejected" },
          ].map((tab) => {
            const isSelected = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 dark:bg-slate-750 text-white shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-150 dark:border-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-5">
        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 transition-colors duration-200">
            <div className="animate-pulse flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-48" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-32" />
            </div>
          </div>
        ) : filteredApps.length > 0 ? (
          filteredApps.map((app) => {
            const style = statusStyles[app.status] || statusStyles.default;
            const companyName = app.job?.employer?.companyName || app.job?.company || "Unknown Company";
            const formattedDate = app.appliedAt
              ? new Date(app.appliedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A";

            // Salary display fallback
            const salary = app.job?.salaryMin && app.job?.salaryMax
              ? `₹${app.job.salaryMin.toLocaleString()} – ₹${app.job.salaryMax.toLocaleString()}`
              : app.job?.salary || "Not Specified";

            // Job Type Display fallback
            const jobType = app.job?.jobType?.replace("_", " ") || "Full Time";

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-200"
              >
                {/* Application Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
                  <div className="flex gap-4 items-center">
                    {/* Placeholder Logo with Gradient */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 dark:from-slate-750 dark:to-slate-700 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shrink-0">
                      {companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-['Syne'] text-base font-bold text-slate-900 dark:text-white m-0">
                        {app.job?.title || "Job Title"}
                      </h3>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 m-0 mt-0.5">
                        {companyName}
                      </p>
                    </div>
                  </div>

                  {/* Badges / Dates */}
                  <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
                    <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold px-2.5 py-1 rounded-lg">
                      📅 Applied on {formattedDate}
                    </span>
                    <span className="text-[11px] bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold px-2.5 py-1 rounded-lg capitalize">
                      💼 {jobType}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${style.color}`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 m-0 mb-1">LOCATION</p>
                    <p className="text-slate-800 dark:text-slate-200 m-0 flex items-center gap-1">📍 {app.job?.location || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 m-0 mb-1">OFFERED SALARY</p>
                    <p className="text-slate-800 dark:text-slate-200 m-0 flex items-center gap-1">💰 {salary}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 m-0 mb-1">EXPERIENCE LEVEL</p>
                    <p className="text-slate-800 dark:text-slate-200 m-0 flex items-center gap-1">🎯 {app.job?.experienceLevel || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 m-0 mb-1">WORK MODE</p>
                    <p className="text-slate-800 dark:text-slate-200 m-0 flex items-center gap-1">🏠 {app.job?.workMode || "N/A"}</p>
                  </div>
                </div>
                       {/* Progress bar timeline and action items */}
                <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                  {/* Timeline (takes full width of remaining container) */}
                  <div className="flex-1 max-w-2xl pb-6 lg:pb-0">
                    {renderTimeline(app.status)}
                  </div>
 
                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-end shrink-0 mt-4 lg:mt-0">
                    {/* View Job Description Details */}
                    {app.job && (
                      <button
                        onClick={() => onViewDetails(app.job)}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm dark:shadow-none"
                      >
                        View Job Details
                      </button>
                    )}
 
                    {/* Withdraw (Only if status is not final: hired or rejected) */}
                    {app.status !== "HIRED" && app.status !== "REJECTED" && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="px-4 py-2.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-450 rounded-xl text-xs font-bold cursor-pointer border border-red-100 dark:border-red-900/30 transition-all"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center text-slate-400 transition-colors duration-200">
            <span className="text-5xl block mb-4">📋</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-base m-0 mb-1">No matching applications</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs m-0">Try clearing filters or checking other statuses.</p>
            {(searchTerm || statusFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all border-none"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
