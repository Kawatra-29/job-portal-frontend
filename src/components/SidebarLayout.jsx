import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Fetch logged-in user's basic info (cached by React Query — no extra calls)
function useCurrentUser() {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/v1/users/me", {
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
    <div className="flex min-h-screen bg-slate-50 font-['DM_Sans']">
      <aside className="w-60 bg-slate-900 text-white flex flex-col py-6 shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 pb-7 border-b border-white/10">
          <Link to="/home" className="flex items-center gap-2.5 no-underline">
            <div className={`w-9 h-9 bg-linear-to-br ${logoColor} rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/40`}>
              <span className="text-white text-lg font-bold font-['Syne']">J</span>
            </div>
            <span className="font-['Syne'] font-extrabold text-lg text-white">JobPortal</span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className={`w-11 h-11 rounded-full bg-linear-to-br ${avatarColor} flex items-center justify-center font-extrabold text-base mb-2.5`}>
            {initials}
          </div>
          <p className="text-sm font-semibold text-white m-0 truncate">{name}</p>
          <p className="text-xs text-slate-400 mt-0.5 m-0">{role}</p>
        </div>

        {/* Nav */}
        <nav className="p-4 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all ${
                location.pathname === item.path
                  ? "bg-violet-500/20 text-violet-400 font-semibold"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {(title || subtitle || actions) && (
          <div className="flex justify-between items-start mb-8">
            <div>
              {subtitle && <p className="text-slate-500 text-sm m-0 mb-1">{subtitle}</p>}
              {title && <h1 className="font-['Syne'] text-3xl font-extrabold text-slate-900 m-0 tracking-tight">{title}</h1>}
            </div>
            {actions}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
