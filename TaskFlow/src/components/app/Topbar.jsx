import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { useTaskContext } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";

const TASKS_PATH = "/app/tasks";

export default function Topbar() {
  const { openCreate } = useTaskContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const onTasksPage = location.pathname === TASKS_PATH;
  const query = onTasksPage ? searchParams.get("q") ?? "" : "";

  const handleSearch = (e) => {
    const value = e.target.value;
    const url = value ? `${TASKS_PATH}?q=${encodeURIComponent(value)}` : TASKS_PATH;
    navigate(url, { replace: onTasksPage });
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 border-b border-line bg-white">
      <div className="relative flex-1 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          aria-label="Search tasks"
          placeholder="Search tasks…"
          value={query}
          onChange={handleSearch}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-line bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => openCreate()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium bg-accent text-cream hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New task</span>
        </button>
        <Link
          to="/app/profile"
          aria-label="Your profile"
          className="w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center text-xs font-semibold hover:opacity-90"
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}