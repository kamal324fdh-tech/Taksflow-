import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTaskContext } from "../context/TaskContext";

const fieldClass =
  "w-full px-3 py-2.5 rounded-md border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { projects, tasks } = useTaskContext();

  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSavedMessage("");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const result = await updateUser({ name: form.name.trim(), email: form.email.trim() });
      setSavedMessage(
        result.emailChangeRequested
          ? "Name updated. Confirm your new email address to finish changing it."
          : "Profile updated."
      );
    } catch (error) {
      setErrors({ form: error.message });
    }
  };

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const initial = form.name ? form.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-8">
      <h1 className="text-2xl font-bold text-ink tracking-tight mb-6">Profile</h1>

      <div className="bg-white border border-line rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-ink text-cream flex items-center justify-center text-xl font-semibold shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-ink truncate">{user?.name}</div>
            <div className="text-sm text-muted truncate">{user?.email}</div>
          </div>
        </div>

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
              className={fieldClass}
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
              className={fieldClass}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-accent">{errors.email}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-cream hover:opacity-90 transition-opacity"
            >
              Save changes
            </button>
            {savedMessage && <span role="status" className="text-xs text-muted">{savedMessage}</span>}
          </div>
          {errors.form && <p role="alert" className="text-sm text-accent">{errors.form}</p>}
        </form>
      </div>

      <div className="bg-white border border-line rounded-lg p-6">
        <h2 className="text-sm font-semibold text-ink mb-4">Your workspace</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-ink">{projects.length}</div>
            <div className="text-xs text-muted mt-1">Projects</div>
          </div>
          <div>
            <div className="text-xl font-bold text-ink">{tasks.length}</div>
            <div className="text-xs text-muted mt-1">Tasks</div>
          </div>
          <div>
            <div className="text-xl font-bold text-ink">{completedCount}</div>
            <div className="text-xs text-muted mt-1">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}