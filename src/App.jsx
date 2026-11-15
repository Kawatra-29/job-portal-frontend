import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Lazy load all route components
const UserProfile = lazy(() => import("./pages/UserProfile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const JobList = lazy(() => import("./pages/JobList"));
const PostJob = lazy(() => import("./pages/PostJob"));
const HomePage = lazy(() => import("./pages/HomePage"));
const Companies = lazy(() => import("./components/Companies"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const JobSeekerDashboard = lazy(() => import("./components/Jobseekerdashboard"));
const EmployerDashboard = lazy(() => import("./components/Employerdashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));
const EmployerProfile = lazy(() => import("./pages/EmployerProfile"));
const AllApplicants = lazy(() => import("./pages/AllApplicants"));
const Interviews = lazy(() => import("./pages/Interviews"));
const MyJobs = lazy(() => import("./pages/MyJobs"));
const MyApplications = lazy(() => import("./pages/MyApplications"));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Protected Route — login required
function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);

  if (auth.loading) {
    return <LoadingFallback />;
  }

  return auth.isAuthenticated ? children : <Navigate to="/auth" replace />;
}

// Role-based Protected Route
function RoleRoute({ children, allowedRole }) {
  const { auth } = useContext(AuthContext);

  if (auth.loading) {
    return <LoadingFallback />;
  }

  if (!auth.isAuthenticated) return <Navigate to="/auth" replace />;
  if (allowedRole && auth.role !== allowedRole) {
    // Redirect to user's appropriate default dashboard
    if (auth.role === "EMPLOYER") return <Navigate to="/dashboard/employer" replace />;
    if (auth.role === "ADMIN") return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/dashboard/jobseeker" replace />;
  }
  return children;
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/companies" element={<Companies />} />

        {/* Job Seeker Protected Routes */}
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jobseeker"
          element={
            <RoleRoute allowedRole="JOBSEEKER">
              <JobSeekerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <RoleRoute allowedRole="JOBSEEKER">
              <MyApplications />
            </RoleRoute>
          }
        />

        {/* Employer Protected Routes */}
        <Route
          path="/dashboard/employer"
          element={
            <RoleRoute allowedRole="EMPLOYER">
              <EmployerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <RoleRoute allowedRole="EMPLOYER">
              <PostJob />
            </RoleRoute>
          }
        />
        <Route
          path="/company-profile"
          element={
            <RoleRoute allowedRole="EMPLOYER">
              <CompanyProfile />
            </RoleRoute>
          }
        />
        <Route
          path="/employer/profile"
          element={
            <RoleRoute allowedRole="EMPLOYER">
              <EmployerProfile />
            </RoleRoute>
          }
        />
        <Route
          path="/all-applicants"
          element={
            <RoleRoute allowedRole="EMPLOYER">
              <AllApplicants />
            </RoleRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <RoleRoute allowedRole="EMPLOYER">
              <Interviews />
            </RoleRoute>
          }
        />
        <Route
          path="/my-jobs"
          element={
            <RoleRoute allowedRole="EMPLOYER">
              <MyJobs />
            </RoleRoute>
          }
        />

        {/* Administrator Protected Route */}
        <Route
          path="/dashboard/admin"
          element={
            <RoleRoute allowedRole="ADMIN">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* 404 Not Found Catch-All */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
