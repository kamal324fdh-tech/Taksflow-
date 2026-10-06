const STEPS = [
  {
    number: "1",
    title: "Add your work",
    body: "Bring in projects and tasks. Set a priority and a due date — that's all TaskFlow needs to get started.",
  },
  {
    number: "2",
    title: "Let it sort the noise",
    body: "TaskFlow works out what's overdue, due today, or important but stalled — automatically, without you tagging anything.",
  },
  {
    number: "3",
    title: "Focus, then move on",
    body: "Pick a focus task, finish it, and let the board reflect what actually happened.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream border-t border-line">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid sm:grid-cols-3 gap-10">
          {STEPS.map((step) => (
            <div key={step.number}>
              <div className="text-sm font-mono text-muted">{step.number}</div>
              <h3 className="mt-3 font-semibold text-ink text-[15px]">{step.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}