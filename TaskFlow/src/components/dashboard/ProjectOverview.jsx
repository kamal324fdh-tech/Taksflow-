import { Layers } from "lucide-react";

export default function ProjectOverview({ projects, tasks, onOpenProject }) {
  const stats = projects.map((project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    const done = projectTasks.filter((t) => t.status === "done").length;
    const pct = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;
    return { ...project, count: projectTasks.length, done, pct };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
          <Layers size={15} />
          Project overview
        </h2>
      </div>

      <div className="bg-white border border-line rounded-lg divide-y divide-line">
        {stats.map((project) => (
          <button
            key={project.id}
            onClick={() => onOpenProject(project.id)}
            className="w-full text-left p-3.5 hover:bg-accent-light transition-colors"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-sm font-medium text-ink">{project.name}</span>
              <span className="text-xs text-muted font-mono shrink-0">
                {project.done}/{project.count}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${project.pct}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}