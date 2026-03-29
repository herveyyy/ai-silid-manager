import Link from "next/link";
import type { SchoolDTO } from "@/lib/types/admin-types";

function shortId(id: string): string {
  return `${id.slice(0, 8)}…`;
}

function formatTs(iso: string): string {
  return iso.slice(0, 10);
}

export function SchoolsDirectory({ schools }: { schools: SchoolDTO[] }) {
  return (
    <div className="theme-panel border">
      <div className="divide-y md:hidden" style={{ borderColor: "var(--border)" }}>
        {schools.map((s) => (
          <article key={s.id} className="space-y-4 px-4 py-4">
            <div className="min-w-0">
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                school
              </p>
              <Link
                href={`/dashboard/schools/${s.id}`}
                className="block truncate text-sm font-semibold uppercase tracking-[0.08em] text-foreground underline-offset-2 hover:underline"
              >
                {s.name}
              </Link>
              <p className="mt-1 font-mono text-[11px] uppercase text-(--muted)">
                {s.schoolCode}
              </p>
            </div>

            <dl className="grid grid-cols-1 gap-3 font-mono text-[11px]">
              <div className="theme-panel-strong border px-3 py-2">
                <dt className="uppercase tracking-[0.15em] text-(--muted)">
                  username
                </dt>
                <dd className="mt-1 text-foreground">{s.username ?? "—"}</dd>
              </div>
              <div className="theme-panel-strong border px-3 py-2">
                <dt className="uppercase tracking-[0.15em] text-(--muted)">
                  site
                </dt>
                <dd className="mt-1 wrap-break-word text-foreground">{s.site}</dd>
              </div>
              <div className="theme-panel-strong border px-3 py-2">
                <dt className="uppercase tracking-[0.15em] text-(--muted)">
                  created_at
                </dt>
                <dd className="mt-1 tabular-nums text-foreground">
                  {formatTs(s.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                  id
                </dt>
                <dd className="mt-1 break-all font-mono text-[10px] text-(--muted-strong)">
                  {s.id}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[880px] border-collapse font-mono text-[11px]">
          <thead>
            <tr
              className="theme-panel-strong border-b text-left text-(--muted)"
              style={{ borderColor: "var(--border-strong)" }}
            >
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                name
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                school_code
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                username
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                site
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                created_at
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                id
              </th>
            </tr>
          </thead>
          <tbody>
            {schools.map((s) => (
              <tr
                key={s.id}
                className="theme-table-row border-b text-(--muted-strong) transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link
                    href={`/dashboard/schools/${s.id}`}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    {s.name}
                  </Link>
                </td>
                <td className="px-4 py-3 uppercase tabular-nums">{s.schoolCode}</td>
                <td className="px-4 py-3 text-(--muted)">
                  {s.username ?? "—"}
                </td>
                <td className="max-w-[220px] truncate px-4 py-3 text-(--muted)" title={s.site}>
                  {s.site}
                </td>
                <td className="px-4 py-3 tabular-nums text-(--muted)">
                  {formatTs(s.createdAt)}
                </td>
                <td className="px-4 py-3 text-(--muted)" title={s.id}>
                  {shortId(s.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        className="border-t px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)"
        style={{ borderColor: "var(--border)" }}
      >
        schools table · {schools.length} row{schools.length === 1 ? "" : "s"} (mock)
      </p>
    </div>
  );
}
