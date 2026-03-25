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
    <div className="theme-panel overflow-x-auto border">
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
      <p
        className="border-t px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)"
        style={{ borderColor: "var(--border)" }}
      >
        schools table · {schools.length} row{schools.length === 1 ? "" : "s"} (mock)
      </p>
    </div>
  );
}
