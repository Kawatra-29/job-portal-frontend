import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    { to: "/companies", label: "Companies" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const handleDashboard = () => {
    if (role === "EMPLOYER") navigate("/dashboard/employer");
    else navigate("/dashboard/jobseeker");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 font-['DM_Sans']">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-300">
            <span className="text-white text-lg font-bold font-['Syne']">J</span>
          </div>
          <span className="font-['Syne'] font-extrabold text-xl text-white tracking-tight">JobPortal</span>
        </Link>

        {/* Nav Links */}
        <div className="flex gap-1 items-center">
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline relative ${
                active
                  ? "text-white bg-linear-to-r from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
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
              <button onClick={handleDashboard} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 border border-slate-600 bg-transparent cursor-pointer font-['DM_Sans'] transition-all duration-200 hover:text-white hover:border-indigo-400 hover:bg-indigo-500/10">
                Dashboard
              </button>
              <button onClick={handleLogout} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-rose-500 to-pink-600 border-none shadow-lg shadow-rose-500/20 cursor-pointer font-['DM_Sans'] transition-all duration-200 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 border border-slate-600 bg-transparent no-underline transition-all duration-200 hover:text-white hover:border-indigo-400 hover:bg-indigo-500/10">
                Login
              </Link>
              <Link to="/auth" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 no-underline transition-all duration-200 hover:shadow-indigo-500/50 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
