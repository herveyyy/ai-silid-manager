export function AdminStatCard({
  label,
  value,
  hint,
  alert,
}: {
  label: string;
  value: string;
  hint?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`border px-4 py-4 ${
        alert
          ? "border-(--danger)/50 bg-[color-mix(in_srgb,var(--danger)_14%,transparent)]"
          : "theme-panel-strong"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl tabular-nums text-foreground">{value}</p>
      {hint ? (
        <p className="mt-2 font-mono text-[10px] text-(--muted)">{hint}</p>
      ) : null}
    </div>
  );
}
