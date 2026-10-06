import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { isOverdue, dueLabel } from "../../data/mockData";
import { useTaskContext } from "../../context/TaskContext";
import TaskForm from "./TaskForm";

const priorityStyles = {
  high: "bg-accent-light text-accent",
  medium: "bg-cream border border-line text-muted",
  low: "bg-cream border border-line text-muted",
};
const priorityLabel = { high: "High", medium: "Medium", low: "Low" };

function TaskDetail({ task }) {
  const { projects, closeTask, setStatus, toggleFocus, updateTask, deleteTask } = useTaskContext();
  const [mode, setMode] = useState("view");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (mode === "view") closeTask();
      else setMode("view");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, closeTask]);

  const project = projects.find((p) => p.id === task.projectId);

  const handleSave = async (values) => {
    setBusy(true);
    try {
      await updateTask(task.id, values);
      setMode("view");
    } catch {
      alert("Couldn't save changes. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteTask(task.id);
      closeTask();
    } catch {
      setBusy(false);
      alert("Couldn't delete the task. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40" onClick={closeTask}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="w-full max-w-lg max-h-[85vh] flex flex-col bg-white border border-line rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-line">
          <div className="min-w-0">
            {mode === "edit" ? (
              <h2 id="task-modal-title" className="text-lg font-semibold text-ink">
                Edit task
              </h2>
            ) : (
              <>
                <div className="text-xs text-muted mb-1.5">{project?.name}</div>
                <h2 id="task-modal-title" className="text-lg font-semibold text-ink leading-snug">
                  {task.title}
                </h2>
              </>
            )}
          </div>
          <button
            onClick={closeTask}
            aria-label="Close task details"
            className="shrink-0 p-1 rounded-md text-muted hover:text-ink hover:bg-accent-light"
          >
            <X size={18} />
          </button>
        </div>

        {mode === "edit" ? (
          <div className="px-5 py-4 overflow-y-auto">
            <TaskForm
              initialValues={{
                title: task.title,
                description: task.description,
                projectId: task.projectId,
                priority: task.priority,
                dueDate: new Date(task.dueDate),
              }}
              submitLabel={busy ? "Saving…" : "Save changes"}
              onSubmit={handleSave}
              onCancel={() => setMode("view")}
            />
          </div>
        ) : (
          <>
            <div className="px-5 py-4 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="task-status" className="block text-xs text-muted mb-1.5">
                    Status
                  </label>
                  <select
                    id="task-status"
                    value={task.status}
                    onChange={(e) => setStatus(task.id, e.target.value)}
                    className="w-full text-sm px-2.5 py-1.5 rounded-md border border-line bg-cream text-ink"
                  >
                    <option value="todo">To do</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>

                <div>
                  <div className="text-xs text-muted mb-1.5">Priority</div>
                  <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${priorityStyles[task.priority]}`}>
                    {priorityLabel[task.priority]}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-muted mb-1.5">Due date</div>
                  <div className={`text-sm ${isOverdue(task) ? "text-accent font-medium" : "text-ink"}`}>
                    {dueLabel(task.dueDate)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted mb-1.5">Today's Focus</div>
                  <button
                    onClick={() => toggleFocus(task.id)}
                    className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                      task.isFocus
                        ? "bg-accent text-cream"
                        : "border border-line text-ink hover:bg-accent-light"
                    }`}
                  >
                    {task.isFocus ? "In focus list — remove" : "Add to focus"}
                  </button>
                </div>
              </div>

              {task.description && (
                <div>
                  <div className="text-xs text-muted mb-1.5">Description</div>
                  <p className="text-sm text-muted leading-relaxed">{task.description}</p>
                </div>
              )}

              <div>
                <div className="text-xs text-muted mb-2">Activity</div>
                {task.activity?.length ? (
                  <ol className="space-y-2">
                    {[...task.activity]
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .slice(0, 8)
                      .map((entry) => (
                        <li key={entry.id} className="flex items-baseline justify-between gap-3 text-sm">
                          <span className="text-ink">{entry.action}</span>
                          <time className="shrink-0 text-xs text-muted">
                            {new Date(entry.timestamp).toLocaleString()}
                          </time>
                        </li>
                      ))}
                  </ol>
                ) : (
                  <p className="text-sm text-muted">No activity recorded yet.</p>
                )}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-line">
              {mode === "confirmDelete" ? (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-ink">Delete this task? This can't be undone.</p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setMode("view")}
                      className="px-3 py-1.5 rounded-md text-sm border border-line text-ink hover:bg-accent-light"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={busy}
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-ink text-cream hover:opacity-90 disabled:opacity-60"
                    >
                      {busy ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setMode("confirmDelete")}
                    className="text-sm text-muted hover:text-ink"
                  >
                    Delete task
                  </button>
                  <button
                    onClick={() => setMode("edit")}
                    className="px-3.5 py-1.5 rounded-md text-sm border border-line text-ink hover:bg-accent-light"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function TaskModal() {
  const { tasks, openTaskId } = useTaskContext();
  const task = tasks.find((t) => t.id === openTaskId);
  if (!task) return null;

  return <TaskDetail key={task.id} task={task} />;
}