import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseAuthError";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match.";
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await register(form.name, form.email, form.password);
        navigate("/app");
      } catch (error) {
        setErrors({ form: getFirebaseAuthErrorMessage(error) });
      }
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start organizing your work in minutes.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full px-3 py-2.5 rounded-md border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-accent">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full px-3 py-2.5 rounded-md border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-accent">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="w-full px-3 py-2.5 rounded-md border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-accent">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink mb-1.5">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            className="w-full px-3 py-2.5 rounded-md border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {errors.confirmPassword && (
            <p id="confirm-error" className="mt-1.5 text-xs text-accent">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.form && <p role="alert" className="text-sm text-accent">{errors.form}</p>}
        <button
          type="submit"
          className="w-full mt-2 px-4 py-2.5 rounded-md text-sm font-medium bg-accent text-cream hover:opacity-90 transition-opacity"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-sm text-muted text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-ink font-medium hover:text-accent">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}