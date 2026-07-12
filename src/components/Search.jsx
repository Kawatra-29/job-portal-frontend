
const Search = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-2xl p-2 pl-5 flex items-center gap-2 shadow-2xl w-full max-w-xl flex-wrap">
        <span className="text-xl">🔍</span>
        <input
          type="text"
          placeholder="Job title, skills, or company"
          className="border-none outline-none text-base text-slate-900 font-['DM_Sans'] flex-1 min-w-36 py-2.5 bg-transparent"
        />
        <div className="w-px h-7 bg-slate-200" />
        <span className="text-lg">📍</span>
        <input
          type="text"
          placeholder="City or remote"
          className="border-none outline-none text-base text-slate-900 font-['DM_Sans'] flex-1 min-w-28 py-2.5 bg-transparent"
        />
        <button type="submit" className="bg-linear-to-br from-blue-600 to-blue-800 text-white border-none rounded-xl px-7 py-3 text-sm font-semibold cursor-pointer shadow-lg shadow-blue-500/40 transition-all hover:-translate-y-0.5">
          Search Jobs
        </button>
      </div>
    </div>
  );
};

export default Search;
