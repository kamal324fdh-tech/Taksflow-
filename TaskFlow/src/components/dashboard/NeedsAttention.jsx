import { AlertTriangle } from "lucide-react";
import { isOverdue, isDueToday } from "../../data/mockData";

const priorityLabel = { high: "High", medium: "Medium", low: "Low" };

export default function NeedsAttention({ tasks, projects, onOpenTask }) {
  const seen = new Set();
  const attention = [];

  tasks.filter(isOverdue).forEach((t) => {
    attention.push({ task: t, reason: "Overdue" });
    seen.add(t.id);
  });
  tasks.filter(isDueToday).forEach((t) => {
    if (!seen.has(t.id)) {
      attention.push({ task: t, reason: "Due today" });
      seen.add(t.id);
    }
  });
  tasks
    .filter((t) => t.priority === "high" && t.status !== "done")
    .forEach((t) => {
      if (!seen.has(t.id)) {
        attention.push({ task: t, reason: "High priority, unfinished" });
        seen.add(t.id);
      }
    });

  const items = attention.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
          <AlertTriangle size={15} />
          Needs Attention
        </h2>
      </div>

      <div className="bg-white border border-line rounded-lg divide-y divide-line">
        {items.length === 0 && (
          <div className="p-5 text-sm text-muted">Nothing urgent right now.</div>
        )}

        {items.map(({ task, reason }) => {
          const projectName = projects.find((p) => p.id === task.projectId)?.name ?? "Project unavailable";
          return (
            <button
              key={task.id}
              onClick={() => onOpenTask(task)}
              className="w-full text-left p-3.5 flex items-center gap-3 border-l-[3px] border-accent hover:bg-accent-light transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink truncate">{task.title}</div>
                <div className="text-xs text-muted mt-0.5">
                  {projectName} · {reason}
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-accent-light text-accent font-medium shrink-0">
                {priorityLabel[task.priority]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}