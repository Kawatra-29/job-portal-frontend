import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import JobCard from "../components/JobCard";

const fetchJobs = async ({ page, size }) => {
  const res = await axios.get(`http://localhost:8080/api/v1/jobs?page=${page}&size=${size}`);
  return res.data;
};

export default function JobList() {
  const [page, setPage] = useState(0);
  const size = 10;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["jobs", "list", page],
    queryFn: () => fetchJobs({ page, size }),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prevData) => prevData,
  });

  const jobs = data?.content || [];
  const totalJobs = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  return (
    <div className="min-h-screen bg-slate-50 font-['DM_Sans']">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-['Syne'] text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Latest Jobs
          </h1>
          <p className="text-slate-500 text-sm">
            {isLoading ? "Loading opportunities..." : jobs.length > 0 ? `${totalJobs} jobs available` : "Explore all open positions"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
                <div className="h-5 bg-slate-100 rounded-md mb-3 w-3/5" />
                <div className="h-3.5 bg-slate-100 rounded-md mb-5 w-1/3" />
                <div className="h-10 bg-slate-100 rounded-xl" />
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
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-slate-500">
              No jobs found
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
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
    </div>
  );
}