import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import SidebarLayout from "./SidebarLayout";
import MyApplications from "../pages/MyApplications";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faMagnifyingGlass,
  faCheck,
  faCloudArrowUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

export default function JobSeekerDashboard() {
  const resumeInputId = useId();
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);

  // Fetch Candidate Profile
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["jobseeker", "me"],
    queryFn: async () => {
      const res = await apiClient.get("/jobseekers/me");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Candidate Applications
  const { data: applications, refetch: refetchApps, isLoading: appsLoading } = useQuery({
    queryKey: ["applications", "my"],
    queryFn: async () => {
      const res = await apiClient.get("/applications/my");
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 1000 * 60,
  });

  // Fetch Candidate Attached Skills
  const { data: skills, refetch: refetchSkills } = useQuery({
    queryKey: ["jobseeker", "skills"],
    queryFn: async () => {
      const res = await apiClient.get("/jobseekers/me/skills");
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const navItems = [
    {
      icon: "📊",
      label: "Dashboard Overview",
      path: "/dashboard/jobseeker",
      active: true,
    },
    {
      icon: "📋",
      label: "My Applications",
      path: "/my-applications",
    },
    {
      icon: "👤",
      label: "Profile & Resume",
      path: "/me",
    },
    {
      icon: "🔍",
      label: "Explore Jobs",
      path: "/jobs",
    },
  ];

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setResumeMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post("/jobseekers/me/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeMessage({ type: "success", text: "Resume uploaded successfully!" });
      refetchProfile();
    } catch {
      setResumeMessage({ type: "error", text: "Failed to upload resume. PDF/DOC up to 5MB." });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    setAddingSkill(true);
    try {
      await apiClient.post(`/jobseekers/me/skills?request=${encodeURIComponent(newSkillInput.trim())}`);
      setNewSkillInput("");
      refetchSkills();
    } catch {
      // Ignore
    } finally {
      setAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await apiClient.delete(`/jobseekers/me/skills/${skillId}`);
      refetchSkills();
    } catch {
      // Ignore
    }
  };

  const appList = applications || [];
  const shortlistedCount = appList.filter((a) => a.status === "SHORTLISTED").length;
  const interviewCount = appList.filter((a) => a.status === "INTERVIEW").length;
  const hiredCount = appList.filter((a) => a.status === "HIRED" || a.status === "ACCEPTED").length;

  return (
    <SidebarLayout
      navItems={navItems}
      title="Candidate Dashboard"
      subtitle="Track your applications, resume, and profile"
      actions={
        <Link
          to="/jobs"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors no-underline"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[10px]" />
          <span>Find Jobs</span>
        </Link>
      }
    >
      <Helmet>
        <title>Candidate Dashboard | STRIDE</title>
        <meta
          name="description"
          content="Review application status, manage resumes and skills in your personal Stride candidate dashboard."
        />
      </Helmet>

      <div className="space-y-8">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Applied</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">
                📋
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular">
              {appsLoading ? "..." : appList.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Submitted applications</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Shortlisted</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                ⭐
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular">
              {appsLoading ? "..." : shortlistedCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Passed initial review</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interviews</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">
                📅
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular">
              {appsLoading ? "..." : interviewCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Active interview stages</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Offers / Hired</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs">
                🎉
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular">
              {appsLoading ? "..." : hiredCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Confirmed offers</p>
          </div>
        </div>

        {/* Profile & Resume Quick Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Resume Upload Card */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base">
                  <FontAwesomeIcon icon={faFilePdf} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white m-0">Candidate Resume</h3>
                  <p className="text-xs text-slate-400 m-0">Uploaded to your profile</p>
                </div>
              </div>

              {resumeMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold mb-3 ${
                    resumeMessage.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  {resumeMessage.text}
                </div>
              )}

              {profile?.resumeUrl ? (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5 truncate">
                    <FontAwesomeIcon icon={faCheck} className="text-emerald-500 text-xs shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      Resume on file
                    </span>
                  </div>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                  >
                    View
                  </a>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs mb-4">
                  No resume attached yet. Upload a PDF/DOC so employers can review your credentials.
                </div>
              )}
            </div>

            <label
              htmlFor={resumeInputId}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors cursor-pointer text-center"
            >
              <FontAwesomeIcon icon={faCloudArrowUp} />
              <span>{uploadingResume ? "Uploading..." : "Upload New Resume"}</span>
              <input
                id={resumeInputId}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>

          {/* Candidate Skills Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white m-0">Skills & Competencies</h3>
                  <p className="text-xs text-slate-400 m-0">Employers search candidate profiles by these skills</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6 min-h-[48px]">
                {skills && skills.length > 0 ? (
                  skills.map((s) => (
                    <span
                      key={s.id || s.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700/80"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(s.id)}
                        className="text-slate-400 hover:text-rose-500 border-none bg-transparent cursor-pointer p-0 text-[10px]"
                        title="Remove skill"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills added yet.</span>
                )}
              </div>
            </div>

            <form onSubmit={handleAddSkill} className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add skill (e.g. React, Java, Docker)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={addingSkill || !newSkillInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 cursor-pointer border-none"
              >
                {addingSkill ? "Adding..." : "Add"}
              </button>
            </form>
          </div>
        </div>

        {/* Embedded Applications Component */}
        <div>
          <MyApplications
            applications={appList}
            loading={appsLoading}
            handleWithdraw={async (id) => {
              await apiClient.delete(`/applications/${id}`);
              refetchApps();
            }}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
