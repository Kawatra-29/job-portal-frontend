import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import apiClient from "../api/apiClient";
import Footer from "../components/Footer";
import Search from "../components/Search";
import JobCard from "../components/JobCard";
import JobDetailModal from "../components/JobDetailModal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faBuilding,
  faBolt,
  faShieldHalved,
  faArrowRight,
  faUserTie,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  const [selectedJob, setSelectedJob] = useState(null);

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", "featured"],
    queryFn: async () => {
      const res = await apiClient.get("/jobs?page=0&size=6&status=OPEN");
      const list = Array.isArray(res.data) && res.data[0] === "java.util.ArrayList"
        ? res.data[1]
        : Array.isArray(res.data)
        ? res.data
        : res.data?.content || [];
      return list;
    },
    staleTime: 1000 * 60 * 5,
  });

  const featuredJobs = jobsData || [];

  const categories = [
    { name: "Software & Technology", count: "Active Openings", icon: faBolt, query: "React" },
    { name: "Backend Engineering", count: "High Demand", icon: faBriefcase, query: "Java" },
    { name: "Product & UI/UX Design", count: "Creative Roles", icon: faChartLine, query: "Design" },
    { name: "Enterprise & Consulting", count: "Top Tier", icon: faBuilding, query: "Enterprise" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] text-slate-900 dark:text-white flex flex-col">
      <Helmet>
        <title>STRIDE — India's Premier Professional Career Marketplace</title>
        <meta
          name="description"
          content="Explore verified career opportunities across leading technology and enterprise employers. Search by role, skill, and location with one-click direct applications."
        />
      </Helmet>

      <section className="relative overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-white pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium backdrop-blur-md">
            <FontAwesomeIcon icon={faShieldHalved} className="text-slate-500 dark:text-slate-400" />
            <span>Verified employers</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.15]">
            Step into your next career
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover verified jobs across top tech companies, startups, and enterprises. Apply directly with your candidate profile and track your applications in one place.
          </p>

          <div className="pt-4">
            <Search />
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 flex-wrap pt-2">
            <span className="font-semibold text-slate-300">Popular Searches:</span>
            {["Java", "React", "Spring Boot", "Full Stack", "Bangalore", "Remote"].map((tag) => (
              <Link
                key={tag}
                to={`/jobs?title=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors no-underline"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              Live Opportunities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Featured Job Openings
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hand-picked verified opportunities hiring actively right now.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors no-underline"
          >
            <span>View All Jobs</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>

        {jobsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse space-y-4"
              >
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-8 bg-slate-100 dark:bg-slate-850 rounded w-full" />
              </div>
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={(j) => setSelectedJob(j)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No active job openings found at the moment. Check back shortly.
            </p>
          </div>
        )}
      </section>

      <section className="bg-slate-100/70 dark:bg-slate-900/40 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Explore by Industry & Domain
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Discover roles tailored to your specialization and skill stack.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/jobs?title=${encodeURIComponent(cat.query)}`}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all duration-200 hover:border-blue-500/40 hover:shadow-md no-underline"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg mb-4 group-hover:scale-105 transition-transform">
                  <FontAwesomeIcon icon={cat.icon} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-900/20">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <FontAwesomeIcon icon={faUserTie} className="text-blue-200" />
              <span>For Hiring Teams & HR Leaders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Looking to Hire Top Talent in India?
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Publish vacancies, review verified candidate resumes, advance applicants through interview stages, and manage your entire hiring pipeline on Stride.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/auth?mode=register&role=EMPLOYER"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-colors text-center no-underline"
            >
              Register Employer Account
            </Link>
            <Link
              to="/post-job"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-semibold text-sm border border-blue-400/30 transition-colors text-center no-underline"
            >
              Post a Vacancy
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
