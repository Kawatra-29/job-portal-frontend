import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load all route components for code splitting
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

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Protected Route — login nahi hai toh /auth pe redirect
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" replace />;
}

// Role-based Protected Route
function RoleRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/auth" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/auth" replace />;
  return children;
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/companies" element={<Companies />} />

        {/* Protected Routes */}
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

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;