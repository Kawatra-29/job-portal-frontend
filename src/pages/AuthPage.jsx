import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useApi from "../Hooks/useApi";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faPhone,
  faBriefcase,
  faBuilding,
  faEye,
  faEyeSlash,
  faArrowRight,
  faShieldHalved,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const { post } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isLogin = queryParams.get("mode") !== "register";
  const urlRole = queryParams.get("role") === "EMPLOYER" ? "EMPLOYER" : "JOBSEEKER";

  const [selectedRole, setSelectedRole] = useState(urlRole);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // OTP Verification States
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Forgot Password States
  const [showForgotStep, setShowForgotStep] = useState(false); // false | "EMAIL" | "RESET"
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotError, setForgotError] = useState(null);
  const [forgotSuccess, setForgotSuccess] = useState(null);
  const [sendingResetOtp, setSendingResetOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Mode change handler using navigate query updates
  const setMode = (mode) => {
    const p = new URLSearchParams(location.search);
    if (mode === "register") p.set("mode", "register");
    else p.delete("mode");
    navigate({ search: p.toString() }, { replace: true });
    setApiError(null);
  };

  const onSubmit = async (formData) => {
    setApiError(null);
    setSubmitting(true);

    const url = isLogin ? "/auth/login" : "/auth/sign-up";
    const payload = isLogin
      ? {
          email: formData.email.trim(),
          password: formData.password,
        }
      : {
          fname: formData.fname.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: selectedRole,
          phone: formData.phone?.trim() || "",
        };

    try {
      const response = await post(url, payload, {}, { throwError: true });

      if (
        !isLogin &&
        (response?.authStatus === "USER_CREATED_SUCCESSFULLY" ||
          response?.authStatus === "OTP_SENT_SUCCESSFULLY")
      ) {
        setRegisteredEmail(formData.email.trim());
        setShowOtpStep(true);
        setResendTimer(60);
        return;
      }

      if (response?.token || response?.authStatus === "LOGIN_SUCCESS") {
        const role = response.role || selectedRole;
        login(role, response.token);
        if (role === "EMPLOYER") {
          navigate("/dashboard/employer");
        } else if (role === "ADMIN") {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard/jobseeker");
        }
      } else if (response?.authStatus === "EMAIL_NOT_VERIFIED") {
        setRegisteredEmail(formData.email.trim());
        setShowOtpStep(true);
        setApiError("Your email has not been verified yet. Please enter the OTP sent to your inbox.");
      } else {
        setApiError(response?.message || "Authentication failed. Please verify credentials.");
      }
    } catch (err) {
      const errResponse = err.response?.data;
      const status = err.response?.status;
      if (status === 401 || errResponse?.authStatus === "LOGIN_FAILED") {
        setApiError("Invalid email or password. Please verify and try again.");
      } else if (errResponse?.authStatus === "EMAIL_NOT_VERIFIED") {
        setRegisteredEmail(formData.email.trim());
        setShowOtpStep(true);
        setApiError("Email not verified yet. Please enter your verification OTP.");
      } else if (errResponse?.authStatus === "USER_ALREADY_EXISTS") {
        setApiError("An account with this email already exists. Please sign in instead.");
      } else {
        setApiError(
          errResponse?.message ||
            (typeof errResponse === "string" ? errResponse : "Authentication failed. Please try again.")
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setOtpError("Please enter the 6-digit OTP code.");
      return;
    }

    setOtpError(null);
    setOtpSuccess(null);
    setVerifyingOtp(true);

    try {
      const response = await post(
        `/auth/verify-otp?email=${encodeURIComponent(registeredEmail)}&otp=${encodeURIComponent(otpCode.trim())}`,
        {},
        {},
        { throwError: true }
      );

      if (response?.token || response?.authStatus === "OTP_VERIFIED_SUCCESSFULLY") {
        setOtpSuccess("Email verified successfully! Logging you in...");
        setTimeout(() => {
          login(response.role || selectedRole, response.token);
          if (response.role === "EMPLOYER") navigate("/dashboard/employer");
          else navigate("/dashboard/jobseeker");
        }, 1200);
      } else {
        setOtpError("Invalid or expired OTP. Please check your inbox or resend.");
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      await post(`/auth/resend-otp?email=${encodeURIComponent(registeredEmail)}`, {});
      setResendTimer(60);
      setOtpSuccess("A fresh verification code has been dispatched to your email.");
      setOtpError(null);
    } catch {
      setOtpError("Failed to resend OTP. Please wait a moment and try again.");
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your registered email address.");
      return;
    }
    setSendingResetOtp(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
      await post(`/auth/forgot-password?email=${encodeURIComponent(forgotEmail.trim())}`, {}, {}, { throwError: true });
      setShowForgotStep("RESET");
      setForgotSuccess("Password reset OTP sent! Check your inbox.");
    } catch (err) {
      setForgotError(err.response?.data?.message || "Could not send reset OTP. Verify your email.");
    } finally {
      setSendingResetOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetOtp.trim() || !newPassword.trim()) {
      setForgotError("Please provide both the OTP and your new password.");
      return;
    }
    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters in length.");
      return;
    }

    setResettingPassword(true);
    setForgotError(null);

    try {
      await post(
        "/auth/reset-password",
        {
          email: forgotEmail.trim(),
          otp: resetOtp.trim(),
          newPassword: newPassword,
        },
        {},
        { throwError: true }
      );
      setForgotSuccess("Password reset successfully! You can now sign in with your new credentials.");
      setTimeout(() => {
        setShowForgotStep(false);
        setMode("login");
        reset();
      }, 1500);
    } catch (err) {
      setForgotError(err.response?.data?.message || "Failed to reset password. Please check the OTP.");
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] text-slate-900 dark:text-white flex flex-col">
      <Helmet>
        <title>{isLogin ? "Sign In to STRIDE" : "Create Your STRIDE Account"}</title>
        <meta
          name="description"
          content="Access your Stride job marketplace account or create a candidate or employer profile to hire and get hired."
        />
      </Helmet>

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-all">
          
          {showOtpStep ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-xl">
                  <FontAwesomeIcon icon={faShieldHalved} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verify Your Email</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We've sent a 6-digit confirmation code to: <br />
                  <strong className="text-slate-800 dark:text-slate-200">{registeredEmail}</strong>
                </p>
              </div>

              {otpSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} />
                  <span>{otpSuccess}</span>
                </div>
              )}

              {otpError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 text-xs font-semibold">
                  {otpError}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center tracking-widest text-lg font-bold px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifyingOtp}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  {verifyingOtp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setShowOtpStep(false)}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-transparent border-none cursor-pointer p-0"
                >
                  Back to Sign In
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={handleResendOtp}
                  className="text-blue-600 dark:text-blue-400 font-semibold disabled:text-slate-400 bg-transparent border-none cursor-pointer p-0"
                >
                  {resendTimer > 0 ? `Resend code (${resendTimer}s)` : "Resend OTP"}
                </button>
              </div>
            </div>
          ) : showForgotStep ? (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {showForgotStep === "EMAIL"
                    ? "Enter your registered email to receive a recovery code."
                    : "Enter the OTP sent to your email and set a new password."}
                </p>
              </div>

              {forgotSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  {forgotSuccess}
                </div>
              )}

              {forgotError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 text-xs font-semibold">
                  {forgotError}
                </div>
              )}

              {showForgotStep === "EMAIL" ? (
                <form onSubmit={handleSendResetOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                      Account Email
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 text-sm font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingResetOtp}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl cursor-pointer border-none shadow-md"
                  >
                    {sendingResetOtp ? "Sending OTP..." : "Send Reset OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                      Reset OTP Code
                    </label>
                    <input
                      type="text"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="6-digit code from email"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 text-sm font-medium text-slate-900 dark:text-white text-center tracking-widest font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 text-sm font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resettingPassword}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl cursor-pointer border-none shadow-md"
                  >
                    {resettingPassword ? "Updating Password..." : "Set New Password"}
                  </button>
                </form>
              )}

              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowForgotStep(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-transparent border-none cursor-pointer"
                >
                  Cancel and return to Sign In
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {isLogin ? "Welcome to STRIDE" : "Create Your Account"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isLogin
                    ? "Sign in with your email to continue"
                    : "Join thousands of job seekers and verified hiring teams"}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`py-2 rounded-lg transition-all cursor-pointer border-none ${
                    isLogin
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white bg-transparent"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`py-2 rounded-lg transition-all cursor-pointer border-none ${
                    !isLogin
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white bg-transparent"
                  }`}
                >
                  Register
                </button>
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase font-bold text-slate-400 dark:text-slate-500">
                    I am registering as:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("JOBSEEKER")}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        selectedRole === "JOBSEEKER"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <FontAwesomeIcon icon={faBriefcase} className="text-sm" />
                      <div>
                        <div className="text-xs font-bold leading-tight">Job Seeker</div>
                        <div className="text-[10px] opacity-75">Find & apply</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole("EMPLOYER")}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        selectedRole === "EMPLOYER"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <FontAwesomeIcon icon={faBuilding} className="text-sm" />
                      <div>
                        <div className="text-xs font-bold leading-tight">Employer</div>
                        <div className="text-[10px] opacity-75">Post & hire</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {apiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 text-xs font-semibold leading-relaxed">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 transition-colors">
                      <FontAwesomeIcon icon={faUser} className="text-slate-400 text-xs" />
                      <input
                        {...register("fname", { required: "Full name is required" })}
                        placeholder="e.g. Saurabh Kumar"
                        className="w-full bg-transparent text-sm font-medium outline-none border-none text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                    </div>
                    {errors.fname && (
                      <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                        {errors.fname.message}
                      </span>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 transition-colors">
                    <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-xs" />
                    <input
                      type="email"
                      {...register("email", { required: "Valid email is required" })}
                      placeholder="name@company.com"
                      className="w-full bg-transparent text-sm font-medium outline-none border-none text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 transition-colors">
                      <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-xs" />
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="+91 9876543210"
                        className="w-full bg-transparent text-sm font-medium outline-none border-none text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs uppercase font-bold text-slate-400 dark:text-slate-500">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setShowForgotStep("EMAIL")}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline bg-transparent border-none cursor-pointer p-0"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 transition-colors">
                    <FontAwesomeIcon icon={faLock} className="text-slate-400 text-xs" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                      })}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm font-medium outline-none border-none text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs border-none bg-transparent cursor-pointer p-1"
                      aria-label="Toggle password visibility"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isLogin ? "Signing in..." : "Creating Account..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? "Sign In to Stride" : "Complete Registration"}</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                {isLogin ? (
                  <span>
                    New to STRIDE?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      Register here
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      Sign in here
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
