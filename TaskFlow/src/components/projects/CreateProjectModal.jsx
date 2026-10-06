import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useTaskContext } from "../../context/TaskContext";
import ProjectForm from "./ProjectForm";

function CreateProjectDialog({ onClose, onCreate }) {
  const navigate = useNavigate();
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
      const newId = await onCreate(values);
      onClose();
      navigate(`/app/projects/${newId}`);
    } catch (error) {
      setSaving(false);
      alert("Couldn't create the project. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white border border-line rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 id="create-project-title" className="text-lg font-semibold text-ink">
            New project
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
            initialValues={{ name: "", description: "", status: "active" }}
            submitLabel={saving ? "Creating…" : "Create project"}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateProjectModal() {
  const { isCreateProjectOpen, closeCreateProject, addProject } = useTaskContext();
  if (!isCreateProjectOpen) return null;

  return <CreateProjectDialog onClose={closeCreateProject} onCreate={addProject} />;
}