import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Apply from "./pages/Apply";
import CompanyDetail from "./pages/CompanyDetail";
import MyApplications from "./pages/MyApplications";
import SavedJobs from "./pages/SavedJobs";
import Resume from "./pages/Resume";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply/:jobId"
        element={
          <ProtectedRoute>
            <Apply />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-analysis"
        element={
          <ProtectedRoute>
            <ResumeAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/:company"
        element={
          <ProtectedRoute>
            <CompanyDetail />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}

export default App;
