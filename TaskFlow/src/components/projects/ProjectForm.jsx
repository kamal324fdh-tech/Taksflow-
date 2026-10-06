import { useState } from "react";
import { useTaskContext } from "../../context/TaskContext";
import { PROJECT_STATUS_LABEL } from "../../utils/projectStatus";

const fieldClass =
  "w-full px-3 py-2.5 rounded-md border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent";

// Shared by the Create flow now and the Edit flow in the next step.
// `editingId` is only passed when editing, so a project doesn't count as a
// duplicate of itself.
export default function ProjectForm({ initialValues, submitLabel, onSubmit, onCancel, editingId }) {
  const { projects } = useTaskContext();

  const [form, setForm] = useState({
    name: initialValues.name,
    description: initialValues.description,
    status: initialValues.status,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    if (!name) {
      next.name = "Give the project a name.";
    } else if (
      projects.some((p) => p.id !== editingId && p.name.toLowerCase() === name.toLowerCase())
    ) {
      next.name = "A project with this name already exists.";
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="project-name" className="block text-sm font-medium text-ink mb-1.5">
          Name
        </label>
        <input
          id="project-name"
          name="name"
          type="text"
          autoFocus
          value={form.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "project-name-error" : undefined}
          className={fieldClass}
        />
        {errors.name && (
          <p id="project-name-error" className="mt-1.5 text-xs text-accent">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="project-description" className="block text-sm font-medium text-ink mb-1.5">
          Description <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          id="project-description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="project-status" className="block text-sm font-medium text-ink mb-1.5">
          Status
        </label>
        <select
          id="project-status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className={fieldClass}
        >
          {Object.entries(PROJECT_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
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