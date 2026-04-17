import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import JobList from "./pages/JobList";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/me" element={<UserProfile />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
