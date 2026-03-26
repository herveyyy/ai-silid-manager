export default function DashboardLoading() {
  return (
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
  );
}
