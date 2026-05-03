import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, useLocation } from "react-router-dom";

// Dashboard routes pe Navbar nahi dikhni chahiye
function Layout() {
  const location = useLocation();
  const hiddenNavRoutes = ["/dashboard/jobseeker", "/dashboard/EMPLOYER"];
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
    <Layout />
  </BrowserRouter>
);