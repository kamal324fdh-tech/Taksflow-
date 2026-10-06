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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

// Holds the list of projects, now backed by Firestore instead of React
// state alone. onSnapshot keeps `projects` in sync automatically whenever
// a document is added, changed, or removed, no manual refetching needed.
export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const projectsQuery = query(collection(db, "projects"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      setProjects(list);
      setLoading(false);
    });

    // Stop listening when the user changes or logs out, so we don't leak
    // a listener tied to the previous account.
    return () => unsubscribe();
  }, [user]);

  const addProject = async ({ name, description, status }) => {
    const docRef = await addDoc(collection(db, "projects"), {
      name,
      description,
      status,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateProject = async (projectId, changes) => {
    await updateDoc(doc(db, "projects", projectId), changes);
  };

  const removeProject = async (projectId) => {
    await deleteDoc(doc(db, "projects", projectId));
  };

  return { projects, projectsLoading: loading, addProject, updateProject, removeProject };
}