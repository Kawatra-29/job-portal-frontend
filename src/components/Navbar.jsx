import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBuilding,
  faSun,
  faMoon,
  faArrowRightFromBracket,
  faUser,
  faBriefcase,
  faBars,
  faXmark,
  faPlus,
  faShieldHalved,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  const { isAuthenticated, role, user } = auth;
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAuthPage = location.pathname === "/auth";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { to: "/jobs", label: "Find Jobs", icon: faMagnifyingGlass },
    { to: "/companies", label: "Companies", icon: faBuilding },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getDashboardPath = () => {
    if (role === "EMPLOYER") return "/dashboard/employer";
    if (role === "ADMIN") return "/dashboard/admin";
    return "/dashboard/jobseeker";
  };

  const getDashboardLabel = () => {
    if (role === "EMPLOYER") return "Employer Dashboard";
    if (role === "ADMIN") return "Admin Console";
    return "Candidate Dashboard";
  };

  const userInitial = user?.fname ? user.fname.charAt(0).toUpperCase() : "U";

  const handleNavigate = (path) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Logo & Primary Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group no-underline">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                  STRIDE
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">
                  Career Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
                      active
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <FontAwesomeIcon icon={icon} className="text-xs opacity-75" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions, Theme Toggle, Auth / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            
            {role === "EMPLOYER" && (
              <Link
                to="/post-job"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors no-underline"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                Post a Job
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-sm" />
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 transition-colors cursor-pointer text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {userInitial}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                      {user?.fname || "Account"}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize leading-none">
                      {role ? role.toLowerCase() : "user"}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {user?.fname || "Logged In"}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || ""}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavigate(getDashboardPath())}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-left bg-transparent border-none cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faBriefcase} className="text-slate-400 w-3.5 text-center" />
                        {getDashboardLabel()}
                      </button>

                      {role === "JOBSEEKER" && (
                        <>
                          <button
                            onClick={() => handleNavigate("/me")}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-left bg-transparent border-none cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faUser} className="text-slate-400 w-3.5 text-center" />
                            My Profile
                          </button>
                          <button
                            onClick={() => handleNavigate("/my-applications")}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-left bg-transparent border-none cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faClipboardList} className="text-slate-400 w-3.5 text-center" />
                            My Applications
                          </button>
                        </>
                      )}

                      {role === "EMPLOYER" && (
                        <>
                          <button
                            onClick={() => handleNavigate("/employer/profile")}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-left bg-transparent border-none cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faBuilding} className="text-slate-400 w-3.5 text-center" />
                            Company Profile
                          </button>
                          <button
                            onClick={() => handleNavigate("/my-jobs")}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-left bg-transparent border-none cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faBriefcase} className="text-slate-400 w-3.5 text-center" />
                            Manage Jobs
                          </button>
                        </>
                      )}

                      {role === "ADMIN" && (
                        <button
                          onClick={() => handleNavigate("/dashboard/admin")}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-left bg-transparent border-none cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faShieldHalved} className="text-slate-400 w-3.5 text-center" />
                          Platform Administration
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left bg-transparent border-none cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-3.5 text-center" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/auth"
                  className={`px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline ${
                    isAuthPage ? "hidden" : ""
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  className={`px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all no-underline ${
                    isAuthPage ? "hidden" : ""
                  }`}
                >
                  Register
                </Link>
                <Link
                  to="/auth?mode=register&role=EMPLOYER"
                  className="px-3.5 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors border-l border-slate-200 dark:border-slate-700 pl-3 no-underline hidden lg:inline-block"
                >
                  Employer Hiring?
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent"
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-sm" />
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-none bg-transparent"
              aria-label="Toggle navigation menu"
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ to, label, icon }) => {
              const active = location.pathname === to;
              return (
                <button
                  key={to}
                  onClick={() => handleNavigate(to)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-left border-none cursor-pointer ${
                    active
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                      : "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <FontAwesomeIcon icon={icon} className="text-sm w-4" />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigate(getDashboardPath())}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 border-none cursor-pointer text-left"
                >
                  <FontAwesomeIcon icon={faBriefcase} className="text-sm w-4 text-blue-600" />
                  {getDashboardLabel()}
                </button>
                {role === "JOBSEEKER" && (
                  <button
                    onClick={() => handleNavigate("/my-applications")}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-none cursor-pointer text-left bg-transparent"
                  >
                    <FontAwesomeIcon icon={faClipboardList} className="text-sm w-4 text-slate-400" />
                    My Applications
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left bg-transparent border-none cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-sm w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => handleNavigate("/auth")}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-transparent cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigate("/auth?mode=register")}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/20 border-none cursor-pointer"
                >
                  Create Candidate Account
                </button>
                <button
                  onClick={() => handleNavigate("/auth?mode=register&role=EMPLOYER")}
                  className="w-full text-center py-2 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 bg-transparent border-none cursor-pointer"
                >
                  Looking to hire? Register as Employer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
