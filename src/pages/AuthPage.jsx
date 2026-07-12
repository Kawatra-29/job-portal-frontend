import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useApi from "../Hooks/useApi"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const { post } = useApi();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { register, handleSubmit, formState: { errors }, formState } = useForm();

  const onSubmit = async (data) => {
    setApiError(null);

    const url = isLogin
      ? "http://localhost:8080/api/v1/auth/login"
      : "http://localhost:8080/api/v1/auth/sign-up";

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
      const response = await post(url, payload);

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
    } catch {
      setApiError("Network error. Please check your connection.");
    }
  };

  const handleToggle = (loginMode) => {
    setIsLogin(loginMode);
    setApiError(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-6 font-['DM_Sans']">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold font-['Syne']">J</span>
          </div>
          <h2 className="text-2xl font-bold font-['Syne'] text-slate-900">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin ? "Sign in to your account" : "Join job seekers today"}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
          {["Login", "Register"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleToggle(tab === "Login")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${(isLogin ? "Login" : "Register") === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
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
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50"
                />
                {errors.fname && (
                  <p className="text-red-500 text-xs mt-1">{errors.fname.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  placeholder="Phone Number"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50"
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
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50"
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
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <select
              {...register("role")}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50"
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg mt-2 transition-colors"
          >
            {formState.isSubmitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Toggle Link */}
        <p className="text-center text-sm text-slate-400 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => handleToggle(!isLogin)}
            className="text-blue-600 cursor-pointer font-semibold"
          >
            {isLogin ? "Register free" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}
