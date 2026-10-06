import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { isOverdue } from "../data/mockData";
import { useTaskContext } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import StatOverview from "../components/dashboard/StatOverview";
import TodayFocus from "../components/dashboard/TodayFocus";
import NeedsAttention from "../components/dashboard/NeedsAttention";
import ProjectOverview from "../components/dashboard/ProjectOverview";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const { tasks, projects, projectsLoading, openTask, openCreateProject } = useTaskContext();
  const { user } = useAuth();
  const [activeFocusId, setActiveFocusId] = useState(null);
  const navigate = useNavigate();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter(isOverdue).length;

  const activeFocusTask = tasks.find((t) => t.id === activeFocusId);
  const firstName = user?.name ? user.name.split(" ")[0] : "";

  const handleOpenTask = (task) => openTask(task.id);
  const handleOpenProject = (projectId) => navigate(`/app/projects/${projectId}`);

  // Firestore hasn't returned the initial list yet. Showing nothing briefly
  // is better than flashing the empty-state welcome panel and then the
  // real dashboard a moment later.
  if (projectsLoading) {
    return null;
  }

  if (projects.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Welcome to TaskFlow{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-sm text-muted mt-1">Let's set up your workspace.</p>
        </div>

        <div className="max-w-xl bg-white border border-line rounded-lg p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Start with a project</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Projects hold your tasks. Create one, add a few tasks with a priority and a due date,
            and this page will start showing what needs your attention today.
          </p>
          <button
            onClick={openCreateProject}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium bg-accent text-cream hover:opacity-90 transition-opacity"
          >
            <Plus size={15} />
            Create your first project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          Good to see you{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-sm text-muted mt-1">Here's what's in front of you across all projects.</p>
      </div>

      {activeFocusTask && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-lg px-4 py-3 bg-accent-light border border-accent/30">
          <div className="min-w-0">
            <div className="text-xs font-medium text-accent">Currently focusing on</div>
            <div className="text-sm font-semibold text-ink truncate">{activeFocusTask.title}</div>
          </div>
          <button
            onClick={() => setActiveFocusId(null)}
            className="text-xs px-3 py-1.5 rounded-md border border-line text-ink hover:bg-white shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mb-8">
        <StatOverview total={total} completed={completed} inProgress={inProgress} overdue={overdue} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <TodayFocus tasks={tasks} projects={projects} activeFocusId={activeFocusId} onStartFocus={setActiveFocusId} />
          <NeedsAttention tasks={tasks} projects={projects} onOpenTask={handleOpenTask} />
        </div>
        <div className="space-y-8">
          <ProjectOverview projects={projects} tasks={tasks} onOpenProject={handleOpenProject} />
          <RecentActivity tasks={tasks} />
        </div>
      </div>
    </div>
  );
}