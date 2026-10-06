import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { isOverdue, dueLabel } from "../data/mockData";
import { useTaskContext } from "../context/TaskContext";
import { PROJECT_STATUS_LABEL } from "../utils/projectStatus";
import EditProjectModal from "../components/projects/EditProjectModal";
import DeleteProjectModal from "../components/projects/DeleteProjectModal";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in-progress", label: "In progress" },
  { key: "done", label: "Completed" },
];

const priorityDot = { high: "bg-accent", medium: "bg-ink/40", low: "bg-ink/20" };

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, setStatus, openTask, openCreate } = useTaskContext();

  // Which project dialog is open: "edit", "delete", or null (none).
  const [dialog, setDialog] = useState(null);

  const project = projects.find((p) => p.id === projectId);
  const projectTasks = tasks.filter((t) => t.projectId === projectId);

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        <p className="text-sm text-muted">Project not found.</p>
        <button onClick={() => navigate("/app/projects")} className="mt-3 text-sm text-accent font-medium">
          Back to projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
      <button
        onClick={() => navigate("/app/projects")}
        className="text-xs text-muted hover:text-ink mb-2"
      >
        ← Projects
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink tracking-tight">{project.name}</h1>
            <span className="text-xs px-1.5 py-0.5 rounded bg-cream border border-line text-muted">
              {PROJECT_STATUS_LABEL[project.status] ?? "Active"}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-muted mt-1">{project.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreate(project.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium border border-line text-ink hover:bg-accent-light transition-colors"
          >
            <Plus size={15} />
            Add task
          </button>
          <button
            onClick={() => setDialog("edit")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm border border-line text-ink hover:bg-accent-light transition-colors"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            onClick={() => setDialog("delete")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-muted hover:text-ink hover:bg-accent-light transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = projectTasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="bg-white border border-line rounded-lg flex flex-col min-h-[160px]">
              <div className="px-3.5 py-3 flex items-center justify-between border-b border-line">
                <span className="text-sm font-semibold text-ink">{col.label}</span>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-cream text-muted">
                  {colTasks.length}
                </span>
              </div>

              <div className="p-2.5 space-y-2 flex-1">
                {colTasks.map((task) => (
                  <div key={task.id} className="bg-white border border-line rounded-md p-3">
                    <button
                      onClick={() => openTask(task.id)}
                      className="text-left text-sm font-medium text-ink leading-snug hover:text-accent"
                    >
                      {task.title}
                    </button>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority]}`} />
                      <span className={`text-xs ${isOverdue(task) ? "text-accent" : "text-muted"}`}>
                        {dueLabel(task.dueDate)}
                      </span>
                    </div>
                    {col.key !== "done" && (
                      <select
                        value={task.status}
                        onChange={(e) => setStatus(task.id, e.target.value)}
                        className="mt-2.5 w-full text-xs px-2 py-1.5 rounded-md border border-line bg-cream text-ink"
                      >
                        <option value="todo">To do</option>
                        <option value="in-progress">In progress</option>
                        <option value="done">Completed</option>
                      </select>
                    )}
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <p className="text-xs text-muted p-2">No tasks here.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {dialog === "edit" && <EditProjectModal project={project} onClose={() => setDialog(null)} />}
      {dialog === "delete" && <DeleteProjectModal project={project} onClose={() => setDialog(null)} />}
    </div>
  );
}