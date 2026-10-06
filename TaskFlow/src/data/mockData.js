// Mock data layer — stands in for the database until the backend (Phase 9) exists.
// Every component reads task/project data through here, never hardcoded locally.
// This file gets deleted once real API calls replace it.

const DAY = 86400000;
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const today = startOfDay(new Date());
const addDays = (n) => new Date(today.getTime() + n * DAY);

export const projects = [
  { id: "website", name: "Website Redesign", description: "Plan and deliver an updated website experience" },
  { id: "team-workspace", name: "Team Workspace", description: "Coordinate shared work and project updates" },
  { id: "mobile-app", name: "Mobile App", description: "Design, build, and test a mobile application" },
  { id: "personal-planning", name: "Personal Planning", description: "Track recurring tasks and upcoming priorities" },
];

let _id = 1;
const nid = () => "t" + _id++;

const activity = (action, daysAgo) => ({
  id: "a" + Math.random().toString(36).slice(2, 8),
  action,
  timestamp: Date.now() - daysAgo * DAY - Math.round(Math.random() * 4 * 3600000),
});

export const tasks = [
  {
    id: nid(),
    title: "Draft page structure",
    projectId: "website",
    status: "in-progress",
    priority: "high",
    dueDate: addDays(0),
    description: "Outline the main pages and how people will navigate between them.",
    isFocus: true,
    activity: [activity("Created", 6), activity("Changed status to In Progress", 2)],
  },
  {
    id: nid(),
    title: "Review homepage content",
    projectId: "website",
    status: "in-progress",
    priority: "high",
    dueDate: addDays(0),
    description: "Check the copy and links on the updated homepage.",
    isFocus: false,
    activity: [activity("Created", 5), activity("Changed status to In Progress", 1)],
  },
  {
    id: nid(),
    title: "Update page navigation",
    projectId: "website",
    status: "todo",
    priority: "medium",
    dueDate: addDays(-2),
    description: "Make the navigation clear and usable on smaller screens.",
    isFocus: false,
    activity: [activity("Created", 8)],
  },
  {
    id: nid(),
    title: "Publish design draft",
    projectId: "website",
    status: "done",
    priority: "medium",
    dueDate: addDays(-10),
    description: "Share the first design draft for review.",
    isFocus: false,
    activity: [activity("Created", 16), activity("Completed", 9)],
  },
  {
    id: nid(),
    title: "Prepare weekly update",
    projectId: "team-workspace",
    status: "todo",
    priority: "medium",
    dueDate: addDays(0),
    description: "Summarize progress, priorities, and any blockers.",
    isFocus: true,
    activity: [activity("Created", 3)],
  },
  {
    id: nid(),
    title: "Organize shared files",
    projectId: "team-workspace",
    status: "todo",
    priority: "high",
    dueDate: addDays(1),
    description: "Group current project documents into clear folders.",
    isFocus: false,
    activity: [activity("Created", 2)],
  },
  {
    id: nid(),
    title: "Assign follow-up tasks",
    projectId: "team-workspace",
    status: "done",
    priority: "medium",
    dueDate: addDays(-20),
    description: "Capture owners and next steps from the latest check-in.",
    isFocus: false,
    activity: [activity("Created", 25), activity("Completed", 20)],
  },
  {
    id: nid(),
    title: "Review onboarding flow",
    projectId: "mobile-app",
    status: "todo",
    priority: "high",
    dueDate: addDays(2),
    description: "Walk through the first-run screens and note confusing steps.",
    isFocus: false,
    activity: [activity("Created", 3)],
  },
  {
    id: nid(),
    title: "Test sign-in experience",
    projectId: "mobile-app",
    status: "in-progress",
    priority: "medium",
    dueDate: addDays(3),
    description: "Check the sign-in form on common device sizes.",
    isFocus: false,
    activity: [activity("Created", 6), activity("Changed status to In Progress", 2)],
  },
  {
    id: nid(),
    title: "Schedule routine appointment",
    projectId: "personal-planning",
    status: "todo",
    priority: "high",
    dueDate: addDays(-1),
    description: "Choose a suitable time and add it to the calendar.",
    isFocus: false,
    activity: [activity("Created", 4)],
  },
  {
    id: nid(),
    title: "Review monthly budget",
    projectId: "personal-planning",
    status: "done",
    priority: "medium",
    dueDate: addDays(-30),
    description: "",
    isFocus: false,
    activity: [activity("Created", 40), activity("Completed", 30)],
  },
];

// --- Derived-data helpers — pure functions, no state, so they're easy to
// test and easy to later swap for backend query params. ---

export const isOverdue = (task) => task.status !== "done" && startOfDay(task.dueDate) < today;

export const isDueToday = (task) =>
  task.status !== "done" && startOfDay(task.dueDate).getTime() === today.getTime();

export const dueLabel = (date) => {
  const diff = Math.round((startOfDay(date) - today) / DAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  const label = new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return diff < 0 ? `${label} · ${Math.abs(diff)}d overdue` : label;
};

export const relativeTime = (timestamp) => {
  const mins = Math.round((Date.now() - timestamp) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
};