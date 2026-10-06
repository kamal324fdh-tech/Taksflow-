import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { relativeTime } from "../../data/mockData";
import { iconForAction } from "../../utils/activityIcon";

export default function RecentActivity({ tasks }) {
  const feed = tasks
    .flatMap((task) => (task.activity ?? []).map((entry) => ({ ...entry, task })))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 7);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
          <Activity size={15} />
          Recent Activity
        </h2>
        <Link to="/app/activity" className="text-xs text-muted hover:text-ink">
          View all
        </Link>
      </div>

      <div className="bg-white border border-line rounded-lg p-4">
        {feed.length === 0 && <p className="text-sm text-muted">No activity yet.</p>}

        <div className="space-y-4">
          {feed.map((entry) => {
            const Icon = iconForAction(entry.action);
            return (
              <div key={entry.id} className="flex gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-cream border border-line text-muted">
                  <Icon size={13} />
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="text-sm text-ink">
                    <span className="font-medium">{entry.action}</span>{" "}
                    <span className="text-muted">— {entry.task.title}</span>
                  </div>
                  <div className="text-xs text-muted mt-0.5">{relativeTime(entry.timestamp)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}