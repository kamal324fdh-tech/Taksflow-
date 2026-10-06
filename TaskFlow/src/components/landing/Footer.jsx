export default function Footer() {
  return (
    <footer className="bg-ink text-cream/60 border-t border-cream/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span>TaskFlow</span>
        <span>&copy; {new Date().getFullYear()} TaskFlow. Built with React.</span>
      </div>
    </footer>
  );
}