import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const { user, loading, isAuthenticated, refreshUser, resendVerificationEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | checking

  if (loading) return null;

  // No one logged in at all — nothing to verify, send them to log in.
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Already verified (e.g. they clicked the link, came back, and this page
  // re-rendered) — no reason to sit here, send them into the app.
  if (user.emailVerified) return <Navigate to="/app" replace />;

  const handleResend = async () => {
    setStatus("sending");
    try {
      await resendVerificationEmail();
      setStatus("sent");
    } catch {
      setStatus("idle");
      alert("Couldn't send the email right now. Please try again in a moment.");
    }
  };

  // Re-checks the real status from Firebase. If it's now verified, the
  // `user.emailVerified` check above sends them to /app on the next render.
  const handleCheck = async () => {
    setStatus("checking");
    await refreshUser();
    setStatus("idle");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5">
      <div className="w-full max-w-sm text-center">
        <div className="w-12 h-12 rounded-full bg-accent-light text-accent flex items-center justify-center mx-auto mb-5">
          <Mail size={22} />
        </div>
        <h1 className="text-xl font-bold text-ink tracking-tight">Verify your email</h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          We sent a verification link to <span className="text-ink font-medium">{user.email}</span>.
          Click the link, then come back here.
        </p>

        {status === "sent" && (
          <p className="mt-4 text-xs text-muted">Check your inbox — a new link was sent.</p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleCheck}
            disabled={status === "checking"}
            className="w-full px-4 py-2.5 rounded-md text-sm font-medium bg-accent text-cream hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {status === "checking" ? "Checking…" : "I've verified my email"}
          </button>
          <button
            onClick={handleResend}
            disabled={status === "sending"}
            className="w-full px-4 py-2.5 rounded-md text-sm border border-line text-ink hover:bg-accent-light disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Resend email"}
          </button>
        </div>

        <button onClick={handleLogout} className="mt-6 text-xs text-muted hover:text-ink">
          Log out and use a different account
        </button>
      </div>
    </div>
  );
}