import { Outlet } from "react-router-dom";
import { TaskProvider } from "../context/TaskContext";
import Sidebar from "../components/app/Sidebar";
import Topbar from "../components/app/Topbar";
import TaskModal from "../components/tasks/TaskModal";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import CreateProjectModal from "../components/projects/CreateProjectModal";

export default function AppLayout() {
  return (
    <TaskProvider>
      <div className="h-screen flex bg-cream">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <TaskModal />
      <CreateTaskModal />
      <CreateProjectModal />
    </TaskProvider>
  );
}