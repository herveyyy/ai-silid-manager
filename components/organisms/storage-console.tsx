"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  Attachment,
  AttachmentParentType,
  PaginatedAttachmentsDTO,
} from "@/lib/types/admin-types";
import { formatBytes, totalAttachmentBytes } from "@/lib/admin-mock-data";
import { AdminPanel } from "@/components/molecules/admin-panel";

function bytesByParentType(rows: Attachment[]): Partial<
  Record<AttachmentParentType | "unknown", number>
> {
  const m: Partial<Record<AttachmentParentType | "unknown", number>> = {};
  for (const r of rows) {
    if (r.isDeleted) continue;
    const key = (r.parentType ?? "unknown") as AttachmentParentType | "unknown";
    m[key] = (m[key] ?? 0) + Number(r.fileSize || 0);
  }
  return m;
}

export function StorageConsole({
  rows,
  paginatedAttachments,
  parentTypes,
}: {
  rows: Attachment[];
  paginatedAttachments: PaginatedAttachmentsDTO;
  parentTypes: readonly AttachmentParentType[];
}) {
  const { rows: paginatedRows, total, page, limit, offset } = paginatedAttachments;
  const used = totalAttachmentBytes(rows.filter((r) => !r.isDeleted));
  const [ceilingGb, setCeilingGb] = useState(50);
  const ceilingBytes = ceilingGb * 1024 ** 3;
  const pct = Math.min(100, (used / ceilingBytes) * 100);
  const byType = useMemo(() => bytesByParentType(rows), [rows]);
  const byTypeRows = [
    ...parentTypes.map((type) => ({
      key: type,
      value: byType[type] ?? 0,
    })),
    ...(byType.unknown !== undefined
      ? [{ key: "unknown" as const, value: byType.unknown ?? 0 }]
      : []),
  ];

  const softDeleted = rows.filter((r) => r.isDeleted).length;
  const unusedMarked = rows.filter((r) => !r.isUsed && !r.isDeleted).length;
  const hasPrevious = offset > 0;
  const hasNext = offset + paginatedRows.length < total;

  function createPageHref(nextPage: number, nextOffset: number): string {
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(limit),
      offset: String(nextOffset),
    });

    return `/dashboard/storage?${params.toString()}`;
  }

  return (
    <div className="space-y-8">
      <AdminPanel
        title="Storage ceiling"
        subtitle="Plan limit (UI only) against live attachments usage"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                Allocated capacity
              </p>
              <p className="mt-1 font-mono text-xl text-foreground">
                {ceilingGb} GB
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                Used (attachments.file_size aggregate)
              </p>
              <p className="mt-1 font-mono text-xl tabular-nums text-foreground">
                {formatBytes(used)}
              </p>
            </div>
          </div>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Adjust ceiling
            </span>
            <input
              type="range"
              min={1}
              max={500}
              value={ceilingGb}
              onChange={(e) => setCeilingGb(Number(e.target.value))}
              className="mt-3 w-full accent-(--accent)"
            />
          </label>
          <div
            className="h-2 w-full border bg-background"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className={`h-full ${pct > 90 ? "bg-(--danger)" : "bg-(--success)"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="font-mono text-[11px] text-(--muted)">
            Utilization {pct.toFixed(1)}% · schema: `attachments.file_size` (numeric)
          </p>
        </div>
      </AdminPanel>

      <AdminPanel
        title="Usage by parent_type"
        subtitle="attachment_type enum from schema · excludes is_deleted rows"
      >
        <ul className="space-y-2 font-mono text-[12px]">
          {byTypeRows
            .sort((a, b) => b.value - a.value)
            .map(({ key, value }) => (
              <li
                key={key}
                className="flex justify-between border-b py-2 text-(--muted-strong)"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="uppercase text-(--muted)">{key}</span>
                <span className="tabular-nums text-foreground">{formatBytes(value)}</span>
              </li>
            ))}
        </ul>
      </AdminPanel>

      <AdminPanel
        title="Attachment registry"
        subtitle="attachments table · live rows from controller"
      >
        <div className="mb-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
          <span>Soft-deleted rows: {softDeleted}</span>
          <span>·</span>
          <span>Unused & active: {unusedMarked}</span>
        </div>
        <div className="divide-y md:hidden" style={{ borderColor: "var(--border)" }}>
          {paginatedRows.map((r) => (
            <article key={r.id} className="space-y-4 py-4">
              <div className="min-w-0">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                  attachment
                </p>
                <h3 className="wrap-break-word text-sm font-semibold text-foreground">
                  {r.fileName}
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="theme-panel-strong border px-3 py-2">
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    file_size
                  </dt>
                  <dd className="mt-1 tabular-nums text-foreground">
                    {formatBytes(Number(r.fileSize))}
                  </dd>
                </div>
                <div className="theme-panel-strong border px-3 py-2">
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    parent_type
                  </dt>
                  <dd className="mt-1 uppercase text-foreground">
                    {r.parentType ?? "—"}
                  </dd>
                </div>
                <div className="theme-panel-strong border px-3 py-2">
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    is_used
                  </dt>
                  <dd className="mt-1 text-foreground">{r.isUsed ? "true" : "false"}</dd>
                </div>
                <div className="theme-panel-strong border px-3 py-2">
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    is_deleted
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {r.isDeleted ? "true" : "false"}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-collapse font-mono text-[11px]">
            <thead>
              <tr
                className="border-b text-left text-(--muted)"
                style={{ borderColor: "var(--border-strong)" }}
              >
                <th className="pb-2 pr-4 font-normal uppercase tracking-[0.15em]">
                  file_name
                </th>
                <th className="pb-2 pr-4 font-normal uppercase tracking-[0.15em]">
                  file_size
                </th>
                <th className="pb-2 pr-4 font-normal uppercase tracking-[0.15em]">
                  parent_type
                </th>
                <th className="pb-2 pr-4 font-normal uppercase tracking-[0.15em]">
                  is_used
                </th>
                <th className="pb-2 font-normal uppercase tracking-[0.15em]">
                  is_deleted
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b text-(--muted-strong)"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="py-2 pr-4 text-foreground">{r.fileName}</td>
                  <td className="py-2 pr-4 tabular-nums">{formatBytes(Number(r.fileSize))}</td>
                  <td className="py-2 pr-4 uppercase">{r.parentType ?? "—"}</td>
                  <td className="py-2 pr-4">{r.isUsed ? "true" : "false"}</td>
                  <td className="py-2">{r.isDeleted ? "true" : "false"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
          attachments · showing {paginatedRows.length} of {total} · page {page} ·
          {" "}offset {offset} · limit {limit}
        </p>
        <div className="mt-4 flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted) sm:flex-row sm:items-center sm:justify-between">
          <span className="w-full sm:w-auto">
            {hasPrevious ? (
              <Link
                href={createPageHref(page - 1, Math.max(offset - limit, 0))}
                className="theme-button-secondary inline-block w-full border px-3 py-1.5 text-center font-semibold tracking-[0.2em] transition-colors sm:w-auto"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-block w-full border px-3 py-1.5 text-center opacity-50 sm:w-auto">
                Previous
              </span>
            )}
          </span>
          <span className="w-full sm:w-auto">
            {hasNext ? (
              <Link
                href={createPageHref(page + 1, offset + limit)}
                className="theme-button-secondary inline-block w-full border px-3 py-1.5 text-center font-semibold tracking-[0.2em] transition-colors sm:w-auto"
              >
                Next
              </Link>
            ) : (
              <span className="inline-block w-full border px-3 py-1.5 text-center opacity-50 sm:w-auto">
                Next
              </span>
            )}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="theme-button-secondary border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors">
            Export manifest
          </button>
          <button
            type="button"
            className="border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
            style={{
              borderColor: "color-mix(in srgb, var(--danger) 50%, transparent)",
              color: "var(--danger)",
            }}
          >
            Purge soft-deleted
          </button>
        </div>
      </AdminPanel>
    </div>
  );
}
