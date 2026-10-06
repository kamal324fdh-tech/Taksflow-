import { createContext, useContext, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { removeProject, ...projectState } = useProjects();
  const taskState = useTasks(projectState.projects);

  const [openTaskId, setOpenTaskId] = useState(null);
  const [createDraft, setCreateDraft] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const openTask = (id) => setOpenTaskId(id);
  const closeTask = () => setOpenTaskId(null);

  const openCreate = (projectId = null) => {
    if (projectState.projects.length === 0) {
      setIsCreateProjectOpen(true);
      return;
    }
    setCreateDraft({ projectId });
  };
  const closeCreate = () => setCreateDraft(null);

  const openCreateProject = () => setIsCreateProjectOpen(true);
  const closeCreateProject = () => setIsCreateProjectOpen(false);

  // Deleting a project has two parts: remove its tasks, then remove the
  // project itself. Both are now real Firestore writes, so this is async,
  // and we wait for the tasks to finish deleting before removing the project.
  const deleteProject = async (projectId) => {
    await taskState.deleteTasksInProject(projectId);
    await removeProject(projectId);
  };

  return (
    <TaskContext.Provider
      value={{
        ...projectState,
        ...taskState,
        deleteProject,
        openTaskId,
        openTask,
        closeTask,
        createDraft,
        openCreate,
        closeCreate,
        isCreateProjectOpen,
        openCreateProject,
        closeCreateProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTaskContext must be used inside a TaskProvider");
  }
  return ctx;
}