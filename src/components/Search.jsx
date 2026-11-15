import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faLocationDot,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Search({ initialTitle = "", initialLocation = "", onSearch }) {
  const [title, setTitle] = useState(initialTitle);
  const [location, setLocation] = useState(initialLocation);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ title: title.trim(), location: location.trim() });
    } else {
      const params = new URLSearchParams();
      if (title.trim()) params.set("title", title.trim());
      if (location.trim()) params.set("location", location.trim());
      navigate(`/jobs?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 transition-all"
    >
      <div className="flex flex-col md:flex-row items-stretch gap-2">
        
        {/* Title / Role / Keyword Input */}
        <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-transparent focus-within:border-blue-500/40 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400 dark:text-slate-500 text-sm shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="search-title" className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-1">
              Job Title / Skill
            </label>
            <input
              id="search-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Java, React, Product Designer"
              className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none border-none p-0 leading-tight"
            />
          </div>
        </div>

        {/* Location Input */}
        <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-transparent focus-within:border-blue-500/40 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
          <FontAwesomeIcon icon={faLocationDot} className="text-slate-400 dark:text-slate-500 text-sm shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="search-location" className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-1">
              City / Work Location
            </label>
            <input
              id="search-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bangalore, Mumbai, Remote"
              className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none border-none p-0 leading-tight"
            />
          </div>
        </div>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer border-none shrink-0"
        >
          <span>Find Jobs</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
        </button>
      </div>
    </form>
  );
}
