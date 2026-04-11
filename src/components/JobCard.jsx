function JobCard({ job }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-xl text-gray-900">{job.title}</h3>
          <p className="text-blue-600 font-medium mt-1">{job.company}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {job.type}
        </span>
      </div>

      <div className="space-y-3 text-gray-600">
        <p className="flex items-center gap-2">
          📍 {job.location}
        </p>
        <p className="flex items-center gap-2">
          💰 {job.salary}
        </p>
      </div>

      <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors">
        View Details
      </button>
    </div>
  );
}

export default JobCard;