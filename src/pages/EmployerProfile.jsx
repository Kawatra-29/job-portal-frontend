import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useEmployerProfile,
  useUserMe,
  useUpdateEmployerProfile,
  useUpdateUserMe,
  useUpdatePassword,
} from "../queries/employerQueries";
import { SidebarLayout } from "../components/SidebarLayout";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard/employer" },
  { icon: "📢", label: "Post a Job", path: "/post-job" },
  { icon: "📋", label: "My Job Posts", path: "/my-jobs" },
  { icon: "👥", label: "All Applicants", path: "/all-applicants" },
  { icon: "📅", label: "Interviews", path: "/interviews" },
  { icon: "👤", label: "My Profile", path: "/employer/profile", active: true },
];

const companySizeLabels = {
  STARTUP: "Startup (1–10)",
  SMALL: "Small (11–50)",
  MEDIUM: "Medium (51–200)",
  LARGE: "Large (201–1000)",
  ENTERPRISE: "Enterprise (1000+)",
};
const companySizeOptions = ["STARTUP", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"];

// ─── Reusable InfoCard ────────────────────────────────────────────────────────
function InfoCard({ icon, label, value, valueClass = "text-slate-900" }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
      <span className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-lg shrink-0 shadow-sm">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`font-semibold text-sm break-words ${valueClass}`}>
          {value || <span className="text-slate-400 font-normal italic">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Toast Banner ─────────────────────────────────────────────────────────────
function Toast({ type, message }) {
  if (!message) return null;
  const styles =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-red-50 border-red-200 text-red-600";
  return (
    <div className={`border px-5 py-3 rounded-xl flex items-center gap-2 font-medium text-sm ${styles}`}>
      {type === "success" ? "✅" : "⚠️"} {message}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, onEdit }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h2>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-all flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-violet-50"
        >
          ✏️ Edit
        </button>
      )}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-sm font-['DM_Sans']";

// ─── Action Buttons ───────────────────────────────────────────────────────────
function ActionButtons({ onCancel, onSave, saving, disabled }) {
  return (
    <div className="flex gap-3 justify-end pt-2">
      <button
        onClick={onCancel}
        className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={saving || disabled}
        className="px-6 py-2.5 bg-gradient-to-br from-violet-600 to-violet-800 text-white border-none rounded-xl text-sm font-bold cursor-pointer shadow-lg shadow-violet-500/35 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function EmployerProfile() {
  const navigate = useNavigate();

  // ── Data
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch } = useEmployerProfile();
  const { data: userInfo, isLoading: userLoading, refetch: refetchUser } = useUserMe();
  const { mutate: updateProfile, isPending: savingCompany } = useUpdateEmployerProfile();
  const { mutate: updateUser, isPending: savingUser } = useUpdateUserMe();
  const { mutate: updatePassword, isPending: savingPassword } = useUpdatePassword();

  const isLoading = profileLoading || userLoading;

  // ── Section edit states
  const [editSection, setEditSection] = useState(null); // "company" | "personal" | "password"

  // ── Company form
  const [companyForm, setCompanyForm] = useState({ companyName: "", companySize: "STARTUP", description: "" });

  // ── Personal form (PUT /api/v1/users/me uses fullName field per User schema)
  const [personalForm, setPersonalForm] = useState({ fullName: "", phone: "" });

  // ── Password form
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  // ── Feedback
  const [feedback, setFeedback] = useState({ type: null, message: null });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    if (type === "success") setTimeout(() => setFeedback({ type: null, message: null }), 3500);
  };

  // Populate forms when data loads
  useEffect(() => {
    if (profile) {
      setCompanyForm({
        companyName: profile.companyName || "",
        companySize: profile.companySize || "STARTUP",
        description: profile.description || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (userInfo) {
      setPersonalForm({ fullName: userInfo.fname || "", phone: userInfo.phone || "" });
    }
  }, [userInfo]);

  const cancelEdit = () => {
    setEditSection(null);
    setFeedback({ type: null, message: null });
    // Reset forms to last saved values
    if (profile) setCompanyForm({ companyName: profile.companyName || "", companySize: profile.companySize || "STARTUP", description: profile.description || "" });
    if (userInfo) setPersonalForm({ fullName: userInfo.fname || "", phone: userInfo.phone || "" });
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  // ── Save handlers
  const saveCompany = () => {
    if (!companyForm.companyName.trim()) return showFeedback("error", "Company name is required.");
    setFeedback({ type: null, message: null });
    updateProfile(companyForm, {
      onSuccess: () => { showFeedback("success", "Company profile updated successfully!"); setEditSection(null); refetch(); },
      onError: (err) => showFeedback("error", err?.response?.data?.message || "Failed to update company profile."),
    });
  };

  const savePersonal = () => {
    if (!personalForm.fullName.trim()) return showFeedback("error", "Full name is required.");
    setFeedback({ type: null, message: null });
    // PUT /api/v1/users/me accepts User object; send fullName + phone
    updateUser({ fullName: personalForm.fullName, phone: personalForm.phone }, {
      onSuccess: () => { showFeedback("success", "Personal info updated successfully!"); setEditSection(null); refetchUser(); },
      onError: (err) => showFeedback("error", err?.response?.data?.message || "Failed to update personal info."),
    });
  };

  const savePassword = () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword) return showFeedback("error", "All password fields are required.");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return showFeedback("error", "New passwords do not match.");
    if (passwordForm.newPassword.length < 6) return showFeedback("error", "New password must be at least 6 characters.");
    setFeedback({ type: null, message: null });
    updatePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword }, {
      onSuccess: () => { showFeedback("success", "Password changed successfully!"); setEditSection(null); setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); },
      onError: (err) => showFeedback("error", err?.response?.data?.message || "Failed to change password. Check your current password."),
    });
  };

  // ── Loading state
  if (isLoading) {
    return (
      <SidebarLayout navItems={navItems} title="My Profile" subtitle="Employer Panel 🏢">
        <div className="max-w-4xl mx-auto space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/4 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </SidebarLayout>
    );
  }

  if (profileError && !profile) {
    return (
      <SidebarLayout navItems={navItems} title="My Profile" subtitle="Employer Panel 🏢">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="font-semibold">Failed to load profile. Please try again.</p>
            <button onClick={() => refetch()} className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all">
              Retry
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const displayName = userInfo?.fname || localStorage.getItem("name") || "Employer";
  const initials = displayName.split(" ").map((w) => w[0]).join("").toUpperCase();
  const isVerified = profile?.isVerified;

  return (
    <SidebarLayout navItems={navItems} title="My Profile" subtitle="Employer Panel 🏢">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Toast */}
        <Toast type={feedback.type} message={feedback.message} />

        {/* ── Hero Card ─────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-6 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center font-extrabold text-3xl text-white shrink-0 shadow-xl ring-4 ring-white/10">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="font-['Syne'] text-2xl font-extrabold text-white tracking-tight">{displayName}</h1>
                {isVerified ? (
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-2.5 py-1 rounded-full">✓ Verified</span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full">⏳ Pending Verification</span>
                )}
              </div>
              <p className="text-violet-300 text-sm font-semibold">
                {profile?.companyName || "Company name not set"} • {companySizeLabels[profile?.companySize] || "Size not set"}
              </p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                {userInfo?.email && <span>✉️ {userInfo.email}</span>}
                {userInfo?.phone && <span>📱 {userInfo.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Company Information ────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <SectionHeader
            title="Company Information"
            onEdit={editSection !== "company" ? () => { cancelEdit(); setEditSection("company"); } : null}
          />

          {editSection === "company" ? (
            <div className="space-y-4">
              <Field label="Company Name" required>
                <input type="text" value={companyForm.companyName} onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })} placeholder="e.g. Acme Corporation" className={inputCls} />
              </Field>
              <Field label="Company Size">
                <select value={companyForm.companySize} onChange={(e) => setCompanyForm({ ...companyForm, companySize: e.target.value })} className={`${inputCls} bg-white`}>
                  {companySizeOptions.map((s) => <option key={s} value={s}>{companySizeLabels[s]}</option>)}
                </select>
              </Field>
              <Field label="Description">
                <textarea rows={5} value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} placeholder="Describe your company…" className={`${inputCls} resize-none`} />
              </Field>
              <ActionButtons onCancel={cancelEdit} onSave={saveCompany} saving={savingCompany} disabled={!companyForm.companyName.trim()} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon="🏢" label="Company Name" value={profile?.companyName} />
                <InfoCard icon="📊" label="Company Size" value={companySizeLabels[profile?.companySize]} />
                <InfoCard icon="✅" label="Verification" value={isVerified ? "Verified" : "Pending"} valueClass={isVerified ? "text-green-600" : "text-amber-600"} />
                <InfoCard icon="#️⃣" label="Employer ID" value={`#${profile?.id}`} />
              </div>
              {profile?.description && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">About</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{profile.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Personal Information ───────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <SectionHeader
            title="Personal Information"
            onEdit={editSection !== "personal" ? () => { cancelEdit(); setEditSection("personal"); } : null}
          />

          {editSection === "personal" ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-blue-700 text-sm">
                ℹ️ <strong>Note:</strong> Email cannot be changed here. To change your email, contact support.
              </div>
              <Field label="Full Name" required>
                <input type="text" value={personalForm.fullName} onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })} placeholder="Your full name" className={inputCls} />
              </Field>
              <Field label="Phone Number">
                <input type="tel" value={personalForm.phone} onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })} placeholder="+91 9876543210" className={inputCls} />
              </Field>
              <ActionButtons onCancel={cancelEdit} onSave={savePersonal} saving={savingUser} disabled={!personalForm.fullName.trim()} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon="👤" label="Full Name" value={userInfo?.fname} />
              <InfoCard icon="✉️" label="Email" value={userInfo?.email} />
              <InfoCard icon="📱" label="Phone" value={userInfo?.phone} />
              <InfoCard icon="🎭" label="Role" value={userInfo?.role} />
            </div>
          )}
        </div>

        {/* ── Change Password ────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <SectionHeader
            title="Change Password"
            onEdit={editSection !== "password" ? () => { cancelEdit(); setEditSection("password"); } : null}
          />

          {editSection === "password" ? (
            <div className="space-y-4">
              <Field label="Current Password" required>
                <input type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} placeholder="Enter current password" className={inputCls} autoComplete="current-password" />
              </Field>
              <Field label="New Password" required>
                <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Min. 6 characters" className={inputCls} autoComplete="new-password" />
              </Field>
              <Field label="Confirm New Password" required>
                <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Re-enter new password" className={inputCls} autoComplete="new-password" />
              </Field>
              {/* Strength indicator */}
              {passwordForm.newPassword.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${passwordForm.newPassword.length >= i * 3 ? (passwordForm.newPassword.length >= 10 ? "bg-green-500" : passwordForm.newPassword.length >= 7 ? "bg-amber-500" : "bg-red-400") : "bg-slate-200"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    {passwordForm.newPassword.length < 6 ? "Too short" : passwordForm.newPassword.length < 10 ? "Fair" : "Strong"}
                  </p>
                </div>
              )}
              {/* Match indicator */}
              {passwordForm.confirmPassword.length > 0 && (
                <p className={`text-xs font-medium ${passwordForm.newPassword === passwordForm.confirmPassword ? "text-green-600" : "text-red-500"}`}>
                  {passwordForm.newPassword === passwordForm.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
              <ActionButtons
                onCancel={cancelEdit}
                onSave={savePassword}
                saving={savingPassword}
                disabled={!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              />
            </div>
          ) : (
            <div className="flex items-center gap-4 py-2">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">🔒</div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Password</p>
                <p className="text-xs text-slate-500 mt-0.5">Click "Edit" to change your password</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </SidebarLayout>
  );
}
