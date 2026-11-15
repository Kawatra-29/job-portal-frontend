import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBars,
  faXmark,
  faSun,
  faMoon,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export function SidebarLayout({
  navItems = [],
  children,
  title,
  subtitle,
  actions,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, auth } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch verified user details
  const { data: currentUser } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await apiClient.get("/users/me");
      return res.data;
    },
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const name = currentUser?.fname || auth?.user?.fname || "Member";
  const role = currentUser?.role || auth?.role || "USER";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] text-slate-900 dark:text-white flex flex-col md:flex-row">
      
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-out md:translate-x-0 md:sticky md:top-0 md:h-screen shrink-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                STRIDE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Workspace
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 border-none bg-transparent cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-base" />
          </button>
        </div>

        {/* User Monogram Profile Badge */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate m-0">
              {name}
            </p>
            <span className="inline-block text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-md mt-0.5 capitalize">
              {role.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || item.active;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all no-underline ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm w-4 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {isActive && <FontAwesomeIcon icon={faChevronRight} className="text-[10px] opacity-75" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Controls */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-sm w-4 text-center" />
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors border-none bg-transparent cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-sm w-4 text-center" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace View */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-4 sm:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-slate-600 dark:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border-none bg-transparent cursor-pointer"
              aria-label="Open sidebar"
            >
              <FontAwesomeIcon icon={faBars} className="text-base" />
            </button>
            
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate leading-none m-0">
                {title || "Dashboard"}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1 mb-0">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </header>

        <main className="p-4 sm:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export default SidebarLayout;
