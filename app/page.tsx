import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="theme-grid pointer-events-none absolute inset-0 opacity-[0.85]" />
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
        SILID LMS // SCHOOLS
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
                <span className="text-(--accent)">Teaching &amp; learning</span>
              </h1>
              <p className="max-w-2xl font-mono text-[13px] leading-7 text-(--muted)">
                A platform for Philippine schools: classroom workflows, Silid-AI
                tools aligned with DepEd needs, and a calm interface that works
                in dark or soft light mode.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/school-plans"
                className="theme-button inline-flex items-center justify-center border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors"
              >
                School plans · Silid-AI
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
                  Organize campuses, sections, and classes in one place.
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
                  Keep learning materials and uploads easy to find and manage.
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
                  Silid-AI assists teachers and students with everyday tasks.
                </p>
              </div>
            </div>
          </section>

          <section className="theme-panel theme-inset-shadow border p-6 sm:p-8">
            <div className="border-b pb-5" style={{ borderColor: "var(--border)" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-(--muted)">
                AT A GLANCE
              </p>
              <p className="mt-3 text-xl font-bold uppercase tracking-[0.14em]">
                Platform snapshot
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
                <p className="mt-2 font-mono text-3xl text-(--success)">SECURE</p>
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
                Staff sign in through the URL your school provides—there is no
                public sign-in link here. Use the theme toggle where available for
                dark or soft brown light mode.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
