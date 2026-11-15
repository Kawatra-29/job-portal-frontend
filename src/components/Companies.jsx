import { useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../Hooks/useApi";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faLocationDot,
  faShieldHalved,
  faMagnifyingGlass,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Companies() {
  const { data, loading, error } = useApi("/jobs?size=100");
  const [searchTerm, setSearchTerm] = useState("");

  // Extract unique companies from real backend jobs data
  const rawList =
    Array.isArray(data) && data.length === 2 && data[0] === "java.util.ArrayList"
      ? data[1]
      : Array.isArray(data)
      ? data
      : data?.content || [];

  // Group by company name to calculate real active job openings count
  const companyMap = new Map();

  rawList.forEach((job) => {
    const cName = job.companyName || job.company;
    if (!cName) return;

    if (!companyMap.has(cName)) {
      companyMap.set(cName, {
        name: cName,
        location: job.location || "Pan India",
        isVerified: job.isVerified || false,
        activeJobsCount: 1,
        sampleTitle: job.title,
      });
    } else {
      const existing = companyMap.get(cName);
      existing.activeJobsCount += 1;
    }
  });

  const companyList = Array.from(companyMap.values());

  const filteredCompanies = companyList.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] text-slate-900 dark:text-white flex flex-col">
      <Helmet>
        <title>Hiring Companies & Employers | STRIDE</title>
        <meta
          name="description"
          content="Explore verified corporate employers and startups hiring actively on Stride. View open positions and direct application links."
        />
      </Helmet>

      {/* Hero Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <FontAwesomeIcon icon={faBuilding} />
            <span>Employer Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Companies Actively Hiring on STRIDE
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Discover verified companies, tech startups, and enterprises with open roles right now.
          </p>

          {/* Search Filter */}
          <div className="max-w-md mx-auto pt-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400 text-sm" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search company by name or location..."
                className="w-full bg-transparent text-sm font-medium outline-none border-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse space-y-4"
              >
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-8 text-center text-rose-700 dark:text-rose-400">
            <p className="font-semibold">Failed to load hiring companies.</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
            <FontAwesomeIcon icon={faBuilding} className="text-4xl text-slate-300 dark:text-slate-700" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No companies found</p>
            <p className="text-xs text-slate-400">Try adjusting your search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((c) => (
              <div
                key={c.name}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-lg group-hover:scale-105 transition-transform">
                      {c.name.charAt(0).toUpperCase()}
                    </div>

                    {c.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 px-2 py-0.5 rounded-md">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {c.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <FontAwesomeIcon icon={faLocationDot} className="text-slate-400 text-xs" />
                    <span>{c.location}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Recent Posting</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {c.sampleTitle || "Software Position"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg">
                    {c.activeJobsCount} Active {c.activeJobsCount === 1 ? "Job" : "Jobs"}
                  </span>

                  <Link
                    to={`/jobs?title=${encodeURIComponent(c.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline"
                  >
                    <span>View Jobs</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
