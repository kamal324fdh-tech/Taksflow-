import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTaskContext } from "../../context/TaskContext";
import ProjectForm from "./ProjectForm";

export default function EditProjectModal({ project, onClose }) {
  const { updateProject } = useTaskContext();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      await updateProject(project.id, values);
      onClose();
    } catch (error) {
      setSaving(false);
      alert("Couldn't save changes. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-project-title"
        className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white border border-line rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 id="edit-project-title" className="text-lg font-semibold text-ink">
            Edit project
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-md text-muted hover:text-ink hover:bg-accent-light"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto">
          <ProjectForm
            initialValues={{
              name: project.name,
              description: project.description || "",
              status: project.status,
            }}
            editingId={project.id}
            submitLabel={saving ? "Saving…" : "Save changes"}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}