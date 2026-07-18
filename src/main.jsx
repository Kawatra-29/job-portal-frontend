import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    }
  }
})


// eslint-disable-next-line react-refresh/only-export-components
function Layout() {
  const location = useLocation();
  const hiddenNavPrefixes = [
    "/dashboard/jobseeker",
    "/dashboard/employer",
    "/post-job",
    "/me/edit",
    "/me",
    "/company-profile",
    "/employer/profile",
    "/my-jobs",
    "/all-applicants",
    "/interviews",
  ];
  const showNav = !hiddenNavPrefixes.some((prefix) => location.pathname.startsWith(prefix));

  return (
    <>
      {showNav && <Navbar />}
      <App />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <Layout />
            </QueryClientProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </BrowserRouter>
);
