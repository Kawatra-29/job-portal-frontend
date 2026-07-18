import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  const { token, role } = auth;
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const isAuthPage = location.pathname === "/auth";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    { to: "/companies", label: "Companies" },
  ];

  const handleLogout = () => {
    logout();          // clears AuthContext state + localStorage
    navigate("/auth");
  };

  const handleDashboard = () => {
    if (role === "EMPLOYER") navigate("/dashboard/employer");
    else navigate("/dashboard/jobseeker");
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 font-['DM_Sans'] transition-colors duration-200">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-300">
            <span className="text-white text-lg font-bold font-['Syne']">S</span>
          </div>
          <span className="font-['Syne'] font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">Stride</span>
        </Link>

        {/* Nav Links */}
        <div className="flex gap-1 items-center">
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline relative ${
                active
                  ? "text-white bg-linear-to-r from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 hover:dark:text-white hover:dark:bg-slate-800"
              }`}>
                {label}
                {active && (
                  <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-3 items-center">
          {token ? (
            <>
              <button onClick={handleDashboard} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 bg-transparent cursor-pointer font-['DM_Sans'] transition-all duration-200 hover:text-slate-900 dark:hover:text-white hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10">
                Dashboard
              </button>
              <button onClick={handleLogout} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-rose-500 to-pink-600 border-none shadow-lg shadow-rose-500/20 cursor-pointer font-['DM_Sans'] transition-all duration-200 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className={`px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 bg-transparent no-underline transition-all duration-200 hover:text-slate-900 dark:hover:text-white hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 ${isAuthPage ? 'invisible pointer-events-none' : ''}`}>
                Login
              </Link>
              <Link to="/auth?mode=register" className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 no-underline transition-all duration-200 hover:shadow-indigo-500/50 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${isAuthPage ? 'invisible pointer-events-none' : ''}`}>
                Register
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
