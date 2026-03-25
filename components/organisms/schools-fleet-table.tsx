"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { School, SchoolAdminMetrics } from "@/lib/admin-types";
import { formatBytes } from "@/lib/admin-mock-data";
import {
  readQuotaOverride,
  SCHOOL_QUOTA_STORAGE_KEY,
} from "@/lib/school-quota-storage";

function shortId(id: string): string {
  return `${id.slice(0, 8)}…`;
}

function mergeMetrics(
  schoolId: string,
  base: SchoolAdminMetrics,
): SchoolAdminMetrics {
  const o = readQuotaOverride(schoolId);
  if (!o) return base;
  return { ...base, ...o };
}

export function SchoolsFleetTable({
  rows,
}: {
  rows: { school: School; metrics: SchoolAdminMetrics }[];
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    bump();
    const onStorage = (e: StorageEvent) => {
      if (e.key === SCHOOL_QUOTA_STORAGE_KEY) bump();
    };
    window.addEventListener("silid-school-quotas-updated", bump);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("silid-school-quotas-updated", bump);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <div className="theme-panel overflow-x-auto border">
      <table className="w-full min-w-[960px] border-collapse font-mono text-[11px]">
        <thead>
          <tr
            className="theme-panel-strong border-b text-left text-[var(--muted)]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
              name
            </th>
            <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
              school_code
            </th>
            <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
              storage
            </th>
            <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
              tokens
            </th>
            <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
              id
            </th>
            <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
              —
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ school, metrics }) => {
            const m = mergeMetrics(school.id, metrics);
            void tick;
            const storageLabel = `${formatBytes(m.storageUsedBytes)} / ${formatBytes(m.quotaStorageBytes)}`;
            const tokenLabel = `${m.tokensUsed.toLocaleString()} / ${m.quotaTokens.toLocaleString()}`;
            return (
              <tr
                key={school.id}
                className="theme-table-row border-b text-[var(--muted-strong)] transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-4 py-3 font-medium text-foreground">{school.name}</td>
                <td className="px-4 py-3 uppercase tabular-nums">
                  {school.schoolCode}
                </td>
                <td
                  className="max-w-[200px] truncate px-4 py-3 tabular-nums text-[var(--muted)]"
                  title={storageLabel}
                >
                  {storageLabel}
                </td>
                <td
                  className="max-w-[200px] truncate px-4 py-3 tabular-nums text-[var(--muted)]"
                  title={tokenLabel}
                >
                  {tokenLabel}
                </td>
                <td
                  className="px-4 py-3 text-[var(--muted)]"
                  title={school.id}
                >
                  {shortId(school.id)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/schools/${school.id}`}
                    className="theme-button-secondary inline-block border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
                  >
                    Profile
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p
        className="border-t px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]"
        style={{ borderColor: "var(--border)" }}
      >
        schools · usage & quotas (mock) · local quota overrides apply in this
        browser
      </p>
    </div>
  );
}
