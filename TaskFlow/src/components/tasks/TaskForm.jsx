import { useState } from "react";
import { useTaskContext } from "../../context/TaskContext";

const pad = (n) => String(n).padStart(2, "0");
const toInputDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// A date input gives "YYYY-MM-DD". Building the Date from its parts keeps it
// in local time (new Date("2026-09-30") would be read as UTC and can shift a day).
const fromInputDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const fieldClass =
  "w-full px-3 py-2.5 rounded-md border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent";

// Shared by the Create and Edit flows. The parent decides the starting values,
// the button label, and what happens on submit.
export default function TaskForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const { projects } = useTaskContext();

  const [form, setForm] = useState({
    title: initialValues.title,
    description: initialValues.description,
    projectId: initialValues.projectId,
    priority: initialValues.priority,
    dueDate: toInputDate(initialValues.dueDate),
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Give the task a title.";
    if (!form.dueDate) next.dueDate = "Pick a due date.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      projectId: form.projectId,
      priority: form.priority,
      dueDate: fromInputDate(form.dueDate),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ink mb-1.5">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          autoFocus
          value={form.title}
          onChange={handleChange}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={fieldClass}
        />
        {errors.title && (
          <p id="title-error" className="mt-1.5 text-xs text-accent">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-ink mb-1.5">
          Description <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-ink mb-1.5">
            Project
          </label>
          <select id="projectId" name="projectId" value={form.projectId} onChange={handleChange} className={fieldClass}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-ink mb-1.5">
            Priority
          </label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange} className={fieldClass}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-ink mb-1.5">
          Due date
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          aria-invalid={!!errors.dueDate}
          aria-describedby={errors.dueDate ? "due-error" : undefined}
          className={fieldClass}
        />
        {errors.dueDate && (
          <p id="due-error" className="mt-1.5 text-xs text-accent">{errors.dueDate}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-sm border border-line text-ink hover:bg-accent-light"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-cream hover:opacity-90 transition-opacity"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}