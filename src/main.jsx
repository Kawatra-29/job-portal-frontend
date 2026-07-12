import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    }
  }
})


function Layout() {
  const location = useLocation();
  const hiddenNavRoutes = ["/dashboard/jobseeker", "/dashboard/employer", "/dashboard/EMPLOYER", "/post-job", "/auth", "/me/edit"];
  const showNav = !hiddenNavRoutes.includes(location.pathname);

  return (
    <>
      {showNav && <Navbar />}
      <App />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Layout />
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
);
