import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-cream text-ink">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl mx-auto">
          Know what needs your attention.{" "}
          <span className="text-accent">Focus on it.</span> Keep moving.
        </h1>

        <p className="mt-6 text-lg text-muted max-w-xl mx-auto leading-relaxed">
          TaskFlow is a workspace for people juggling more than one project.
          It sorts the noise from what actually matters today, so you spend
          less time deciding what to do and more time doing it.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium bg-accent text-cream hover:opacity-90 transition-opacity"
          >
            Get started
            <ArrowRight size={16} />
          </Link>
          <Link
            to="#how-it-works"
            className="inline-flex items-center px-5 py-3 rounded-md text-sm font-medium border border-line text-ink hover:bg-accent-light transition-colors"
          >
            See how it works
          </Link>
        </div>

        <p className="mt-5 text-xs text-muted">
          No credit card required — start organizing your work in minutes.
        </p>
      </div>
    </section>
  );
}