export function AdminPanel({
  title,
  subtitle,
  children,
  className = "",
  titleId,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  titleId?: string;
}) {
  return (
    <section
      className={`theme-panel border p-6 ${className}`}
    >
      <header className="mb-6 border-b pb-4" style={{ borderColor: "var(--border)" }}>
        <h2
          id={titleId}
          className="text-sm font-bold uppercase tracking-[0.2em] text-foreground"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-(--muted)">
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
