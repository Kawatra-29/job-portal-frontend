import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../Hooks/useApi";

const skillLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

export default function EditProfile() {
  const navigate = useNavigate();
  const { get, put, loading, error } = useApi();
  const [formData, setFormData] = useState({
    headline: "",
    summary: "",
    location: "",
    yearsOfExperience: 0,
    expectedSalary: 0,
    availability: "OPEN_TO_WORK",
    skills: [],
  });
  const [newSkill, setNewSkill] = useState({ name: "", level: "INTERMEDIATE" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await get("http://localhost:8080/api/v1/jobseekers/me");
      if (result) {
        setFormData({
          headline: result.headline || "",
          summary: result.summary || "",
          location: result.location || "",
          yearsOfExperience: result.yearsOfExperience || 0,
          expectedSalary: result.expectedSalary || 0,
          availability: result.availability || "OPEN_TO_WORK",
          skills: result.skills || [],
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
    if (newSkill.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, { skillName: newSkill.name.trim(), proficiencyLevel: newSkill.level }],
      }));
      setNewSkill({ name: "", level: "INTERMEDIATE" });
    }
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

    const payload = {
      headline: formData.headline,
      summary: formData.summary,
      location: formData.location,
      yearsOfExperience: formData.yearsOfExperience,
      expectedSalary: formData.expectedSalary,
      availability: formData.availability,
      skills: formData.skills.map((skill) => ({
        skillName: skill.skillName || skill.skill || skill.name,
        proficiencyLevel: skill.proficiencyLevel || skill.level || "INTERMEDIATE",
      })),
    };

    const result = await put("http://localhost:8080/api/v1/jobseekers/me", payload);
    setSaving(false);

    if (result) {
      setSaveSuccess(true);
      setTimeout(() => navigate("/dashboard/jobseeker"), 1500);
    } else {
      setSaveError("Failed to save profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-['DM_Sans'] flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['DM_Sans'] p-6">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard/jobseeker")}
            className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="font-['Syne'] text-2xl font-bold text-slate-900">Edit Profile</h1>
          <div className="w-16" />
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Basic Information
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Headline</label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer | React & Node.js"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Summary</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Contact & Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="OPEN_TO_WORK">Open to Work</option>
                  <option value="NOT_LOOKING">Not Looking</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Experience & Salary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Experience & Salary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Expected Salary (₹/year)</label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  min="0"
                  step="10000"
                  placeholder="e.g. 1200000"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Skills
            </h2>

            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                  >
                    <span className="font-semibold text-sm text-slate-900">
                      {skill.skillName || skill.skill || skill.name}
                    </span>
                    <span className="text-[11px] font-semibold uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                      {skill.proficiencyLevel || skill.level || "INTERMEDIATE"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-500 hover:text-red-700 text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Add a skill..."
                className="flex-1 min-w-40 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              />
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
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
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}