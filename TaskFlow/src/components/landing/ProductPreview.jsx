import { Flag, Target } from "lucide-react";

const PREVIEW_TASKS = [
  { title: "Build authentication", project: "MarketNest", priority: "high", due: "Today" },
  { title: "Fix mobile navigation", project: "Portfolio", priority: "medium", due: "Today" },
  { title: "Write API documentation", project: "MarketNest", priority: "high", due: "Tomorrow" },
];

const priorityDot = {
  high: "bg-accent",
  medium: "bg-ink/40",
  low: "bg-ink/20",
};

export default function ProductPreview() {
  return (
    <section className="bg-cream">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pb-20">
        <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden">
          {/* Fake window chrome — signals "this is the app", not a marketing graphic */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-line">
            <span className="w-2.5 h-2.5 rounded-full bg-line" />
            <span className="w-2.5 h-2.5 rounded-full bg-line" />
            <span className="w-2.5 h-2.5 rounded-full bg-line" />
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Target size={16} className="text-accent" />
                Today's Focus
              </div>
              <span className="text-xs text-muted">3 tasks need attention</span>
            </div>

            <div className="space-y-2">
              {PREVIEW_TASKS.map((task) => (
                <div
                  key={task.title}
                  className="flex items-center gap-3 rounded-md border border-line px-3 py-3"
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink truncate">{task.title}</div>
                    <div className="text-xs text-muted mt-0.5">
                      {task.project} · Due {task.due}
                    </div>
                  </div>
                  {task.priority === "high" && (
                    <span className="inline-flex items-center gap-1 text-xs text-accent shrink-0">
                      <Flag size={12} />
                      High
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}