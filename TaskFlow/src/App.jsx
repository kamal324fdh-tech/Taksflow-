import { Routes, Route } from "react-router-dom";
import Navbar from "./components/landing/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import AllTasks from "./pages/AllTasks";
import ActivityTimeline from "./pages/ActivityTimeline";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/app/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><Home /></>} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="tasks" element={<AllTasks />} />
        <Route path="activity" element={<ActivityTimeline />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;