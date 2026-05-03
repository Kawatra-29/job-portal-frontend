import { Routes, Route, Navigate } from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import JobList from "./pages/JobList";
import HomePage from "./pages/HomePage";
import Companies from "./components/Companies";
import PageNotFound from "./components/PageNotFound";
import AuthPage from "./pages/AuthPage";
import JobSeekerDashboard from "./components/Jobseekerdashboard";
import EMPLOYERDashboard from "./components/Employerdashboard";

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
            <EMPLOYERDashboard />
          </RoleRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;