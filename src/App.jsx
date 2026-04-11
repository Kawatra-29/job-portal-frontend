import JobCard from './components/JobCard';

function App() {
  const jobs = [
    {
      id: 1,
      title: "Full Stack Developer",
      company: "Springer Capital",
      location: "Remote",
      salary: "₹12 - 18 LPA",
      type: "Full Time"
    },
    {
      id: 2,
      title: "Backend Developer (Spring Boot)",
      company: "TechCorp India",
      location: "Delhi NCR",
      salary: "₹8 - 14 LPA",
      type: "Full Time"
    },
    {
      id: 3,
      title: "Frontend Developer (React)",
      company: "Innovate Solutions",
      location: "Bangalore",
      salary: "₹7 - 12 LPA",
      type: "Full Time"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600">
            Browse latest opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;