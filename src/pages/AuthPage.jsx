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

      if (response?.token || response?.authStatus === "LOGIN_SUCCESS") {
        const role = response.role || data.role || "JOBSEEKER";
        login(role, response.token);
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
      if (err.response?.status === 429) {
        setApiError("Too many attempts. Please wait 1 minute before trying again.");
      } else if (err.response?.status === 401) {
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

      if (response?.token || response?.authStatus === "OTP_VERIFIED_SUCCESSFULLY") {
        setOtpSuccess("Email verified successfully! Logging you in...");
        setTimeout(() => {
          login(response.role || "JOBSEEKER", response.token);
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
      if (err.response?.status === 429) {
        setOtpError("Too many attempts. Please wait 1 minute before trying again.");
      } else {
        const errorMsg = err.response?.data?.message || (err.response?.data?.authStatus === "INVALID_OR_EXPIRED_OTP" ? "Invalid or expired OTP. Please check the code and try again." : null);
        setOtpError(errorMsg || "Invalid or expired OTP. Please try again.");
      }
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
      setOtpError(err.response?.status === 429 ? "Too many attempts. Please wait 1 minute before trying again." : (err.response?.data?.message || "Failed to resend OTP. Please try again."));
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
      setForgotError(err.response?.status === 429 ? "Too many attempts. Please wait 1 minute before trying again." : (err.response?.data?.message || "No account found with this email address."));
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
      setForgotError(err.response?.status === 429 ? "Too many attempts. Please wait 1 minute before trying again." : (err.response?.data?.message || (err.response?.data?.authStatus === "INVALID_OR_EXPIRED_OTP" ? "Invalid or expired OTP code." : "Failed to reset password. Please try again.")));
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
    <div className="min-h-[calc(100vh-4rem)] bg-[#f7f4ee] dark:bg-[#0f0f10] flex items-center justify-center p-6 font-['DM_Sans']">
      <Helmet>
        <title>{showOtpStep ? "Verify OTP — Stride" : isLogin ? "Sign in — Stride" : "Create account — Stride"}</title>
        <meta name="description" content="Sign in or create a free candidate or employer account on Stride." />
      </Helmet>

      <div className="bg-[#fdfbf7] dark:bg-[#19191b] border border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] rounded-2xl p-8 w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.06)]">

        {/* Forgot Password View (Email Step) */}
        {showForgotStep === "EMAIL" ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#efe9df] dark:bg-[#232325] border border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-[#5e554a] dark:text-[#aaa398]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-[#1f1b16] dark:text-[#efe9de]">
                Reset password
              </h2>
              <p className="text-[#7b7266] dark:text-[#8a847a] text-sm mt-1.5">
                Enter your registered email and we'll send a 6-digit code.
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 bg-[#fee2e2] dark:bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-lg p-3 text-sm text-[#dc2626] dark:text-[#e5484d]">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleRequestForgotOtp} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#5e554a] dark:text-[#aaa398] block mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1f1b16]/30 dark:focus:border-[#efe9de]/30 bg-[#f7f4ee] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de] placeholder:text-[#8a847a]"
                />
              </div>

              <button
                type="submit"
                disabled={sendingResetOtp || !forgotEmail}
                className="w-full bg-[#1a1714] dark:bg-[#efe9de] text-[#efe9de] dark:text-[#1a1714] disabled:opacity-40 font-medium py-2.5 rounded-lg transition-colors duration-150 cursor-pointer border-none hover:bg-[#2c2520] dark:hover:bg-white"
              >
                {sendingResetOtp ? "Sending..." : "Send code"}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] text-center">
              <button
                type="button"
                onClick={() => setShowForgotStep(false)}
                className="text-[#7b7266] hover:text-[#1f1b16] dark:hover:text-[#efe9de] text-sm font-normal bg-transparent border-none cursor-pointer transition-colors duration-150"
              >
                ← Back to sign in
              </button>
            </div>
          </div>
        ) : showForgotStep === "RESET" ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#efe9df] dark:bg-[#232325] border border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-[#5e554a] dark:text-[#aaa398]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-[#1f1b16] dark:text-[#efe9de]">
                New password
              </h2>
              <p className="text-[#7b7266] dark:text-[#8a847a] text-sm mt-1.5">
                Enter the code sent to <span className="text-[#1f1b16] dark:text-[#efe9de] font-medium">{forgotEmail}</span>
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 bg-[#fee2e2] dark:bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-lg p-3 text-sm text-[#dc2626] dark:text-[#e5484d]">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 bg-[#dcfce7] dark:bg-[#16a34a]/10 border border-[#16a34a]/20 rounded-lg p-3 text-sm text-[#16a34a] dark:text-[#4cc38a]">
                {forgotSuccess}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#5e554a] dark:text-[#aaa398] block mb-1.5">
                  6-digit code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="849201"
                  className="w-full text-center tracking-[0.3em] text-2xl font-mono border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] rounded-lg px-4 py-2.5 outline-none focus:border-[#1f1b16]/30 dark:focus:border-[#efe9de]/30 bg-[#f7f4ee] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de] font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#5e554a] dark:text-[#aaa398] block mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1f1b16]/30 dark:focus:border-[#efe9de]/30 bg-[#f7f4ee] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de] placeholder:text-[#8a847a]"
                />
              </div>

              <button
                type="submit"
                disabled={resettingPassword || resetOtp.length < 6 || !newPassword}
                className="w-full bg-[#1a1714] dark:bg-[#efe9de] text-[#efe9de] dark:text-[#1a1714] disabled:opacity-40 font-medium py-2.5 rounded-lg transition-colors duration-150 cursor-pointer border-none hover:bg-[#2c2520] dark:hover:bg-white"
              >
                {resettingPassword ? "Resetting..." : "Reset password"}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] text-center">
              <button
                type="button"
                onClick={() => setShowForgotStep(false)}
                className="text-[#7b7266] hover:text-[#1f1b16] dark:hover:text-[#efe9de] text-sm bg-transparent border-none cursor-pointer transition-colors duration-150"
              >
                ← Back to sign in
              </button>
            </div>
          </div>
        ) : showOtpStep ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#efe9df] dark:bg-[#232325] border border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-[#5e554a] dark:text-[#aaa398]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-[#1f1b16] dark:text-[#efe9de]">
                Verify your email
              </h2>
              <p className="text-[#7b7266] dark:text-[#8a847a] text-sm mt-1.5">
                We sent a 6-digit code to <span className="text-[#1f1b16] dark:text-[#efe9de] font-medium">{registeredEmail}</span>
              </p>
            </div>

            {otpError && (
              <div className="mb-4 bg-[#fee2e2] dark:bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-lg p-3 text-sm text-[#dc2626] dark:text-[#e5484d]">
                {otpError}
              </div>
            )}

            {otpSuccess && (
              <div className="mb-4 bg-[#dcfce7] dark:bg-[#16a34a]/10 border border-[#16a34a]/20 rounded-lg p-3 text-sm text-[#16a34a] dark:text-[#4cc38a]">
                {otpSuccess}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#5e554a] dark:text-[#aaa398] block mb-1.5">
                  6-digit code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="482910"
                  className="w-full text-center tracking-[0.3em] text-2xl font-mono border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] rounded-lg px-4 py-2.5 outline-none focus:border-[#1f1b16]/30 dark:focus:border-[#efe9de]/30 bg-[#f7f4ee] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de] font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={verifyingOtp || otpCode.length < 6}
                className="w-full bg-[#1a1714] dark:bg-[#efe9de] text-[#efe9de] dark:text-[#1a1714] disabled:opacity-40 font-medium py-2.5 rounded-lg transition-colors duration-150 cursor-pointer border-none hover:bg-[#2c2520] dark:hover:bg-white"
              >
                {verifyingOtp ? "Verifying..." : "Verify & continue"}
              </button>
            </form>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] text-sm">
              <button
                type="button"
                onClick={() => setShowOtpStep(false)}
                className="text-[#7b7266] hover:text-[#1f1b16] dark:hover:text-[#efe9de] bg-transparent border-none cursor-pointer transition-colors duration-150"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className="text-[#1f1b16] dark:text-[#efe9de] font-medium hover:underline bg-transparent border-none cursor-pointer disabled:opacity-40 disabled:no-underline transition-colors duration-150"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-7">
              <div className="w-9 h-9 bg-[#1a1714] dark:bg-[#efe9de] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-[#efe9de] dark:text-[#1a1714] text-sm font-semibold">S</span>
              </div>
              <h2 className="text-xl font-medium text-[#1f1b16] dark:text-[#efe9de]">
                {isLogin ? "Sign in to Stride" : "Create your account"}
              </h2>
              <p className="text-[#7b7266] dark:text-[#8a847a] text-sm mt-1">
                {isLogin ? "Welcome back" : "Start finding jobs in India"}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-[#efe9df] dark:bg-[#232325] rounded-lg p-1 mb-6">
              {["Sign in", "Register"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleToggle(tab === "Sign in")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-150 border-none cursor-pointer ${(isLogin ? "Sign in" : "Register") === tab
                    ? "bg-[#fdfbf7] dark:bg-[#19191b] text-[#1f1b16] dark:text-[#efe9de] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                    : "text-[#7b7266] dark:text-[#8a847a] bg-transparent"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">

              {!isLogin && (
                <>
                  <div>
                    <input
                      {...register("fname", { required: "Name is required" })}
                      placeholder="Full name"
                      className="w-full border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1f1b16]/30 dark:focus:border-[#efe9de]/30 bg-[#f7f4ee] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de] placeholder:text-[#8a847a]"
                    />
                    {errors.fname && (
                      <p className="text-[#dc2626] dark:text-[#e5484d] text-xs mt-1">{errors.fname.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("phone", { required: "Phone is required" })}
                      placeholder="Phone number"
                      className="w-full border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1f1b16]/30 dark:focus:border-[#efe9de]/30 bg-[#f7f4ee] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de] placeholder:text-[#8a847a]"
                    />
                    {errors.phone && (
                      <p className="text-[#dc2626] dark:text-[#e5484d] text-xs mt-1">{errors.phone.message}</p>
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
                  className="w-full border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1f1b16]/30 dark:focus:border-[#efe9de]/30 bg-[#f7f4ee] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de] placeholder:text-[#8a847a]"
                />
                {errors.email && (
                  <p className="text-[#dc2626] dark:text-[#e5484d] text-xs mt-1">{errors.email.message}</p>
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
                  className="w-full border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1f1b16]/30 dark:focus:border-[#efe9de]/30 bg-[#f7f4ee] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de] placeholder:text-[#8a847a]"
                />
                {errors.password && (
                  <p className="text-[#dc2626] dark:text-[#e5484d] text-xs mt-1">{errors.password.message}</p>
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
                      className="text-xs text-[#5e554a] dark:text-[#aaa398] hover:text-[#1f1b16] dark:hover:text-[#efe9de] bg-transparent border-none cursor-pointer transition-colors duration-150"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {!isLogin && (
                <select
                  {...register("role")}
                  className="w-full border border-[#1f1b16]/[0.12] dark:border-[#efe9de]/[0.12] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#1f1b16]/30 dark:focus:border-[#efe9de]/30 bg-[#f7f4ee] dark:bg-[#232325] text-[#1f1b16] dark:text-[#efe9de]"
                >
                  <option value="JOBSEEKER">Job seeker</option>
                  <option value="EMPLOYER">Employer</option>
                </select>
              )}

              {apiError && (
                <div className="bg-[#fee2e2] dark:bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#dc2626] dark:text-[#e5484d]">
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full bg-[#1a1714] dark:bg-[#efe9de] text-[#efe9de] dark:text-[#1a1714] disabled:opacity-40 font-medium py-2.5 rounded-lg mt-1 transition-colors duration-150 cursor-pointer border-none hover:bg-[#2c2520] dark:hover:bg-white"
              >
                {formState.isSubmitting ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
              </button>
            </form>

            {/* Toggle Link */}
            <p className="text-center text-sm text-[#7b7266] dark:text-[#8a847a] mt-5">
              {isLogin ? "No account? " : "Already registered? "}
              <span
                onClick={() => handleToggle(!isLogin)}
                className="text-[#1f1b16] dark:text-[#efe9de] cursor-pointer font-medium hover:underline"
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
