import { Target, AlertTriangle, Layers, Activity } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "Today's Focus",
    body: "A short, honest list — not everything on your plate, just what deserves attention today. Pick one task and start.",
  },
  {
    icon: AlertTriangle,
    title: "Needs Attention",
    body: "Overdue work, things due today, and unfinished high-priority tasks surface on their own — calculated from your real task data, not guesswork.",
  },
  {
    icon: Layers,
    title: "Projects, at a glance",
    body: "Every project shows real progress: how many tasks are actually done, not a vague status you have to update by hand.",
  },
  {
    icon: Activity,
    title: "Activity timeline",
    body: "Every status change, completion, and edit is logged automatically, so you can see how a task got where it is.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-cream border-t border-line">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink max-w-xl">
          A workspace built around one question: what should I work on right now?
        </h2>

        <div className="mt-14 space-y-12">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="grid sm:grid-cols-[auto,1fr] gap-5 sm:gap-8 items-start">
              <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0 bg-accent-light text-accent">
                <Icon size={20} />
              </div>
              <div className="max-w-xl">
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}