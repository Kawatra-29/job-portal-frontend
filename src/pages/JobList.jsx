import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import JobCard from "../components/JobCard";
import JobDetailModal from "../components/JobDetailModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const fetchJobs = async ({ page, size, title, location }) => {
  let url = `${BASE_URL}/jobs?page=${page}&size=${size}`;
  if (title) url += `&title=${encodeURIComponent(title)}`;
  if (location) url += `&location=${encodeURIComponent(location)}`;
  const res = await axios.get(url);
  return res.data;
};

export default function JobList() {
  const [page, setPage] = useState(0);
  const size = 10;

  // Temp input values
  const [titleInput, setTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // Actual values sent to API
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["jobs", "list", page, titleFilter, locationFilter],
    queryFn: () => fetchJobs({ page, size, title: titleFilter, location: locationFilter }),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prevData) => prevData,
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const { data: myApps } = useQuery({
    queryKey: ["applications", "my"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/applications/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!token && role === "JOBSEEKER",
    staleTime: 0,
    refetchOnWindowFocus: true,
  });


  const appliedJobIds = new Set(
    Array.isArray(myApps) ? myApps.map(app => app?.job?.id).filter(Boolean) : []
  );

  const allJobs = data?.content || [];
  const totalJobs = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  // Filter out applied jobs for jobseekers
  const isJobSeeker = !!token && role === "JOBSEEKER";
  const jobs = isJobSeeker
    ? allJobs.filter((job) => !appliedJobIds.has(job.id))
    : allJobs;

  // Selected job for detail modal
  const [selectedJob, setSelectedJob] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setTitleFilter(titleInput);
    setLocationFilter(locationInput);
    setPage(0);
  };

  const handleClearFilters = () => {
    setTitleInput("");
    setLocationInput("");
    setTitleFilter("");
    setLocationFilter("");
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] transition-colors duration-200">

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-8 transition-colors duration-200">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-['Syne'] text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Latest Jobs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            {isLoading
              ? "Loading opportunities..."
              : jobs.length > 0
              ? isJobSeeker && appliedJobIds.size > 0
                ? `${jobs.length} new jobs available · ${appliedJobIds.size} already applied`
                : `${totalJobs} jobs available`
              : isJobSeeker && appliedJobIds.size > 0
              ? `You've applied to all ${appliedJobIds.size} jobs on this page`
              : "Explore all open positions"}
          </p>
 
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl shadow-xs transition-colors duration-200">
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search by job title..."
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-700 dark:text-white font-['DM_Sans']"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400">📍</span>
              <input
                type="text"
                placeholder="Search by location..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-700 dark:text-white font-['DM_Sans']"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-300 dark:shadow-none hover:-translate-y-0.5 cursor-pointer"
              >
                Search
              </button>
              {(titleFilter || locationFilter) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-3.5 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-650 text-slate-700 dark:text-white font-semibold text-sm rounded-xl transition-all border-none cursor-pointer"
                  title="Clear Filters"
                >
                  ✕
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse transition-colors duration-200">
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md mb-3 w-3/5" />
                <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md mb-5 w-1/3" />
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="font-semibold text-red-600 mb-1">
              Failed to load jobs
            </p>
            <p className="text-sm text-red-500">{error.message}</p>
            <button onClick={() => setPage(0)} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Retry
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            {isJobSeeker && appliedJobIds.size > 0 ? (
              <>
                <p className="text-5xl mb-4">🎉</p>
                <p className="text-xl font-semibold text-slate-600 dark:text-slate-400">All caught up!</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                  You've already applied to all {appliedJobIds.size} jobs here.<br/>
                  Try searching a different title or location.
                </p>
              </>
            ) : (
              <>
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-xl font-semibold text-slate-500 dark:text-slate-400">No jobs found</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied={appliedJobIds.has(job.id)}
                  onViewDetails={setSelectedJob}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || isFetching}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  ← Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > totalPages - 3) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        disabled={isFetching}
                        className={`w-10 h-10 rounded-lg transition ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1 || isFetching}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  Next →
                </button>
              </div>
            )}

            <p className="text-center text-sm text-slate-400 mt-4">
              Page {page + 1} of {totalPages}
            </p>
          </>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isApplied={appliedJobIds.has(selectedJob.id)}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}