import { useState, useActionState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

export default function AuthPage() {
  const { post } = useApi();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  async function authAction(prevState, formData) {
    try {
      const loginMode = formData.get("isLogin") === "true";
      const url = loginMode
        ? "http://localhost:8080/api/v1/auth/login"
        : "http://localhost:8080/api/v1/auth/register";

      const payload = loginMode
        ? {
            email: formData.get("email"),
            password: formData.get("password"),
          }
        : {
            fname: formData.get("fname"),
            email: formData.get("email"),
            password: formData.get("password"),
            role: formData.get("role") || "JOBSEEKER",
            phone: formData.get("phone"),
          };

      const response = await post(url, payload);

      if (response?.token) {
        localStorage.setItem("token", response.token);
        const role = response.role || formData.get("role") || "JOBSEEKER";
        localStorage.setItem("role", role);

        if (role === "EMPLOYER") {
          navigate("/dashboard/employer");
        } else {
          navigate("/dashboard/jobseeker");
        }
        return { ...prevState, error: null, success: true };
      } else {
        return {
          ...prevState,
          error: response?.message || "Something went wrong. Please try again.",
          success: false,
        };
      }
    } catch (error) {
      return {
        ...prevState,
        error: "Network error. Please check your connection.",
        success: false,
      };
    }
  }

  const [state, formAction, isPending] = useActionState(authAction, {
    error: null,
    success: false,
  });

  const handleToggle = (loginMode) => {
    setIsLogin(loginMode);
  };

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    background: "#fafafa",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <div style={{
        background: "white", borderRadius: "24px", padding: "48px 40px",
        width: "100%", maxWidth: "420px", boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px", height: "52px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            borderRadius: "14px", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 16px",
            boxShadow: "0 8px 20px rgba(37,99,235,0.35)",
          }}>
            <span style={{ color: "white", fontSize: "26px", fontWeight: "800", fontFamily: "'Syne', sans-serif" }}>J</span>
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: "800",
            color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.5px",
          }}>
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            {isLogin ? "Sign in to your JobPortal account" : "Join millions of job seekers today"}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div style={{
          display: "flex", background: "#f1f5f9",
          borderRadius: "10px", padding: "4px", marginBottom: "28px",
        }}>
          {["Login", "Register"].map((tab) => (
            <button key={tab} onClick={() => handleToggle(tab === "Login")} style={{
              flex: 1, padding: "8px", border: "none", borderRadius: "8px",
              fontSize: "13px", fontWeight: "600", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
              background: (isLogin ? "Login" : "Register") === tab ? "white" : "transparent",
              color: (isLogin ? "Login" : "Register") === tab ? "#0f172a" : "#64748b",
              boxShadow: (isLogin ? "Login" : "Register") === tab ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input type="hidden" name="isLogin" value={isLogin ? "true" : "false"} />
          {!isLogin && (
            <>
              <input type="text" name="fname" placeholder="Full Name" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
              <input type="text" name="phone" placeholder="Phone Number" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </>
          )}

          <input type="email" name="email" placeholder="Email address" style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
          <input type="password" name="password" placeholder="Password" style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />

          {!isLogin && (
            <select name="role" style={inputStyle}>
              <option value="JOBSEEKER">🧑‍💻 Job Seeker</option>
              <option value="EMPLOYER">🏢 EMPLOYER</option>
            </select>
          )}

          {state.error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "10px 14px",
              fontSize: "13px", color: "#dc2626", fontWeight: "500",
            }}>
              ⚠️ {state.error}
            </div>
          )}

          <button type="submit" disabled={isPending} style={{
            width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            fontSize: "15px", fontWeight: "700",
            cursor: isPending ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            background: isPending ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white", boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
            marginTop: "4px", transition: "all 0.2s",
          }}>
            {isPending ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#94a3b8" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => handleToggle(!isLogin)}
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}>
            {isLogin ? "Register free" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}