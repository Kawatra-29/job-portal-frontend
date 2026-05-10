import Search from "../components/Search";

const stats = [
  { number: "5L+", label: "Active Jobs" },
  { number: "10K+", label: "Companies" },
  { number: "2M+", label: "Job Seekers" },
  { number: "95%", label: "Placement Rate" },
];

const features = [
  {
    icon: "💼",
    title: "5L+ Jobs",
    desc: "Explore over 5 lakh curated opportunities across all industries and experience levels.",
  },
  {
    icon: "🏢",
    title: "Top Companies",
    desc: "Connect with India's leading companies — from startups to Fortune 500 giants.",
  },
  {
    icon: "⚡",
    title: "Easy Apply",
    desc: "One-click applications with your saved profile. Apply to 10 jobs in under a minute.",
  },
  {
    icon: "🚀",
    title: "Fast Hiring",
    desc: "Get noticed faster with our smart matching algorithm that puts you in front of the right employers.",
  },
];

const HomePage = () => {
  return (
    <div className="font-['DM_Sans'] bg-slate-50">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-slate-900 via-slate-800 to-blue-800 px-6 pt-20 pb-32 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 left-[10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-blue-600/25 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 tracking-wide">
            🔥 India's Fastest Growing Job Platform
          </span>
          <h1 className="font-['Syne'] text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-5 tracking-tight">
            Find Your{" "}
            <span className="bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Dream Job
            </span>{" "}
            Today
          </h1>
          <p className="text-lg text-slate-400 mb-12 leading-relaxed">
            Over 5 lakh opportunities waiting for you. Connect with top companies and land your perfect role — faster than ever before.
          </p>

          <Search />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-200 p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-4 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-['Syne'] text-3xl font-extrabold text-blue-600">
                {s.number}
              </div>
              <div className="text-sm text-slate-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-['Syne'] text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Why Choose Us?
          </h2>
          <p className="text-slate-500 text-base">
            Everything you need to land your next opportunity, in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-slate-200 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 cursor-default"
            >
              <div className="text-4xl mb-4 w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-['Syne'] text-lg font-bold text-slate-900 mb-2">
                {f.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-linear-to-br from-blue-800 to-indigo-600 mx-6 mb-20 rounded-3xl px-10 py-14 text-center max-w-6xl">
        <h2 className="font-['Syne'] text-3xl font-extrabold text-white tracking-tight mb-3">
          Ready to get hired?
        </h2>
        <p className="text-blue-200 mb-8 text-base">
          Join 2 million+ professionals who found their dream jobs here.
        </p>
        <a
          href="/auth"
          className="inline-block bg-white text-blue-800 px-9 py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-shadow"
        >
          Create Free Account →
        </a>
      </section>
    </div>
  );
};

export default HomePage;
