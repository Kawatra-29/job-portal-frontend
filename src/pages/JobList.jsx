import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import JobDetailModal from "../components/JobDetailModal";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faLocationDot,
  faFilter,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faSliders,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

// Known-safe job types that avoid backend serialization bug with old records
const SAFE_JOB_TYPES = ["PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"];

const fetchJobs = async ({ page, size, title, location, jobType, workMode }) => {
  // Build URL with given filters
  const buildUrl = (jt) => {
    let url = `/jobs?page=${page}&size=${size}`;
    if (title) url += `&title=${encodeURIComponent(title)}`;
    if (location) url += `&location=${encodeURIComponent(location)}`;
    if (jt) url += `&jobType=${encodeURIComponent(jt)}`;
    if (workMode) url += `&workMode=${encodeURIComponent(workMode)}`;
    return url;
  };

  try {
    const res = await apiClient.get(buildUrl(jobType));
    return res.data;
  } catch (err) {
    // Backend 500 = Hibernate serialization bug on old job records (IDs 1–25)
    // Triggered when jobType is empty (All Types) or FULL_TIME
    // Fallback: fetch each safe job type separately and merge results
    if (err.response?.status === 500) {
      const results = await Promise.allSettled(
        SAFE_JOB_TYPES.map((jt) => apiClient.get(buildUrl(jt)))
      );

      const merged = [];
      for (const r of results) {
        if (r.status === "fulfilled") {
          const d = r.value.data;
          const list =
            Array.isArray(d) && d.length === 2 && d[0] === "java.util.ArrayList"
              ? d[1]
              : Array.isArray(d)
              ? d
              : d?.content || [];
          merged.push(...list);
        }
      }

      // If we got some results, return them as a synthetic response
      if (merged.length > 0) {
        return { content: merged, _fallback: true };
      }

      // All safe types returned empty — return empty gracefully (backend has only FULL_TIME data)
      return { content: [], _fallback: true, _noFullTime: true };
    }
    throw err;
  }
};

