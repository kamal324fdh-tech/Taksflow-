import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  confirmPasswordReset,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
} from "firebase/auth";
import AuthLayout from "../layouts/AuthLayout";
import { auth } from "../firebase";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseAuthError";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const actionCode = searchParams.get("oobCode");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(actionCode ? "checking" : "request");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!actionCode) return;

    let active = true;
    verifyPasswordResetCode(auth, actionCode)
      .then((verifiedEmail) => {
        if (!active) return;
        setEmail(verifiedEmail);
        setStatus("reset");
      })
      .catch(() => {
        if (!active) return;
        setStatus("invalid");
      });

    return () => {
      active = false;
    };
  }, [actionCode]);

  const handleRequest = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setStatus("sending");
    try {
      await sendPasswordResetEmail(auth, email.trim(), {
        url: `${window.location.origin}/forgot-password`,
        handleCodeInApp: true,
      });
      setStatus("sent");
      setMessage("If an account exists for that email, a password reset link is on its way.");
    } catch (requestError) {
      if (requestError.code === "auth/user-not-found") {
        setStatus("sent");
        setMessage("If an account exists for that email, a password reset link is on its way.");
        return;
      }
      setStatus("request");
      setError(getFirebaseAuthErrorMessage(requestError));
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setStatus("saving");
    try {
      await confirmPasswordReset(auth, actionCode, password);
      setStatus("complete");
    } catch (resetError) {
      setStatus("reset");
      setError(getFirebaseAuthErrorMessage(resetError));
    }
  };

  if (status === "checking") {
    return <AuthLayout title="Checking reset link" subtitle="Verifying your one-time email code…" />;
  }

  if (status === "invalid") {
    return (
      <AuthLayout title="Reset link expired" subtitle="This password reset link is invalid or has already been used.">
        <Link to="/forgot-password" className="text-sm font-medium text-accent hover:underline">
          Request a new reset link
        </Link>
      </AuthLayout>
    );
  }

  if (status === "complete") {
    return (
      <AuthLayout title="Password updated" subtitle="Your password has been changed successfully.">
        <Link to="/login" className="inline-flex w-full justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-cream hover:opacity-90">
          Return to log in
        </Link>
      </AuthLayout>
    );
  }

  if (actionCode) {
    return (
      <AuthLayout title="Choose a new password" subtitle={`Set a new password for ${email}.`}>
        <form onSubmit={handleReset} noValidate className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">New password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={!!error}
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-ink">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={!!error}
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {error && <p role="alert" className="text-sm text-accent">{error}</p>}
          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "saving" ? "Updating…" : "Change password"}
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot your password?" subtitle="We’ll email you a one-time link to reset it.">
      <form onSubmit={handleRequest} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={!!error}
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        {error && <p role="alert" className="text-sm text-accent">{error}</p>}
        {message && <p role="status" className="text-sm text-muted">{message}</p>}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Remembered it? <Link to="/login" className="font-medium text-ink hover:text-accent">Log in</Link>
      </p>
    </AuthLayout>
  );
}
