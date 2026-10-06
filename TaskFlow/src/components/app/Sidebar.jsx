import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, ListChecks, Activity, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard, end: true },
  { label: "Projects", to: "/app/projects", icon: FolderKanban },
  { label: "All tasks", to: "/app/tasks", icon: ListChecks },
  { label: "Activity", to: "/app/activity", icon: Activity },
  { label: "Profile", to: "/app/profile", icon: User },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col bg-white border-r border-line">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-line">
        <span className="w-5 h-5 rounded-sm bg-accent" aria-hidden="true" />
        <span className="font-semibold tracking-tight text-[15px] text-ink">TaskFlow</span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                isActive ? "bg-accent-light text-ink font-medium" : "text-muted hover:text-ink",
              ].join(" ")
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-line">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted hover:text-ink hover:bg-accent-light transition-colors"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </aside>
  );
}