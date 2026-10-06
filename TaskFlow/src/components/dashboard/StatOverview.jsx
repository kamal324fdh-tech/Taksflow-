export default function StatOverview({ total, completed, inProgress, overdue }) {
  const stats = [
    { label: "Total tasks", value: total },
    { label: "Completed", value: completed },
    { label: "In progress", value: inProgress },
    { label: "Overdue", value: overdue, highlight: overdue > 0 },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 bg-white border border-line rounded-lg overflow-hidden">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`p-5 ${i > 0 ? "border-l border-line" : ""} ${i >= 2 ? "border-t sm:border-t-0 border-line" : ""}`}
        >
          <div className={`text-2xl font-bold tabular-nums ${stat.highlight ? "text-accent" : "text-ink"}`}>
            {stat.value}
          </div>
          <div className="text-xs text-muted mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}