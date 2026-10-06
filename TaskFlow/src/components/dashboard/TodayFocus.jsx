import { Target } from "lucide-react";
import { dueLabel } from "../../data/mockData";

const priorityDot = { high: "bg-accent", medium: "bg-ink/40", low: "bg-ink/20" };

export default function TodayFocus({ tasks, projects, activeFocusId, onStartFocus }) {
  const focusTasks = tasks.filter((t) => t.isFocus && t.status !== "done").slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
          <Target size={15} />
          Today's Focus
        </h2>
        <span className="text-xs text-muted">{focusTasks.length} selected</span>
      </div>

      <div className="bg-white border border-line rounded-lg divide-y divide-line">
        {focusTasks.length === 0 && (
          <div className="p-5 text-sm text-muted">
            Nothing in your focus list yet. Open a task and choose Add to focus to put it here.
          </div>
        )}

        {focusTasks.map((task) => {
          const project = projects.find((p) => p.id === task.projectId);
          const isActive = activeFocusId === task.id;
          return (
            <div key={task.id} className="p-3.5 flex items-center gap-3">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink truncate">{task.title}</div>
                <div className="text-xs text-muted mt-0.5">
                  {project?.name} · Due {dueLabel(task.dueDate)}
                </div>
              </div>
              <button
                onClick={() => onStartFocus(task.id)}
                className={`text-xs px-2.5 py-1.5 rounded-md shrink-0 transition-colors ${
                  isActive ? "bg-accent text-cream" : "border border-line text-ink hover:bg-accent-light"
                }`}
              >
                {isActive ? "Focusing" : "Start"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}