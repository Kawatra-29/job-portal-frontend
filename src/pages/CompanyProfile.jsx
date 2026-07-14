import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useCompanyProfile, useUpdateCompanyProfile } from "../queries/employerQueries";
import { SidebarLayout } from "../components/SidebarLayout";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard/employer" },
  { icon: "📢", label: "Post a Job", path: "/post-job" },
  { icon: "📋", label: "My Job Posts", path: "/my-jobs" },
  { icon: "👥", label: "All Applicants", path: "/all-applicants" },
  { icon: "📅", label: "Interviews", path: "/interviews" },
  { icon: "👤", label: "My Profile", path: "/employer/profile" },
];

export default function CompanyProfile() {
  const navigate = useNavigate();
  const { data: profile, isLoading, error, refetch } = useCompanyProfile();
  const { mutate: updateProfile, isPending: saving } = useUpdateCompanyProfile();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      description: "",
      website: "",
      location: "",
      size: "1-10",
      industry: "",
      foundedYear: "",
      logoUrl: "",
      linkedinUrl: "",
      twitterUrl: "",
      facebookUrl: "",
    },
  });

  // Populate form when profile loads
  if (profile) {
    reset({
      name: profile.name || "",
      description: profile.description || "",
      website: profile.website || "",
      location: profile.location || "",
      size: profile.size || "1-10",
      industry: profile.industry || "",
      foundedYear: profile.foundedYear || "",
      logoUrl: profile.logoUrl || "",
      linkedinUrl: profile.linkedinUrl || "",
      twitterUrl: profile.twitterUrl || "",
      facebookUrl: profile.facebookUrl || "",
    });
  }

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      refetch();
      alert("Company profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleLogoPreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setValue("logoUrl", event.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <SidebarLayout
        navItems={navItems}
        title="Company Profile"
        subtitle="Employer Panel 🏢"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout
        navItems={navItems}
        title="Company Profile"
        subtitle="Employer Panel 🏢"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl">
            Failed to load company profile. Please try again.
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout
      navItems={navItems}
      title="Company Profile"
      subtitle="Employer Panel 🏢"
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Logo Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Company Logo
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                {profile?.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt={`${profile.name} logo`}
                    className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <span className="text-4xl">🏢</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Logo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoPreview}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB. Recommended: 200x200px</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name", { required: "Company name is required" })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
                <input
                  {...register("website", { pattern: { value: /^https?:\/\/.+/, message: "Include http:// or https://" } })}
                  placeholder="https://company.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
                {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                <input
                  {...register("location")}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Size</label>
                <select {...register("size")} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all bg-white">
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1001-5000">1001-5000 employees</option>
                  <option value="5000+">5000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                <input
                  {...register("industry")}
                  placeholder="e.g. Information Technology"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Founded Year</label>
                <input
                  {...register("foundedYear", { valueAsNumber: true, pattern: { value: /^\d{4}$/, message: "Enter a valid year (e.g. 2020)" } })}
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  placeholder="2020"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
                {errors.foundedYear && <p className="text-red-500 text-xs mt-1">{errors.foundedYear.message}</p>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Company Description
            </h2>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Describe your company culture, mission, values, and what makes you a great place to work..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-['Syne'] text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn</label>
                <input
                  {...register("linkedinUrl", { pattern: { value: /^https?:\/\/.+/, message: "Include https://" } })}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
                {errors.linkedinUrl && <p className="text-red-500 text-xs mt-1">{errors.linkedinUrl.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Twitter / X</label>
                <input
                  {...register("twitterUrl", { pattern: { value: /^https?:\/\/.+/, message: "Include https://" } })}
                  placeholder="https://twitter.com/..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
                {errors.twitterUrl && <p className="text-red-500 text-xs mt-1">{errors.twitterUrl.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Facebook</label>
                <input
                  {...register("facebookUrl", { pattern: { value: /^https?:\/\/.+/, message: "Include https://" } })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                />
                {errors.facebookUrl && <p className="text-red-500 text-xs mt-1">{errors.facebookUrl.message}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              to="/dashboard/employer"
              className="px-6 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-linear-to-br from-violet-600 to-violet-800 text-white border-none rounded-xl text-sm font-bold cursor-pointer shadow-lg shadow-violet-500/35 font-['DM_Sans'] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </SidebarLayout>
  );
}