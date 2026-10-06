import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  // Firebase hasn't confirmed the session yet — wait rather than guess.
  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but hasn't clicked the verification link yet.
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}