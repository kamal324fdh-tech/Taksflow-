import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const priorityLabel = { low: "Low", medium: "Medium", high: "High" };

const sameDay = (a, b) => {
  const toDate = (d) => (d?.toDate ? d.toDate() : new Date(d));
  return toDate(a).setHours(0, 0, 0, 0) === toDate(b).setHours(0, 0, 0, 0);
};

// Adds one entry to a task's own activity subcollection — a small write,
// not a rewrite of the whole task document.
const logActivity = async (taskId, action) => {
  await addDoc(collection(db, "tasks", taskId, "activity"), {
    action,
    timestamp: serverTimestamp(),
  });
};

const deleteTaskActivity = async (taskId) => {
  const snapshot = await getDocs(collection(db, "tasks", taskId, "activity"));
  for (let start = 0; start < snapshot.docs.length; start += 450) {
    const batch = writeBatch(db);
    snapshot.docs.slice(start, start + 450).forEach((activityDoc) => {
      batch.delete(activityDoc.ref);
    });
    await batch.commit();
  }
};

// Central place for task state + mutations, now backed by Firestore.
// `projects` is passed in so activity entries can use a project's real name.
export function useTasks(projects) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const tasksQuery = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const activityUnsubscribes = new Map();
    const activityByTask = new Map();

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          activity: Array.isArray(data.activity) ? data.activity : [],
          // Firestore stores dates as Timestamp objects. The rest of the app
          // (dueLabel, isOverdue, etc.) expects a plain JS Date, so convert
          // here, once, rather than in every component that reads dueDate.
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : data.dueDate,
        };
      });

      const taskIds = new Set(list.map((task) => task.id));
      activityUnsubscribes.forEach((stopListening, taskId) => {
        if (!taskIds.has(taskId)) {
          stopListening();
          activityUnsubscribes.delete(taskId);
          activityByTask.delete(taskId);
        }
      });

      list.forEach((task) => {
        if (activityUnsubscribes.has(task.id)) return;

        const stopListening = onSnapshot(
          collection(db, "tasks", task.id, "activity"),
          (activitySnapshot) => {
            const activity = activitySnapshot.docs.map((activityDoc) => {
              const entry = activityDoc.data();
              return {
                id: activityDoc.id,
                ...entry,
                timestamp: entry.timestamp?.toMillis?.() ?? entry.timestamp ?? Date.now(),
              };
            });
            activityByTask.set(task.id, activity);
            setTasks((current) =>
              current.map((currentTask) =>
                currentTask.id === task.id ? { ...currentTask, activity } : currentTask
              )
            );
          }
        );
        activityUnsubscribes.set(task.id, stopListening);
      });

      setTasks(
        list.map((task) => ({
          ...task,
          activity: activityByTask.get(task.id) ?? task.activity,
        }))
      );
      setLoading(false);
    });

    return () => {
      unsubscribe();
      activityUnsubscribes.forEach((stopListening) => stopListening());
      activityUnsubscribes.clear();
      activityByTask.clear();
    };
  }, [user]);

  const setStatus = async (taskId, status) => {
    await updateDoc(doc(db, "tasks", taskId), { status });
    const label = status === "todo" ? "To do" : status === "in-progress" ? "In Progress" : "Completed";
    await logActivity(taskId, `Changed status to ${label}`);
  };

  const toggleFocus = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    await updateDoc(doc(db, "tasks", taskId), { isFocus: !task.isFocus });
  };

  const addTask = async ({ title, description, projectId, priority, dueDate }) => {
    const docRef = await addDoc(collection(db, "tasks"), {
      title,
      description,
      projectId,
      priority,
      dueDate: Timestamp.fromDate(dueDate),
      status: "todo",
      isFocus: false,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    await logActivity(docRef.id, "Created");
    return docRef.id;
  };

  // Applies the edited fields, and logs one activity entry per field that
  // actually changed (so saving without changes logs nothing).
  const updateTask = async (taskId, changes) => {
    const current = tasks.find((t) => t.id === taskId);
    if (!current) return;

    const actions = [];
    if (changes.title !== current.title) actions.push("Renamed task");
    if (changes.description !== current.description) actions.push("Updated description");
    if (changes.priority !== current.priority) {
      actions.push(`Updated priority to ${priorityLabel[changes.priority]}`);
    }
    if (!sameDay(changes.dueDate, current.dueDate)) actions.push("Changed due date");
    if (changes.projectId !== current.projectId) {
      const project = projects.find((p) => p.id === changes.projectId);
      actions.push(`Moved to ${project ? project.name : "another project"}`);
    }

    await updateDoc(doc(db, "tasks", taskId), {
      ...changes,
      dueDate: Timestamp.fromDate(changes.dueDate),
    });

    for (const action of actions) {
      await logActivity(taskId, action);
    }
  };

  const deleteTask = async (taskId) => {
    await deleteTaskActivity(taskId);
    await deleteDoc(doc(db, "tasks", taskId));
  };

  // Used when a whole project is deleted, so no task is left pointing at it.
  // Batched so all deletions succeed or fail together, rather than leaving
  // the project half-deleted if one write fails partway through.
  const deleteTasksInProject = async (projectId) => {
    const toDelete = tasks.filter((t) => t.projectId === projectId);
    if (toDelete.length === 0) return;

    for (const task of toDelete) {
      await deleteTaskActivity(task.id);
    }

    for (let start = 0; start < toDelete.length; start += 450) {
      const batch = writeBatch(db);
      toDelete.slice(start, start + 450).forEach((task) => {
        batch.delete(doc(db, "tasks", task.id));
      });
      await batch.commit();
    }
  };

  return {
    tasks,
    tasksLoading: loading,
    setStatus,
    toggleFocus,
    addTask,
    updateTask,
    deleteTask,
    deleteTasksInProject,
  };
}