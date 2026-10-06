import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="px-5 sm:px-8 py-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="w-6 h-6 rounded-sm bg-accent" aria-hidden="true" />
          <span className="font-semibold tracking-tight text-[15px] text-ink">TaskFlow</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}