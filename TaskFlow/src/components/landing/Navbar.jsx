import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-ink text-cream border-b border-line/10 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <span className="w-6 h-6 rounded-sm bg-accent" aria-hidden="true" />
          <span className="font-semibold tracking-tight text-[15px]">TaskFlow</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md text-sm text-cream/60 hover:text-cream transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth links + CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `text-sm px-3 py-2 rounded-md transition-colors ${
                isActive ? "text-cream font-medium" : "text-cream/60 hover:text-cream"
              }`
            }
          >
            Log in
          </NavLink>
          <Link
            to="/register"
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-accent text-ink hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="sm:hidden p-2 -mr-2 rounded-md text-cream/80 hover:text-cream"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="sm:hidden border-t border-line/10 px-5 py-3 space-y-1">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-cream/70"
            >
              {link.label}
            </a>
          ))}
          <NavLink
            to="/login"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded-md text-sm text-cream/70"
          >
            Log in
          </NavLink>
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="block mt-2 px-4 py-2 rounded-md text-sm font-medium bg-accent text-ink text-center"
          >
            Get started
          </Link>
        </nav>
      )}
    </header>
  );
}   