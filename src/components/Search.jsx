import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-[#fdfbf7] rounded-xl p-1.5 pl-4 flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.18)] w-full max-w-xl flex-wrap">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#8a847a] text-sm shrink-0" />
        <input
          type="text"
          placeholder="Job title, skills or company"
          className="border-none outline-none text-sm text-[#1f1b16] font-['DM_Sans'] flex-1 min-w-36 py-2 bg-transparent placeholder:text-[#8a847a]"
        />
        <div className="w-px h-5 bg-[#1f1b16]/10 shrink-0" />
        <FontAwesomeIcon icon={faLocationDot} className="text-[#8a847a] text-sm shrink-0" />
        <input
          type="text"
          placeholder="City or remote"
          className="border-none outline-none text-sm text-[#1f1b16] font-['DM_Sans'] flex-1 min-w-28 py-2 bg-transparent placeholder:text-[#8a847a]"
        />
        <button
          type="submit"
          className="bg-[#1a1714] text-[#efe9de] border-none rounded-lg px-6 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-150 hover:bg-[#2c2520] shrink-0"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
