import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faArrowRight,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                S
              </div>
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1">
                STRIDE
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's modern employment marketplace connecting high-caliber professionals with verified hiring companies, seed startups, and top enterprises.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-400" />
                Verified Employers
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faBriefcase} className="text-blue-400" />
                Direct Application Pipeline
              </span>
            </div>
          </div>

          {/* Quick Links: Job Seekers */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-sm list-none p-0 m-0">
              <li>
                <Link to="/jobs" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?workMode=REMOTE" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?jobType=FULL_TIME" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Full-Time Roles
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Hiring Companies
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=register" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Create Candidate Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Employers */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-sm list-none p-0 m-0">
              <li>
                <Link to="/post-job" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=register&role=EMPLOYER" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Register as Employer
                </Link>
              </li>
              <li>
                <Link to="/dashboard/employer" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Recruiter Console
                </Link>
              </li>
              <li>
                <Link to="/all-applicants" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Candidate Pipeline
                </Link>
              </li>
              <li>
                <Link to="/interviews" className="text-slate-400 hover:text-white transition-colors no-underline">
                  Interview Scheduling
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Enterprise Trust
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="m-0 leading-relaxed">
                Backed by real-time Spring Boot API infrastructure and JWT-secured role authentication.
              </p>
              <div className="pt-2">
                <a
                  href="https://stride-backend-2001.up.railway.app/swagger-ui/index.html"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium no-underline"
                >
                  <span>Backend OpenAPI Docs</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="m-0">
            © {new Date().getFullYear()} STRIDE Technologies Inc. All rights reserved. Built for professional hiring.
          </p>
          <div className="flex items-center gap-6">
            <span>Powered by Spring Boot & React 19</span>
            <span>Security by JWT Bearer Auth</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
