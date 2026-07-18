import CompanyCard from "./CompanyCard";
import useApi from "../Hooks/useApi";

function Companies() {
  const { data, loading, error } = useApi("/jobs?size=100");

  // Extract unique companies from jobs
  const companyList = data?.content?.reduce((acc, job) => {
    if (job.companyName && !acc.find(c => c.name === job.companyName)) {
      acc.push({
        id: job.id,
        name: job.companyName,
        location: job.location || "Location not specified",
        isVerified: job.isVerified,
      });
    }
    return acc;
  }, []) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <h1 className="text-4xl font-['Syne'] font-extrabold text-center py-10 bg-slate-100 dark:bg-slate-900 border-b-2 border-blue-500 text-slate-900 dark:text-white transition-colors duration-200">
        Companies
      </h1>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-500">
          Failed to load companies: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {companyList.map((company) => (
            <CompanyCard key={company.id} companies={company} />
          ))}
        </div>
      )}

      {!loading && !error && companyList.length === 0 && (
        <div className="text-center py-10 text-slate-500">
          No companies found
        </div>
      )}
    </div>
  );
}

export default Companies;