export default function JobList() {
  const { auth } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(0);
  const size = 10;

  // Derive initial values from search params
  const initialTitle = searchParams.get("title") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialJobType = searchParams.get("jobType") || "";
  const initialWorkMode = searchParams.get("workMode") || "";

  // User input state
  const [titleInput, setTitleInput] = useState(initialTitle);
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [selectedJobType, setSelectedJobType] = useState(initialJobType);
  const [selectedWorkMode, setSelectedWorkMode] = useState(initialWorkMode);
  const [selectedExpLevel, setSelectedExpLevel] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: [
      "jobs",
      "search",
      page,
      searchParams.get("title") || "",
      searchParams.get("location") || "",
      selectedJobType,
      selectedWorkMode,
    ],
    queryFn: () =>
      fetchJobs({
        page,
        size,
        title: searchParams.get("title") || "",
        location: searchParams.get("location") || "",
        jobType: selectedJobType,
        workMode: selectedWorkMode,
      }),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });

  const { data: myApps } = useQuery({
    queryKey: ["applications", "my"],
    queryFn: async () => {
      const res = await apiClient.get("/applications/my");
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: auth.isAuthenticated && auth.role === "JOBSEEKER",
    staleTime: 0,
  });

  const appliedJobIds = new Set(
    Array.isArray(myApps) ? myApps.map((a) => a?.job?.id).filter(Boolean) : []
  );

  const isFallbackMode = data?._fallback === true;
  const isNoFullTimeData = data?._noFullTime === true;

  const rawList =
    data?._fallback
      ? data.content || []
      : Array.isArray(data) && data.length === 2 && data[0] === "java.util.ArrayList"
      ? data[1]
      : Array.isArray(data)
      ? data
      : data?.content || [];

  const allJobs = rawList.map((j) => ({
    ...j,
    id: Array.isArray(j.id) ? j.id[1] : j.id,
    jobType: Array.isArray(j.jobType) ? j.jobType[1] : j.jobType,
    workMode: Array.isArray(j.workMode) ? j.workMode[1] : j.workMode,
    status: Array.isArray(j.status) ? j.status[1] : j.status,
    experienceLevel: Array.isArray(j.experienceLevel) ? j.experienceLevel[1] : j.experienceLevel,
    salaryMin: Array.isArray(j.salaryMin) ? j.salaryMin[1] : j.salaryMin,
    salaryMax: Array.isArray(j.salaryMax) ? j.salaryMax[1] : j.salaryMax,
    deadline: Array.isArray(j.deadline) ? j.deadline[1] : j.deadline,
    company: j.companyName || j.company || "Enterprise Employer",
    companyName: j.companyName || j.company || "Enterprise Employer",
  }));

  const filteredJobs = selectedExpLevel
    ? allJobs.filter((j) => j.experienceLevel === selectedExpLevel)
    : allJobs;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (titleInput.trim()) newParams.set("title", titleInput.trim());
    else newParams.delete("title");

    if (locationInput.trim()) newParams.set("location", locationInput.trim());
    else newParams.delete("location");

    setSearchParams(newParams);
    setPage(0);
  };

  const handleClearFilters = () => {
    setTitleInput("");
    setLocationInput("");
    setSelectedJobType("");
    setSelectedWorkMode("");
    setSelectedExpLevel("");
    setSearchParams(new URLSearchParams());
    setPage(0);
  };

  const jobTypeOptions = [
    { value: "", label: "All Job Types" },
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "INTERNSHIP", label: "Internship" },
  ];

  const workModeOptions = [
    { value: "", label: "All Work Modes" },
    { value: "ONSITE", label: "On-site" },
    { value: "REMOTE", label: "Remote" },
    { value: "HYBRID", label: "Hybrid" },
  ];

  const expOptions = [
    { value: "", label: "All Experience Levels" },
    { value: "ENTRY_LEVEL", label: "Entry Level" },
    { value: "JUNIOR", label: "Junior" },
    { value: "MID_LEVEL", label: "Mid Level" },
    { value: "SENIOR", label: "Senior" },
    { value: "LEAD", label: "Lead" },
    { value: "MANAGER", label: "Manager" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] text-slate-900 dark:text-white flex flex-col">
      <Helmet>
        <title>Find Jobs & Careers | STRIDE Marketplace</title>
        <meta
          name="description"
          content="Explore open roles in engineering, product, data, operations and enterprise technology. Filter by job type, work mode, and location."
        />
      </Helmet>

      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400 text-sm" />
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Job title, skill, or keyword..."
                className="w-full bg-transparent text-sm font-medium outline-none border-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <FontAwesomeIcon icon={faLocationDot} className="text-slate-400 text-sm" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="City, state, or remote..."
                className="w-full bg-transparent text-sm font-medium outline-none border-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="submit"
                className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-colors cursor-pointer border-none"
              >
                Search
              </button>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faFilter} className="text-xs" />
                <span>Filters</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faSliders} className="text-blue-600 text-xs" />
                  Filter Results
                </span>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline bg-transparent border-none cursor-pointer p-0"
                >
                  Reset all
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Work Mode
                </label>
                <div className="space-y-1.5">
                  {workModeOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 py-1"
                    >
                      <input
                        type="radio"
                        name="workMode"
                        checked={selectedWorkMode === opt.value}
                        onChange={() => {
                          setSelectedWorkMode(opt.value);
                          setPage(0);
                        }}
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Job Type
                </label>
                <div className="space-y-1.5">
                  {jobTypeOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 py-1"
                    >
                      <input
                        type="radio"
                        name="jobType"
                        checked={selectedJobType === opt.value}
                        onChange={() => {
                          setSelectedJobType(opt.value);
                          setPage(0);
                        }}
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Experience Level
                </label>
                <select
                  value={selectedExpLevel}
                  onChange={(e) => setSelectedExpLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none"
                >
                  {expOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Showing <strong className="text-slate-900 dark:text-white">{filteredJobs.length}</strong> active openings
                {isFetching && <span className="ml-2 text-xs text-blue-500 animate-pulse font-normal">Updating...</span>}
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
              >
                <FontAwesomeIcon icon={faRotateRight} className={`text-xs ${isFetching ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse space-y-3"
                  >
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded w-1/4" />
                    <div className="h-10 bg-slate-50 dark:bg-slate-850 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-8 text-center text-rose-700 dark:text-rose-400">
                <p className="text-base font-semibold mb-2">Failed to load jobs from server.</p>
                <p className="text-xs opacity-80 mb-4">{error.message || "Network error occurred."}</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
                >
                  Retry Search
                </button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 text-lg">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No matching jobs found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try adjusting your filters, clearing keywords, or searching for broader terms like "Developer" or "Engineer".
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-100 border border-blue-200 dark:border-blue-900/40 cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isApplied={appliedJobIds.has(job.id)}
                    onViewDetails={(j) => setSelectedJob(j)}
                  />
                ))}
              </div>
            )}

            {filteredJobs.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Page {page + 1}
                </span>

                <button
                  disabled={filteredJobs.length < size}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent"
                >
                  <span>Next</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Filter Vacancies
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white border-none bg-transparent cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-base" />
              </button>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Work Mode</label>
              <div className="space-y-2">
                {workModeOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 text-sm font-medium">
                    <input
                      type="radio"
                      name="mobileWorkMode"
                      checked={selectedWorkMode === opt.value}
                      onChange={() => setSelectedWorkMode(opt.value)}
                      className="accent-blue-600"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Job Type</label>
              <div className="space-y-2">
                {jobTypeOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 text-sm font-medium">
                    <input
                      type="radio"
                      name="mobileJobType"
                      checked={selectedJobType === opt.value}
                      onChange={() => setSelectedJobType(opt.value)}
                      className="accent-blue-600"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  handleClearFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 text-xs font-semibold rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isApplied={appliedJobIds.has(selectedJob.id)}
          onClose={() => setSelectedJob(null)}
        />
      )}

      <Footer />
    </div>
  );
}
