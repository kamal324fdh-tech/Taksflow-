import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-cream border-t border-line">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink max-w-md">
          Start organizing your work.
        </h2>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium bg-accent text-cream hover:opacity-90 transition-opacity shrink-0"
        >
          Get started
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}