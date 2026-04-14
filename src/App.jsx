import { useState } from 'react';
import JobCard from './components/JobCard';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const jobs = [
    {
      id: 1,
      title: "Full Stack Developer",
      company: "Springer Capital",
      location: "Remote",
      salary: "₹12 - 18 LPA",
      experience: "2-4 years",
      type: "Full Time"
    },
    {
      id: 2,
      title: "Backend Developer (Spring Boot)",
      company: "TechCorp India",
      location: "Delhi NCR",
      salary: "₹8 - 14 LPA",
      experience: "1-3 years",
      type: "Full Time"
    },
    {
      id: 3,
      title: "Frontend Developer (React)",
      company: "Innovate Solutions",
      location: "Bangalore",
      salary: "₹7 - 12 LPA",
      experience: "1-3 years",
      type: "Full Time"
    },
    {
      id: 4,
      title: "Java Developer",
      company: "FinTech Pvt Ltd",
      location: "Hyderabad",
      salary: "₹6 - 11 LPA",
      experience: "0-2 years",
      type: "Full Time"
    }
  ];

  // Filter jobs based on search
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600">
            Discover opportunities matching your skills
          </p>
        </div>

        {/* Search Bar - Day 3 Feature */}
        <div className="max-w-2xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 text-lg"
          />
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3 py-10">
              No jobs found matching your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;