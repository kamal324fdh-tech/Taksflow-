import { Activity, ArrowRight, CheckCircle2, Flag, GitBranch, Pencil, Plus } from "lucide-react";

// Picks an icon for an activity entry based on what the action text says.
// Order matters: "Updated priority" has to be checked before the general
// "Updated" edits, and "Changed status to Completed" counts as a completion.
export function iconForAction(action) {
  if (action.endsWith("Completed")) return CheckCircle2;
  if (action.startsWith("Created")) return Plus;
  if (action.startsWith("Changed status")) return GitBranch;
  if (action.startsWith("Updated priority")) return Flag;
  if (action.startsWith("Moved to")) return ArrowRight;
  if (
    action.startsWith("Renamed") ||
    action.startsWith("Updated") ||
    action.startsWith("Changed due")
  ) {
    return Pencil;
  }
  return Activity;
}