import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  const { isAuthenticated, role } = auth;
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const isAuthPage = location.pathname === "/auth";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    { to: "/companies", label: "Companies" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleDashboard = () => {
    if (role === "EMPLOYER") navigate("/dashboard/employer");
    else navigate("/dashboard/jobseeker");
  };

  return (
    <nav className="bg-[#fdfbf7]/90 dark:bg-[#0f0f10]/90 backdrop-blur-md border-b border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] sticky top-0 z-50 font-['DM_Sans']">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo — wordmark only, flat mark */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 bg-[#1a1714] dark:bg-[#efe9de] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-[#efe9de] dark:text-[#1a1714] text-sm font-semibold font-['DM_Sans']">S</span>
          </div>
          <span className="font-['DM_Sans'] font-semibold text-[1.0625rem] text-[#1f1b16] dark:text-[#efe9de] tracking-tight">Stride</span>
        </Link>

        {/* Nav Links */}
        <div className="flex gap-0.5 items-center">
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`px-3.5 py-2 text-sm font-normal no-underline relative transition-colors duration-150 ${
                  active
                    ? "text-[#1f1b16] dark:text-[#efe9de] font-medium"
                    : "text-[#7b7266] dark:text-[#8a847a] hover:text-[#1f1b16] dark:hover:text-[#efe9de]"
                }`}
              >
                {label}
                {/* Signature: thin left-border style as bottom line on active */}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#1f1b16] dark:bg-[#efe9de] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-2 items-center">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleDashboard}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#5e554a] dark:text-[#aaa398] border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] bg-transparent cursor-pointer transition-colors duration-150 hover:text-[#1f1b16] dark:hover:text-[#efe9de] hover:border-[#1f1b16]/25 dark:hover:border-[#efe9de]/25"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#dc2626] dark:text-[#e5484d] border border-[#dc2626]/20 dark:border-[#e5484d]/20 bg-transparent cursor-pointer transition-colors duration-150 hover:bg-[#dc2626]/5 dark:hover:bg-[#e5484d]/10 hover:border-[#dc2626]/30"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className={`px-4 py-2 text-sm font-normal text-[#5e554a] dark:text-[#aaa398] no-underline transition-colors duration-150 hover:text-[#1f1b16] dark:hover:text-[#efe9de] ${isAuthPage ? "invisible pointer-events-none" : ""}`}
              >
                Sign in
              </Link>
              <Link
                to="/auth?mode=register"
                className={`px-4 py-2 rounded-lg text-sm font-medium text-[#efe9de] bg-[#1a1714] dark:bg-[#efe9de] dark:text-[#1a1714] no-underline transition-colors duration-150 hover:bg-[#2c2520] dark:hover:bg-white ${isAuthPage ? "invisible pointer-events-none" : ""}`}
              >
                Get started
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#7b7266] dark:text-[#8a847a] hover:text-[#1f1b16] dark:hover:text-[#efe9de] hover:bg-[#efe9df] dark:hover:bg-[#232325] transition-colors duration-150 bg-transparent cursor-pointer border-none"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
