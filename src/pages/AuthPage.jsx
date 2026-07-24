import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useApi from "../Hooks/useApi"
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Helmet } from "react-helmet-async";

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

  // OTP Verification States
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Forgot Password States
  const [showForgotStep, setShowForgotStep] = useState(false); // false, "EMAIL", "RESET"
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotError, setForgotError] = useState(null);
  const [forgotSuccess, setForgotSuccess] = useState(null);
  const [sendingResetOtp, setSendingResetOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setIsLogin(queryParams.get("mode") !== "register");
  }, [location.search]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

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

      if (!isLogin && (response?.authStatus === "USER_CREATED_SUCCESSFULLY" || response?.authStatus === "OTP_SENT_SUCCESSFULLY")) {
        setRegisteredEmail(data.email);
        setShowOtpStep(true);
        setResendTimer(60);
        return;
      }

      if (response?.token) {
        const role = response.role || data.role || "JOBSEEKER";
        login(response.token, role);
        if (role === "EMPLOYER") {
          navigate("/dashboard/employer");
        } else {
          navigate("/dashboard/jobseeker");
        }
      } else if (response?.authStatus === "EMAIL_NOT_VERIFIED") {
        setRegisteredEmail(data.email);
        setShowOtpStep(true);
        setApiError("Your email is not verified yet. Please enter the OTP sent to your email.");
      } else {
        setApiError(response?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setApiError("Invalid credentials. Please check your email and password.");
      } else if (err.response?.data?.authStatus === "USER_ALREADY_EXISTS") {
        setApiError("Email is already registered. Please login or use a different email.");
      } else if (err.response?.data?.authStatus === "EMAIL_NOT_VERIFIED") {
        setRegisteredEmail(data.email);
        setShowOtpStep(true);
        setApiError("Email not verified. Please enter the OTP sent to your inbox.");
      } else if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Network error. Please check your connection.");
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }

    setVerifyingOtp(true);
    setOtpError(null);
    setOtpSuccess(null);

    try {
      const response = await post(`/auth/verify-otp?email=${encodeURIComponent(registeredEmail.trim())}&otp=${encodeURIComponent(otpCode.trim())}`, {}, {}, { throwError: true });

      if (response?.token) {
        setOtpSuccess("Email verified successfully! Logging you in...");
        setTimeout(() => {
          login(response.token, response.role || "JOBSEEKER");
          if (response.role === "EMPLOYER") {
            navigate("/dashboard/employer");
          } else {
            navigate("/dashboard/jobseeker");
          }
        }, 1200);
      } else {
        setOtpError("Invalid or expired OTP. Please try again.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || (err.response?.data?.authStatus === "INVALID_OR_EXPIRED_OTP" ? "Invalid or expired OTP. Please check the code and try again." : null);
      setOtpError(errorMsg || "Invalid or expired OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtpError(null);
    setOtpSuccess(null);

    try {
      await post(`/auth/resend-otp?email=${encodeURIComponent(registeredEmail.trim())}`, {}, {}, { throwError: true });
      setOtpSuccess("New OTP has been sent to your email address!");
      setResendTimer(60);
      setTimeout(() => setOtpSuccess(null), 4000);
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleRequestForgotOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotError("Please enter a valid email address.");
      return;
    }
    setSendingResetOtp(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
      await post(`/auth/forgot-password?email=${encodeURIComponent(forgotEmail.trim())}`, {}, {}, { throwError: true });
      setForgotSuccess("Password reset OTP sent to your email address!");
      setShowForgotStep("RESET");
    } catch (err) {
      setForgotError(err.response?.data?.message || "No account found with this email address.");
    } finally {
      setSendingResetOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.trim().length < 6) {
      setForgotError("Please enter a valid 6-digit OTP code.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setForgotError("New password must be at least 6 characters.");
      return;
    }

    setResettingPassword(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
      await post("/auth/reset-password", {
        email: forgotEmail.trim(),
        otp: resetOtp.trim(),
        newPassword: newPassword,
      }, {}, { throwError: true });

      setForgotSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        setShowForgotStep(false);
        setIsLogin(true);
        setForgotSuccess(null);
        setForgotError(null);
        setForgotEmail("");
        setResetOtp("");
        setNewPassword("");
      }, 1500);
    } catch (err) {
      setForgotError(err.response?.data?.message || (err.response?.data?.authStatus === "INVALID_OR_EXPIRED_OTP" ? "Invalid or expired OTP code." : "Failed to reset password. Please try again."));
    } finally {
      setResettingPassword(false);
    }
  };

  const handleToggle = (loginMode) => {
    setIsLogin(loginMode);
    setApiError(null);
    setShowOtpStep(false);
    setShowForgotStep(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-slate-50 via-slate-100 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-6 font-['DM_Sans'] relative transition-colors duration-200">
      <Helmet>
        <title>{showOtpStep ? "Verify OTP | Stride" : isLogin ? "Sign In | Stride" : "Register Free Account | Stride"}</title>
        <meta name="description" content="Sign in or create a new free candidate/employer account on Stride." />
      </Helmet>

      <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl transition-all duration-200">

        {/* Forgot Password View (Email Step) */}
        {showForgotStep === "EMAIL" ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-linear-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg text-2xl">
                🔑
              </div>
              <h2 className="text-2xl font-bold font-['Syne'] text-slate-900 dark:text-white">
                Reset Password
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                Enter your registered email address and we'll send you a 6-digit verification code.
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-600">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleRequestForgotOtp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Registered Email Address:
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={sendingResetOtp || !forgotEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer border-none"
              >
                {sendingResetOtp ? "Sending Code..." : "Send Verification Code"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setShowForgotStep(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-xs font-medium bg-transparent border-none cursor-pointer"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : showForgotStep === "RESET" ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-linear-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg text-2xl">
                🔒
              </div>
              <h2 className="text-2xl font-bold font-['Syne'] text-slate-900 dark:text-white">
                New Password
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                Enter the 6-digit OTP code sent to <strong className="text-blue-600 dark:text-blue-400">{forgotEmail}</strong>
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-600">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-600 font-semibold">
                ✓ {forgotSuccess}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  6-Digit OTP Code:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="e.g. 849201"
                  className="w-full text-center tracking-widest text-2xl font-mono border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  New Password:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={resettingPassword || resetOtp.length < 6 || !newPassword}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer border-none"
              >
                {resettingPassword ? "Resetting Password..." : "Reset Password & Login"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setShowForgotStep(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-xs font-medium bg-transparent border-none cursor-pointer"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : showOtpStep ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg text-2xl">
                ✉️
              </div>
              <h2 className="text-2xl font-bold font-['Syne'] text-slate-900 dark:text-white">
                Verify Your Email
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                We sent a 6-digit OTP code to <strong className="text-blue-600 dark:text-blue-400">{registeredEmail}</strong>
              </p>
            </div>

            {otpError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-600">
                {otpError}
              </div>
            )}

            {otpSuccess && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-600 font-semibold">
                ✓ {otpSuccess}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Enter 6-Digit OTP:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="e.g. 482910"
                  className="w-full text-center tracking-widest text-2xl font-mono border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={verifyingOtp || otpCode.length < 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer border-none"
              >
                {verifyingOtp ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setShowOtpStep(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium bg-transparent border-none cursor-pointer"
              >
                ← Back to Login
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:no-underline"
              >
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        ) : (
          <>
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
                {isLogin && (
                  <div className="text-right mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotStep("EMAIL");
                        setForgotError(null);
                        setForgotSuccess(null);
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
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
          </>
        )}
      </div>
    </div>
  );
}
