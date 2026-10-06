import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTaskContext } from "../../context/TaskContext";
import TaskForm from "./TaskForm";

function CreateTaskDialog({ defaultProjectId, onClose, onCreate }) {
  const { projects } = useTaskContext();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const initialValues = {
    title: "",
    description: "",
    projectId: defaultProjectId || projects[0]?.id || "",
    priority: "medium",
    dueDate: new Date(),
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      await onCreate(values);
      onClose();
    } catch {
      setSaving(false);
      alert("Couldn't create the task. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white border border-line rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 id="create-task-title" className="text-lg font-semibold text-ink">
            New task
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
          <TaskForm
            initialValues={initialValues}
            submitLabel={saving ? "Creating…" : "Create task"}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateTaskModal() {
  const { createDraft, closeCreate, addTask } = useTaskContext();
  if (!createDraft) return null;

  return (
    <CreateTaskDialog
      defaultProjectId={createDraft.projectId}
      onClose={closeCreate}
      onCreate={addTask}
    />
  );
}