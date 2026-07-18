import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useApi from "../Hooks/useApi"
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { post } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("mode") !== "register";
  });
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setIsLogin(queryParams.get("mode") !== "register");
  }, [location.search]);

  const { register, handleSubmit, formState: { errors }, formState } = useForm();

  const onSubmit = async (data) => {
    setApiError(null);

    const url = isLogin
      ? "/auth/login"
      : "/auth/sign-up";

    const payload = isLogin
      ? {
        email: data.email,
        password: data.password,
      }
      : {
        fname: data.fname,
        email: data.email,
        password: data.password,
        role: data.role || "JOBSEEKER",
        phone: data.phone,
      };

    try {
      const response = await post(url, payload, {}, { throwError: true });

      if (response?.token) {
        const role = response.role || data.role || "JOBSEEKER";
        login(response.token, role);
        if (role === "EMPLOYER") {
          navigate("/dashboard/employer");
        } else {
          navigate("/dashboard/jobseeker");
        }
      } else {
        setApiError(response?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setApiError("Invalid credentials. Please check your email and password.");
      } else if (err.response?.data?.authStatus === "USER_ALREADY_EXISTS") {
        setApiError("Email is already registered. Please login or use a different email.");
      } else if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Network error. Please check your connection.");
      }
    }
  };

  const handleToggle = (loginMode) => {
    setIsLogin(loginMode);
    setApiError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-slate-50 via-slate-100 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-6 font-['DM_Sans'] relative transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl transition-all duration-200">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold font-['Syne']">S</span>
          </div>
          <h2 className="text-2xl font-bold font-['Syne'] text-slate-900 dark:text-white">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {isLogin ? "Sign in to your account" : "Join job seekers today"}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6 transition-colors duration-200">
          {["Login", "Register"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleToggle(tab === "Login")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${(isLogin ? "Login" : "Register") === tab
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {!isLogin && (
            <>
              <div>
                <input
                  {...register("fname", { required: "Name is required" })}
                  placeholder="Full Name"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
                />
                {errors.fname && (
                  <p className="text-red-500 text-xs mt-1">{errors.fname.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  placeholder="Phone Number"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </>
          )}

          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email",
                },
              })}
              type="email"
              placeholder="Email address"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Min 6 characters",
                },
              })}
              type="password"
              placeholder="Password"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <select
              {...register("role")}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
            >
              <option value="JOBSEEKER">Job Seeker</option>
              <option value="EMPLOYER">Employer</option>
            </select>
          )}

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg mt-2 transition-colors cursor-pointer"
          >
            {formState.isSubmitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Toggle Link */}
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => handleToggle(!isLogin)}
            className="text-blue-600 dark:text-blue-400 cursor-pointer font-semibold"
          >
            {isLogin ? "Register free" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}
