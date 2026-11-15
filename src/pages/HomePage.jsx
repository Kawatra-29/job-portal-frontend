import Search from "../components/Search";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faBuilding,
  faBolt,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

const stats = [
  { number: "500K+", label: "Active jobs" },
  { number: "10K+", label: "Companies" },
  { number: "2M+", label: "Job seekers" },
  { number: "95%", label: "Placement rate" },
];

const features = [
  {
    icon: faBriefcase,
    title: "500K+ jobs",
    desc: "Opportunities across tech, finance, healthcare and more — from entry level to senior roles.",
  },
  {
    icon: faBuilding,
    title: "Top companies",
    desc: "Connect with India's leading employers — from seed-stage startups to established enterprises.",
  },
  {
    icon: faBolt,
    title: "One-tap apply",
    desc: "Apply with your saved profile. No repeated form-filling, no friction.",
  },
  {
    icon: faRocket,
    title: "Faster hiring",
    desc: "Smart matching puts your profile in front of the right employer, faster.",
  },
];

const HomePage = () => {
  return (
    <div className="font-['DM_Sans'] bg-[#f7f4ee] dark:bg-[#0f0f10] text-[#1f1b16] dark:text-[#efe9de]">
      <Helmet>
        <title>Stride — Find your next job in India</title>
        <meta name="description" content="Search 500,000+ jobs across India. Connect with top companies and apply in one tap on Stride." />
        <meta name="keywords" content="jobs, hiring, career, employer, jobseeker, India" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[#1a1714] px-6 pt-24 pb-32 relative overflow-hidden">
        {/* Subtle warm tint wash — stays behind content, no colored blob */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(180,140,80,0.07),transparent)]" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h1 className="font-['DM_Sans'] text-5xl sm:text-6xl font-medium text-[#efe9de] leading-[1.05] mb-5 tracking-[-0.02em]">
            Find your next job<br />in India
          </h1>
          <p className="text-lg text-[#aaa398] mb-10 leading-relaxed max-w-xl mx-auto font-normal">
            500,000 open roles across tech, ops, finance and more. Apply in one tap with your Stride profile.
          </p>

          <Search />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#fdfbf7] dark:bg-[#19191b] border-b border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-['DM_Sans'] text-3xl font-semibold text-[#1f1b16] dark:text-[#efe9de] tabular-nums">
                {s.number}
              </div>
              <div className="text-sm text-[#7b7266] dark:text-[#8a847a] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Stride */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="font-['DM_Sans'] text-3xl font-medium text-[#1f1b16] dark:text-[#efe9de] mb-2">
            Built for Indian job seekers
          </h2>
          <p className="text-[#5e554a] dark:text-[#aaa398] text-base">
            Everything you need to find and land your next role.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#fdfbf7] dark:bg-[#19191b] border border-[#1f1b16]/[0.08] dark:border-[#efe9de]/[0.08] rounded-2xl p-6 transition-colors duration-150 hover:border-[#1f1b16]/20 dark:hover:border-[#efe9de]/20 cursor-default"
            >
              <div className="w-10 h-10 bg-[#efe9df] dark:bg-[#232325] rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={f.icon} className="text-[#5e554a] dark:text-[#aaa398] text-base" />
              </div>
              <h3 className="font-['DM_Sans'] text-base font-medium text-[#1f1b16] dark:text-[#efe9de] mb-1.5">
                {f.title}
              </h3>
              <p className="text-[#5e554a] dark:text-[#8a847a] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#1a1714] mx-auto mb-20 rounded-2xl px-10 py-14 text-center max-w-6xl border border-[#efe9de]/[0.06]">
        <h2 className="font-['DM_Sans'] text-3xl font-medium text-[#efe9de] mb-3">
          Start your job search today
        </h2>
        <p className="text-[#aaa398] mb-8 text-base">
          Free for job seekers. Takes two minutes to set up.
        </p>
        <Link
          to="/auth?mode=register"
          className="inline-block bg-[#efe9de] text-[#1f1b16] px-8 py-3 rounded-xl font-medium text-sm transition-colors duration-150 hover:bg-white no-underline"
        >
          Create free account
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
