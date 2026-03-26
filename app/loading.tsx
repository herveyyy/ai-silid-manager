export default function DashboardLoading() {
  return (
    <div className="flex h-screen bg-background font-sans text-foreground">
      <div className="theme-grid pointer-events-none fixed inset-0 opacity-[0.85]" />

      <aside className="theme-panel-strong relative z-10 flex w-56 shrink-0 flex-col border-r">
        <div
          className="flex w-full justify-between border-b px-4 py-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-(--muted)">
              Silid admin
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Schools fleet
            </p>
          </div>
          <div className="h-10 w-10 animate-pulse rounded-full border theme-panel" />
        </div>

        <nav className="flex flex-1 flex-col gap-2 p-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="theme-panel h-12 animate-pulse border"
            />
          ))}
        </nav>

        <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
          <div className="h-3 w-32 animate-pulse rounded bg-(--surface-soft)" />
          <div className="mt-3 h-3 w-20 animate-pulse rounded bg-(--surface-soft)" />
        </div>
      </aside>

      <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col">
        <header
          className="theme-panel flex shrink-0 items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
              Operations console
            </p>
            <div className="mt-2 h-4 w-44 animate-pulse rounded bg-(--surface-soft)" />
          </div>
          <div className="text-right">
            <div className="ml-auto h-3 w-24 animate-pulse rounded bg-(--surface-soft)" />
            <div className="mt-2 ml-auto h-3 w-28 animate-pulse rounded bg-(--surface-soft)" />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
                Loading dashboard
              </p>
              <div className="mt-3 h-8 w-56 animate-pulse rounded bg-(--surface-soft)" />
              <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-(--surface-soft)" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="theme-panel-strong space-y-4 border p-4"
                >
                  <div className="h-3 w-24 animate-pulse rounded bg-(--surface-soft)" />
                  <div className="h-8 w-28 animate-pulse rounded bg-(--surface-soft)" />
                  <div className="h-3 w-32 animate-pulse rounded bg-(--surface-soft)" />
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <section className="theme-panel border p-6">
                <div
                  className="mb-6 border-b pb-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="h-4 w-40 animate-pulse rounded bg-(--surface-soft)" />
                  <div className="mt-3 h-3 w-64 animate-pulse rounded bg-(--surface-soft)" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="theme-panel-strong h-12 animate-pulse border"
                    />
                  ))}
                </div>
              </section>

              <section className="theme-panel border p-6">
                <div
                  className="mb-6 border-b pb-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="h-4 w-32 animate-pulse rounded bg-(--surface-soft)" />
                  <div className="mt-3 h-3 w-40 animate-pulse rounded bg-(--surface-soft)" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="theme-panel-strong h-16 animate-pulse border"
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
