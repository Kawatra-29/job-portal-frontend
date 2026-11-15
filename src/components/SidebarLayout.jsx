import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBars, faXmark, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

function useCurrentUser() {
  const { auth } = useContext(AuthContext);
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/users/me`, {
        withCredentials: true,
      });
      return res.data;
    },
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function SidebarLayout({
  user,
  navItems,
  logoColor = "bg-[#1a1714]",
  avatarColor = "bg-[#1a1714]",
  children,
  title,
  subtitle,
  actions
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, auth } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const { data: currentUser } = useCurrentUser();

  const name = currentUser?.fname || user?.fname || "User";
  const role = currentUser?.role || user?.role || auth?.role || "";

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
    <div className="flex min-h-screen bg-[#f7f4ee] dark:bg-[#0f0f10] font-['DM_Sans']">
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-[#1a1714]/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#fdfbf7] dark:bg-[#0f0f10] flex flex-col py-5 shrink-0 border-r border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] transition-transform duration-200 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:sticky md:top-0 md:h-screen`}>

        {/* Mobile close */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:hidden text-[#7b7266] hover:text-[#1f1b16] dark:hover:text-[#efe9de] bg-transparent border-none cursor-pointer"
          title="Close menu"
        >
          <FontAwesomeIcon icon={faXmark} className="text-base" />
        </button>

        {/* Logo */}
        <div className="px-5 pb-5 border-b border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08]">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-[#1a1714] dark:bg-[#efe9de] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-[#efe9de] dark:text-[#1a1714] text-xs font-semibold">S</span>
            </div>
            <span className="font-['DM_Sans'] font-semibold text-[1.0625rem] text-[#1f1b16] dark:text-[#efe9de]">Stride</span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08]">
          <div className="w-9 h-9 rounded-full bg-[#1a1714] dark:bg-[#efe9de] flex items-center justify-center font-medium text-sm mb-2 text-[#efe9de] dark:text-[#1a1714]">
            {initials}
          </div>
          <p className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de] m-0 truncate">{name}</p>
          <p className="text-xs text-[#7b7266] dark:text-[#8a847a] mt-0.5 m-0">{role}</p>
        </div>

        {/* Nav */}
        <nav className="px-3 pt-3 flex-1 overflow-y-auto min-h-0">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-colors duration-150 no-underline relative ${
                  active
                    ? "bg-[#efe9df] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de] font-medium"
                    : "text-[#5e554a] dark:text-[#8a847a] hover:bg-[#efe9df]/60 dark:hover:bg-[#232325]/60 hover:text-[#1f1b16] dark:hover:text-[#efe9de]"
                }`}
              >
                {/* Signature: left border line on active */}
                {active && (
                  <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#1f1b16] dark:bg-[#efe9de] rounded-full" />
                )}
                {/* Icon slot — renders SVG if available, falls back to item.icon prop */}
                <span className="w-4 h-4 flex items-center justify-center shrink-0 text-[#7b7266] dark:text-[#8a847a]">
                  {item.faIcon ? (
                    <FontAwesomeIcon icon={item.faIcon} className="text-sm" />
                  ) : (
                    item.icon
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="px-3 pt-3 border-t border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm text-[#dc2626] dark:text-[#e5484d] hover:bg-[#dc2626]/6 dark:hover:bg-[#e5484d]/8 transition-colors duration-150 w-full text-left bg-transparent border-none"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-sm w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="flex items-center justify-between px-5 py-3.5 bg-[#fdfbf7] dark:bg-[#0f0f10] border-b border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] md:hidden">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-[#1a1714] dark:bg-[#efe9de] rounded-lg flex items-center justify-center">
              <span className="text-[#efe9de] dark:text-[#1a1714] text-xs font-semibold">S</span>
            </div>
            <span className="font-['DM_Sans'] font-semibold text-[1.0625rem] text-[#1f1b16] dark:text-[#efe9de]">Stride</span>
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#efe9df] dark:bg-[#232325] border-none text-[#5e554a] dark:text-[#aaa398] cursor-pointer hover:bg-[#e5e0d6] dark:hover:bg-[#2c2a28] transition-colors duration-150"
            title="Open menu"
          >
            <FontAwesomeIcon icon={faBars} className="text-sm" />
          </button>
        </header>

        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {(title || subtitle || actions) && (
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div>
                {subtitle && <p className="text-[#7b7266] dark:text-[#8a847a] text-sm m-0 mb-1">{subtitle}</p>}
                {title && <h1 className="font-['DM_Sans'] text-2xl font-medium text-[#1f1b16] dark:text-[#efe9de] m-0">{title}</h1>}
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {actions}
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#fdfbf7] dark:bg-[#19191b] text-[#7b7266] dark:text-[#8a847a] border border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] hover:text-[#1f1b16] dark:hover:text-[#efe9de] transition-colors duration-150 cursor-pointer shadow-none"
                  title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? (
                    <FontAwesomeIcon icon={faSun} className="text-sm" />
                  ) : (
                    <FontAwesomeIcon icon={faMoon} className="text-sm" />
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
