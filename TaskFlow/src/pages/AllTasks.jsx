import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { today, isOverdue, isDueToday, dueLabel } from "../data/mockData";
import { useTaskContext } from "../context/TaskContext";

const DAY = 86400000;

const STATUS_LABEL = { todo: "To do", "in-progress": "In progress", done: "Completed" };
const PRIORITY_LABEL = { high: "High", medium: "Medium", low: "Low" };

const statusStyles = {
  todo: "border border-line text-muted",
  "in-progress": "bg-accent-light text-ink",
  done: "bg-cream text-muted",
};
const priorityDot = { high: "bg-accent", medium: "bg-ink/40", low: "bg-ink/20" };

const INITIAL_FILTERS = { status: "all", priority: "all", projectId: "all", due: "all" };

const selectClass =
  "text-sm px-2.5 py-2 rounded-md border border-line bg-white text-ink focus:outline-none focus:ring-2 focus:ring-accent";

const daysUntil = (date) => Math.round((new Date(date).setHours(0, 0, 0, 0) - today.getTime()) / DAY);

const matchesDue = (task, due) => {
  if (due === "overdue") return isOverdue(task);
  if (due === "today") return isDueToday(task);
  if (due === "week") {
    const days = daysUntil(task.dueDate);
    return task.status !== "done" && days >= 0 && days <= 7;
  }
  return true; // "all"
};

export default function AllTasks() {
  const { tasks, projects, openTask } = useTaskContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const rawQuery = searchParams.get("q") ?? "";
  const query = rawQuery.trim().toLowerCase();

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const hasActiveFilters = query !== "" || Object.values(filters).some((v) => v !== "all");

  const clearAll = () => {
    setFilters(INITIAL_FILTERS);
    setSearchParams({}, { replace: true });
  };

  // Each .filter() narrows the list a little more. Nothing is stored:
  // the visible list is recalculated from the shared tasks on every render.
  const visible = tasks
    .filter(
      (t) =>
        !query ||
        t.title.toLowerCase().includes(query) ||
        (t.description || "").toLowerCase().includes(query)
    )
    .filter((t) => filters.status === "all" || t.status === filters.status)
    .filter((t) => filters.priority === "all" || t.priority === filters.priority)
    .filter((t) => filters.projectId === "all" || t.projectId === filters.projectId)
    .filter((t) => matchesDue(t, filters.due))
    .sort((a, b) => {
      // Unfinished work first, completed at the bottom; then soonest due date.
      const aDone = a.status === "done";
      const bDone = b.status === "done";
      if (aDone !== bDone) return aDone ? 1 : -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink tracking-tight">All tasks</h1>
        <p className="text-sm text-muted mt-1">
          {visible.length} of {tasks.length} tasks
          {rawQuery.trim() && <> matching &ldquo;{rawQuery.trim()}&rdquo;</>}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select name="status" aria-label="Filter by status" value={filters.status} onChange={handleFilter} className={selectClass}>
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Completed</option>
        </select>

        <select name="priority" aria-label="Filter by priority" value={filters.priority} onChange={handleFilter} className={selectClass}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select name="projectId" aria-label="Filter by project" value={filters.projectId} onChange={handleFilter} className={selectClass}>
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select name="due" aria-label="Filter by due date" value={filters.due} onChange={handleFilter} className={selectClass}>
          <option value="all">Any due date</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due today</option>
          <option value="week">Next 7 days</option>
        </select>

        {hasActiveFilters && (
          <button onClick={clearAll} className="text-sm text-muted hover:text-ink px-2 py-2">
            Clear all
          </button>
        )}
      </div>

      <div className="bg-white border border-line rounded-lg divide-y divide-line">
        {visible.length === 0 && (
          <div className="p-8 text-center">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted">No tasks yet. Use New task to add your first one.</p>
            ) : (
              <>
                <p className="text-sm text-muted">No tasks match your search and filters.</p>
                <button onClick={clearAll} className="mt-3 text-sm font-medium text-accent">
                  Clear all
                </button>
              </>
            )}
          </div>
        )}

        {visible.map((task) => {
          const project = projects.find((p) => p.id === task.projectId);
          return (
            <button
              key={task.id}
              onClick={() => openTask(task.id)}
              className="w-full text-left px-4 py-3.5 flex items-center gap-4 hover:bg-accent-light transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[task.priority]}`} />

              <div className="min-w-0 flex-1">
                <div className={`text-sm font-medium truncate ${task.status === "done" ? "text-muted" : "text-ink"}`}>
                  {task.title}
                </div>
                <div className="text-xs text-muted mt-0.5 truncate">{project?.name}</div>
              </div>

              <span className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded shrink-0 ${statusStyles[task.status]}`}>
                {STATUS_LABEL[task.status]}
              </span>
              <span className="hidden md:block w-16 text-xs text-muted shrink-0">
                {PRIORITY_LABEL[task.priority]}
              </span>
              <span
                className={`w-28 text-right text-xs shrink-0 ${isOverdue(task) ? "text-accent font-medium" : "text-muted"}`}
              >
                {dueLabel(task.dueDate)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}