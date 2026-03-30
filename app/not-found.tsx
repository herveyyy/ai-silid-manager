import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found · Silid Schools",
  description: "This page does not exist",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans text-foreground">
      <div className="theme-grid pointer-events-none absolute inset-0 opacity-[0.85]" />
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
        ROUTE // NULL
      </div>
      <div className="pointer-events-none absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
        HTTP // 404
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
        <div className="theme-panel theme-inset-shadow border px-8 py-10">
          <header
            className="mb-8 space-y-2 border-b pb-8"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-(--muted)">
              ERR.404
            </p>
            <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-foreground md:text-2xl">
              Page not found
            </h1>
            <p className="font-mono text-[12px] leading-relaxed text-(--muted)">
              Nothing lives at this path. Check the URL or return to a known
              entry point.
            </p>
          </header>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/"
              className="theme-button inline-flex items-center justify-center border px-5 py-2.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/school-plans"
              className="theme-button-secondary inline-flex items-center justify-center border px-5 py-2.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              School plans
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
