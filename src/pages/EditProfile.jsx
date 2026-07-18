import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../Hooks/useApi";
import { ThemeContext } from "../context/ThemeContext.jsx";

const skillLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

export default function EditProfile() {
  const navigate = useNavigate();
  const { get, put: putSeeker, loading, error } = useApi();
  const { put: putUser } = useApi();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    headline: "",
    summary: "",
    location: "",
    yearsOfExperience: 0,
    expectedSalary: 0,
    availability: "OPEN_TO_WORK",
    skills: [],
  });
  const [availableSkills, setAvailableSkills] = useState([]); // Backend se aane wali skill list
  const [newSkill, setNewSkill] = useState({ skillId: "", skillName: "", level: "INTERMEDIATE" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Dono requests parallel mein chalao
      const [skillsList, profileResult] = await Promise.all([
        get("/skills"),
        get("/jobseekers/me"),
      ]);

      // Available skills state mein save karo
      const skills = skillsList || [];
      setAvailableSkills(skills);

      if (profileResult) {
        // Profile ki existing skills ko skillId se match karo
        const mappedSkills = (profileResult.skills || [])
          .map((s) => {
            const skillName = s.name || s.skillName || "";
            const found = skills.find(
              (av) => av.name.toLowerCase() === skillName.toLowerCase()
            );
            return found
              ? { skillId: found.id, skillName: found.name, proficiencyLevel: s.proficiencyLevel || "INTERMEDIATE" }
              : null;
          })
          .filter(Boolean); // null wale hata do (unmatched skills)

        setFormData({
          fullName: profileResult.user?.fname || "",
          phone: profileResult.user?.phone || "",
          headline: profileResult.headline || "",
          summary: profileResult.summary || "",
          location: profileResult.location || "",
          yearsOfExperience: profileResult.yearsOfExperience || 0,
          expectedSalary: profileResult.expectedSalary || 0,
          availability: profileResult.availability || "OPEN_TO_WORK",
          skills: mappedSkills,
        });
      }
    };
    fetchData();
  }, [get]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.skillId) return; // Koi skill select nahi ki

    // Duplicate check — same skill dobara mat add hone do
    const alreadyAdded = formData.skills.some(
      (s) => s.skillId === parseInt(newSkill.skillId)
    );
    if (alreadyAdded) return;

    setFormData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          skillId: parseInt(newSkill.skillId),
          skillName: newSkill.skillName,
          proficiencyLevel: newSkill.level,
        },
      ],
    }));
    setNewSkill({ skillId: "", skillName: "", level: "INTERMEDIATE" }); // Reset
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const userPayload = {
      fullName: formData.fullName,
      phone: formData.phone
    };

    const seekerPayload = {
      headline: formData.headline,
      summary: formData.summary,
      location: formData.location,
      yearsOfExperience: formData.yearsOfExperience,
      expectedSalary: formData.expectedSalary,
      availability: formData.availability,
      skills: formData.skills.map((skill) => ({
        skillId: skill.skillId,           // Backend ko ID chahiye
        level: skill.proficiencyLevel,    // Backend field name: level
      })),
    };

    const userResult = await putUser("/users/me", userPayload);
    const seekerResult = await putSeeker("/jobseekers/me", seekerPayload);
    setSaving(false);

    if (userResult && seekerResult) {
      setSaveSuccess(true);
      setTimeout(() => navigate("/dashboard/jobseeker"), 1500);
    } else {
      setSaveError("Failed to save profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] flex items-center justify-center transition-colors duration-200">
        <div className="text-slate-500 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['DM_Sans'] p-6 transition-colors duration-200">

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard/jobseeker")}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="font-['Syne'] text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            Error loading profile: {error}
          </div>
        )}

        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            Profile saved successfully! Redirecting...
          </div>
        )}

        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {saveError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors duration-200">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Basic Information
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Headline</label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer | React & Node.js"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Summary</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors duration-200">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Contact & Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="OPEN_TO_WORK" className="dark:bg-slate-900">Open to Work</option>
                  <option value="NOT_LOOKING" className="dark:bg-slate-900">Not Looking</option>
                  <option value="FREELANCE" className="dark:bg-slate-900">Freelance</option>
                  <option value="FULL_TIME" className="dark:bg-slate-900">Full Time</option>
                  <option value="PART_TIME" className="dark:bg-slate-900">Part Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Experience & Salary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors duration-200">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Experience & Salary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Expected Salary (₹/year)</label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  min="0"
                  step="10000"
                  placeholder="e.g. 1200000"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-555"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors duration-200">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Skills
            </h2>

            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-lg px-3 py-2"
                  >
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-200">
                      {skill.skillName || skill.skill || skill.name}
                    </span>
                    <span className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                      {skill.proficiencyLevel || skill.level || "INTERMEDIATE"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-500 hover:text-red-700 text-lg leading-none border-none bg-transparent cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              {/* Skill Dropdown — backend se aai list */}
              <select
                value={newSkill.skillId}
                onChange={(e) => {
                  const selected = availableSkills.find(
                    (s) => s.id === parseInt(e.target.value)
                  );
                  setNewSkill({
                    skillId: e.target.value,
                    skillName: selected ? selected.name : "",
                    level: newSkill.level,
                  });
                }}
                className="flex-1 min-w-40 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">-- Select a skill --</option>
                {availableSkills.map((skill) => (
                  <option key={skill.id} value={skill.id} className="dark:bg-slate-900">
                    {skill.name}
                  </option>
                ))}
              </select>

              {/* Proficiency Level */}
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level} className="dark:bg-slate-900">
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddSkill}
                disabled={!newSkill.skillId}
                className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium transition-all border-none cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard/jobseeker")}
              className="px-6 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all bg-transparent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}