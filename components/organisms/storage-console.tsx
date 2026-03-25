"use client";

import { useMemo, useState } from "react";
import type { Attachment, AttachmentParentType } from "@/lib/admin-types";
import {
  formatBytes,
  mockAttachments,
  totalAttachmentBytes,
} from "@/lib/admin-mock-data";
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

export function StorageConsole() {
  const rows = mockAttachments;
  const used = totalAttachmentBytes(rows.filter((r) => !r.isDeleted));
  const [ceilingGb, setCeilingGb] = useState(50);
  const ceilingBytes = ceilingGb * 1024 ** 3;
  const pct = Math.min(100, (used / ceilingBytes) * 100);
  const byType = useMemo(() => bytesByParentType(rows), [rows]);

  const softDeleted = rows.filter((r) => r.isDeleted).length;
  const unusedMarked = rows.filter((r) => !r.isUsed && !r.isDeleted).length;

  return (
    <div className="space-y-8">
      <AdminPanel
        title="Storage ceiling"
        subtitle="Plan limit (UI only — wire to API / schools settings later)"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                Allocated capacity
              </p>
              <p className="mt-1 font-mono text-xl text-foreground">
                {ceilingGb} GB
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                Used (attachments.file_size aggregate)
              </p>
              <p className="mt-1 font-mono text-xl tabular-nums text-foreground">
                {formatBytes(used)}
              </p>
            </div>
          </div>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Adjust ceiling
            </span>
            <input
              type="range"
              min={1}
              max={500}
              value={ceilingGb}
              onChange={(e) => setCeilingGb(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--accent)]"
            />
          </label>
          <div
            className="h-2 w-full border bg-[var(--background)]"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className={`h-full ${pct > 90 ? "bg-[var(--danger)]" : "bg-[var(--success)]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="font-mono text-[11px] text-[var(--muted)]">
            Utilization {pct.toFixed(1)}% · schema: `attachments.file_size` (numeric)
          </p>
        </div>
      </AdminPanel>

      <AdminPanel
        title="Usage by parent_type"
        subtitle="attachment_type enum · excludes is_deleted rows from chart"
      >
        <ul className="space-y-2 font-mono text-[12px]">
          {Object.entries(byType)
            .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
            .map(([k, v]) => (
              <li
                key={k}
                className="flex justify-between border-b py-2 text-[var(--muted-strong)]"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="uppercase text-[var(--muted)]">{k}</span>
                <span className="tabular-nums text-foreground">{formatBytes(v ?? 0)}</span>
              </li>
            ))}
        </ul>
      </AdminPanel>

      <AdminPanel
        title="Attachment registry"
        subtitle="attachments · manage flags (frontend-only)"
      >
        <div className="mb-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
          <span>Soft-deleted rows: {softDeleted}</span>
          <span>·</span>
          <span>Unused & active: {unusedMarked}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse font-mono text-[11px]">
            <thead>
              <tr
                className="border-b text-left text-[var(--muted)]"
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
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b text-[var(--muted-strong)]"
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
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="theme-button-secondary border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors">
            Export manifest (mock)
          </button>
          <button
            type="button"
            className="border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
            style={{
              borderColor: "color-mix(in srgb, var(--danger) 50%, transparent)",
              color: "var(--danger)",
            }}
          >
            Purge soft-deleted (mock)
          </button>
        </div>
      </AdminPanel>
    </div>
  );
}
