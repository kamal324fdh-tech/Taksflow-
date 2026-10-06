import { useState } from "react";
import { Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmailBanner() {
  const { user, refreshUser, resendVerificationEmail } = useAuth();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | checking

  if (!user || user.emailVerified) return null;

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

  const handleRefresh = async () => {
    setStatus("checking");
    await refreshUser();
    // If still unverified after refreshing, drop back to idle so the
    // banner's buttons are usable again instead of stuck on "Checking…".
    setStatus("idle");
  };

  return (
    <div className="bg-accent-light border-b border-accent/30 px-6 py-2.5 flex flex-wrap items-center gap-3">
      <Mail size={15} className="text-accent shrink-0" />
      <p className="text-sm text-ink">
        Verify your email to secure your account.{" "}
        {status === "sent" && <span className="text-muted">Check your inbox — link sent.</span>}
      </p>
      <div className="ml-auto flex items-center gap-2 shrink-0">
        <button
          onClick={handleResend}
          disabled={status === "sending"}
          className="text-xs px-2.5 py-1.5 rounded-md border border-line text-ink hover:bg-white disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Resend email"}
        </button>
        <button
          onClick={handleRefresh}
          disabled={status === "checking"}
          className="text-xs px-2.5 py-1.5 rounded-md bg-accent text-cream hover:opacity-90 disabled:opacity-60"
        >
          {status === "checking" ? "Checking…" : "I've verified"}
        </button>
      </div>
    </div>
  );
}