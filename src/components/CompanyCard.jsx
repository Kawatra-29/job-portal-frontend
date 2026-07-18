import { memo } from "react";

const colors = [
  "#2563eb", "#7c3aed", "#db2777", "#16a34a", "#d97706",
  "#dc2626", "#0891b2", "#9333ea", "#ca8a04", "#0d9488",
];

// Memoized to prevent re-render when parent re-renders with same props
const CompanyCard = memo(function CompanyCard({ companies, index = 0 }) {
  const color = colors[index % colors.length];
  const initials = companies.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200">
      {/* Logo avatar */}
      <div className="w-13 h-13 rounded-xl border-2 flex items-center justify-center font-['Syne'] font-extrabold text-lg"
        style={{ backgroundColor: `${color}18`, borderColor: `${color}30`, color }}>
        {initials}
      </div>

      <div className="flex-1">
        <h2 className="font-['Syne'] text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
          {companies.name}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
          📍 {companies.location}
        </p>
      </div>

      <button className="w-full py-2.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer hover:text-white"
        style={{ backgroundColor: `${color}10`, borderColor: `${color}30`, color }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = color;
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${color}10`;
          e.currentTarget.style.color = color;
        }}>
        View Jobs →
      </button>
    </div>
  );
});

export default CompanyCard;
