import { useNavigate } from "react-router-dom";
import { Layers, Plus } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";
import { PROJECT_STATUS_LABEL } from "../utils/projectStatus";

export default function Projects() {
  const { tasks, projects, openCreateProject } = useTaskContext();
  const navigate = useNavigate();

  const stats = projects.map((project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    const done = projectTasks.filter((t) => t.status === "done").length;
    const pct = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;
    return { ...project, count: projectTasks.length, done, pct };
  });

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Projects</h1>
          <p className="text-sm text-muted mt-1">
            {stats.length} {stats.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <button
          onClick={openCreateProject}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium border border-line text-ink hover:bg-accent-light transition-colors"
        >
          <Plus size={15} />
          New project
        </button>
      </div>

      <div className="bg-white border border-line rounded-lg divide-y divide-line">
        {stats.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-muted">No projects yet. Create your first one to start adding tasks.</p>
            <button onClick={openCreateProject} className="mt-3 text-sm font-medium text-accent">
              New project
            </button>
          </div>
        )}

        {stats.map((project) => (
          <button
            key={project.id}
            onClick={() => navigate(`/app/projects/${project.id}`)}
            className="w-full text-left p-5 flex items-center gap-5 hover:bg-accent-light transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-accent-light text-accent flex items-center justify-center shrink-0">
              <Layers size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-ink">{project.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-cream border border-line text-muted">
                  {PROJECT_STATUS_LABEL[project.status] ?? "Active"}
                </span>
              </div>
              <p className="text-sm text-muted truncate">
                {project.description || "No description"}
              </p>
            </div>

            <div className="hidden sm:block w-40 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted">{project.done}/{project.count} done</span>
                <span className="text-xs text-muted font-mono">{project.pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                <div className="h-full rounded-full bg-accent" style={{ width: `${project.pct}%` }} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}