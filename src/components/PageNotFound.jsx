import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-['DM_Sans'] text-center px-6">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <div className="font-['Syne'] text-8xl font-extrabold text-slate-200 leading-none tracking-tighter mb-4">
        404
      </div>

      <h1 className="font-['Syne'] text-2xl font-extrabold text-slate-900 mb-3">
        Page not found
      </h1>

      <p className="text-slate-500 text-base max-w-96 leading-relaxed mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/home" className="no-underline bg-linear-to-br from-blue-600 to-blue-800 text-white px-7 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/35">
        ← Back to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
