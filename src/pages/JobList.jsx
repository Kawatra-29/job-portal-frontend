import useFetch from "../Hooks/useFetch";
import JobCard from "../components/JobCard";

export default function JobList() {
  const {
    data: jobs,
    loading,
    error,
  } = useFetch("http://localhost:8080/api/v1/jobs?page=0&size=10");

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-6">
        {!loading ? (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : loading ? (
          <p>Loading jobs...</p>
        ) : (
          <p>No jobs found or error occurred.</p>
        )}
      </div>
    </div>
  );
}
