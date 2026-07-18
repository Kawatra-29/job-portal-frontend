import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// Fetch logged-in user's basic info (cached by React Query — no extra calls)
function useCurrentUser() {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function SidebarLayout({
  user,
  navItems,
  logoColor = "from-violet-600 to-violet-800",
  avatarColor = "from-violet-600 to-pink-600",
  children,
  title,
  subtitle,
  actions
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, auth } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false); // Controls mobile drawer state

  // Fetch real user data from API
  const { data: currentUser } = useCurrentUser();

  // Real name priority: API response → prop → fallback
  const name = currentUser?.fname || user?.fname || "User";
  const role = currentUser?.role || user?.role || auth?.role || "";

  // Initials from name
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();             // clears AuthContext state
    localStorage.clear(); // clears any remaining localStorage keys
    navigate("/auth");    // redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] transition-colors duration-200">
      {/* Backdrop (visible only when mobile drawer is open) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar aside */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white dark:bg-slate-900 text-slate-800 dark:text-white flex flex-col py-6 shrink-0 border-r border-slate-200/80 dark:border-white/10 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:sticky md:top-0 md:h-screen`}>
        {/* Mobile close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-slate-700 dark:hover:text-white text-xl font-bold bg-transparent border-none cursor-pointer"
          title="Close Menu"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="px-6 pb-7 border-b border-slate-100 dark:border-white/10">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className={`w-9 h-9 bg-linear-to-br ${logoColor} rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/40`}>
              <span className="text-white text-lg font-bold font-['Syne']">S</span>
            </div>
            <span className="font-['Syne'] font-extrabold text-lg text-slate-900 dark:text-white">Stride</span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10">
          <div className={`w-11 h-11 rounded-full bg-linear-to-br ${avatarColor} flex items-center justify-center font-extrabold text-base mb-2.5 text-white`}>
            {initials}
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white m-0 truncate">{name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 m-0">{role}</p>
        </div>

        {/* Nav */}
        <nav className="p-4 flex-1 overflow-y-auto min-h-0">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all ${
                  active
                    ? "bg-violet-50 text-violet-600 font-semibold dark:bg-violet-500/20 dark:text-violet-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full text-left"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main page content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 md:hidden transition-colors duration-200">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className={`w-8 h-8 bg-linear-to-br ${logoColor} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-sm font-bold font-['Syne']">S</span>
            </div>
            <span className="font-['Syne'] font-extrabold text-base text-slate-900 dark:text-white">Stride</span>
          </Link>
          
          <button
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Open Menu"
          >
            ☰
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          {(title || subtitle || actions) && (
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div>
                {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm m-0 mb-1">{subtitle}</p>}
                {title && <h1 className="font-['Syne'] text-3xl font-extrabold text-slate-900 dark:text-white m-0 tracking-tight transition-colors duration-200">{title}</h1>}
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {actions}
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
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
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
