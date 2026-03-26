import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="theme-grid pointer-events-none absolute inset-0 opacity-[0.85]" />
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
        SILID LMS // ADMIN NETWORK
      </div>
      <div className="pointer-events-none absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
        STATUS // ACTIVE
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <section className="space-y-8">
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-(--muted)">
                SILID LMS.00
              </p>
              <h1 className="max-w-4xl text-4xl font-bold uppercase leading-tight tracking-[0.14em] sm:text-5xl lg:text-6xl">
                Silid LMS
                <br />
                <span className="text-(--accent)">Admin Control Surface</span>
              </h1>
              <p className="max-w-2xl font-mono text-[13px] leading-7 text-(--muted)">
                Centralized oversight for the SILID LMS platform across schools,
                storage consumption, AI token usage, and tenant limits. Built for
                fast operations with a dark-first interface and a soft brown light
                mode when needed.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="theme-button inline-flex items-center justify-center border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors"
              >
                Open Admin Access
              </Link>
              <Link
                href="/dashboard"
                className="theme-button-secondary inline-flex items-center justify-center border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors"
              >
                View Dashboard
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="theme-panel-strong border p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">
                  Module
                </p>
                <p className="mt-3 text-2xl font-bold uppercase tracking-[0.12em]">
                  Schools
                </p>
                <p className="mt-2 font-mono text-[11px] leading-6 text-(--muted)">
                  Registry and tenant overview across the full fleet.
                </p>
              </div>
              <div className="theme-panel-strong border p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">
                  Module
                </p>
                <p className="mt-3 text-2xl font-bold uppercase tracking-[0.12em]">
                  Storage
                </p>
                <p className="mt-2 font-mono text-[11px] leading-6 text-(--muted)">
                  Track attachment load, soft deletes, and quota pressure.
                </p>
              </div>
              <div className="theme-panel-strong border p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">
                  Module
                </p>
                <p className="mt-3 text-2xl font-bold uppercase tracking-[0.12em]">
                  AI
                </p>
                <p className="mt-2 font-mono text-[11px] leading-6 text-(--muted)">
                  Inspect prompt activity, token spend, and model usage.
                </p>
              </div>
            </div>
          </section>

          <section className="theme-panel theme-inset-shadow border p-6 sm:p-8">
            <div className="border-b pb-5" style={{ borderColor: "var(--border)" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(--muted)">
                OPS SNAPSHOT
              </p>
              <p className="mt-3 text-xl font-bold uppercase tracking-[0.14em]">
                Command Summary
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="theme-panel-strong border p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                  School tenancy
                </p>
                <p className="mt-2 font-mono text-3xl text-(--accent)">MULTI-SITE</p>
              </div>
              <div className="theme-panel-strong border p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                  Access model
                </p>
                <p className="mt-2 font-mono text-3xl text-(--success)">AUTH READY</p>
              </div>
              <div className="theme-panel-strong border p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                  Interface mode
                </p>
                <p className="mt-2 font-mono text-3xl">DARK DEFAULT</p>
              </div>
            </div>

            <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--border)" }}>
              <p className="font-mono text-[11px] leading-6 text-(--muted)">
                Use the theme toggle to switch between the default dark console
                and the soft brown light mode. Continue to login for secured
                access, or open the dashboard directly while developing.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
