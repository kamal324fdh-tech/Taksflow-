import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../../context/TaskContext";

export default function DeleteProjectModal({ project, onClose }) {
  const { tasks, deleteProject } = useTaskContext();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const taskCount = tasks.filter((t) => t.projectId === project.id).length;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(project.id);
      onClose();
      navigate("/app/projects");
    } catch (error) {
      setDeleting(false);
      alert("Couldn't delete the project. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
        className="w-full max-w-md bg-white border border-line rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-5">
          <h2 id="delete-project-title" className="text-lg font-semibold text-ink">
            Delete {project.name}?
          </h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            {taskCount > 0
              ? `This will also delete its ${taskCount} ${taskCount === 1 ? "task" : "tasks"}. This can't be undone.`
              : "This project has no tasks. This can't be undone."}
          </p>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-line">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm border border-line text-ink hover:bg-accent-light"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-md text-sm font-medium bg-ink text-cream hover:opacity-90 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete project"}
          </button>
        </div>
      </div>
    </div>
  );
}