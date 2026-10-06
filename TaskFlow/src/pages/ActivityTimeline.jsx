import { useState } from "react";
import { today, relativeTime } from "../data/mockData";
import { useTaskContext } from "../context/TaskContext";
import { iconForAction } from "../utils/activityIcon";

const DAY = 86400000;
const PAGE_SIZE = 30;

const selectClass =
  "text-sm px-2.5 py-2 rounded-md border border-line bg-white text-ink focus:outline-none focus:ring-2 focus:ring-accent";

// "Today", "Yesterday", or a date like "Monday, Sep 21".
const dayLabel = (timestamp) => {
  const d = new Date(timestamp);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / DAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
};

const timeOfDay = (timestamp) =>
  new Date(timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export default function ActivityTimeline() {
  const { tasks, projects, openTask } = useTaskContext();
  const [projectFilter, setProjectFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const handleProjectFilter = (e) => {
    setProjectFilter(e.target.value);
    setLimit(PAGE_SIZE); // start from the top again when the filter changes
  };

  // Every task carries its own activity list. Flatten them into one feed,
  // attach the task to each entry, and put the newest first.
  const all = tasks
    .filter((t) => projectFilter === "all" || t.projectId === projectFilter)
    .flatMap((task) => (task.activity ?? []).map((entry) => ({ ...entry, task })))
    .sort((a, b) => b.timestamp - a.timestamp);

  const visible = all.slice(0, limit);

  // Group neighbouring entries that happened on the same day.
  const groups = [];
  visible.forEach((entry) => {
    const key = new Date(entry.timestamp).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.entries.push(entry);
    } else {
      groups.push({ key, label: dayLabel(entry.timestamp), entries: [entry] });
    }
  });

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Activity</h1>
          <p className="text-sm text-muted mt-1">Everything that has changed across your projects.</p>
        </div>
        <select
          aria-label="Filter by project"
          value={projectFilter}
          onChange={handleProjectFilter}
          className={selectClass}
        >
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {all.length === 0 && (
        <div className="bg-white border border-line rounded-lg p-8 text-center">
          <p className="text-sm text-muted">
            {projectFilter === "all"
              ? "No activity yet. Create or update a task and it will show up here."
              : "No activity in this project yet."}
          </p>
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.key}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-4">
              {group.label}
            </h2>

            <ol className="ml-3 border-l border-line">
              {group.entries.map((entry) => {
                const Icon = iconForAction(entry.action);
                const project = projects.find((p) => p.id === entry.task.projectId);
                return (
                  <li key={entry.id} className="relative pl-7 pb-5 last:pb-0">
                    <span className="absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center bg-cream border border-line text-muted">
                      <Icon size={13} />
                    </span>

                    <div className="text-sm text-ink">
                      <span className="font-medium">{entry.action}</span>
                      <span className="text-muted"> — </span>
                      <button
                        onClick={() => openTask(entry.task.id)}
                        className="text-left hover:text-accent"
                      >
                        {entry.task.title}
                      </button>
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      {project?.name} · {timeOfDay(entry.timestamp)} · {relativeTime(entry.timestamp)}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      {all.length > limit && (
        <button
          onClick={() => setLimit((n) => n + PAGE_SIZE)}
          className="mt-8 w-full py-2.5 rounded-md text-sm border border-line text-ink hover:bg-accent-light transition-colors"
        >
          Show more ({all.length - limit} older)
        </button>
      )}
    </div>
  );
}