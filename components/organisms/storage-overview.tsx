"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdminPanel } from "@/components/molecules/admin-panel";
import { AdminStatCard } from "@/components/molecules/admin-stat-card";
import { ChartContainer } from "@/components/ui/chart";
import { formatStorageSize, storageLimitMbToBytes } from "@/lib/storage.utils";
import type { SchoolUsageViewDTO } from "@/lib/types/admin-types";

export type StorageOverviewProps = {
  attachmentRowsCount: number;
  activeAttachmentsCount: number;
  deletedAttachmentsCount: number;
  storedBytesActive: number;
  schoolsUsage: SchoolUsageViewDTO[];
};

function truncateLabel(name: string, max = 20): string {
  const t = name.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function prepareStorageQuotaChart(schools: SchoolUsageViewDTO[]) {
  const finite = schools.filter((s) => !s.unlimitedStorage && Number(s.storageLimit) > 0);
  return [...finite]
    .sort(
      (a, b) =>
        Number(b.storageUsedBytes) /
          storageLimitMbToBytes(Number(b.storageLimit)) -
        Number(a.storageUsedBytes) /
          storageLimitMbToBytes(Number(a.storageLimit)),
    )
    .slice(0, 14)
    .map((s) => {
      const quota = storageLimitMbToBytes(Number(s.storageLimit));
      const used = Number(s.storageUsedBytes);
      const pct = Math.min(100, quota > 0 ? (used / quota) * 100 : 0);
      return {
        id: s.id,
        name: truncateLabel(s.name),
        fullName: s.name,
        pct,
        used,
        quota,
      };
    });
}

function prepareTokenQuotaChart(schools: SchoolUsageViewDTO[]) {
  const finite = schools.filter((s) => !s.unlimitedToken && Number(s.tokenLimit) > 0);
  return [...finite]
    .sort(
      (a, b) =>
        Number(b.tokensUsed) / Number(b.tokenLimit) -
        Number(a.tokensUsed) / Number(a.tokenLimit),
    )
    .slice(0, 14)
    .map((s) => {
      const quota = Number(s.tokenLimit);
      const used = Number(s.tokensUsed);
      const pct = Math.min(100, quota > 0 ? (used / quota) * 100 : 0);
      return {
        id: s.id,
        name: truncateLabel(s.name),
        fullName: s.name,
        pct,
        used,
        quota,
      };
    });
}

export function StorageOverview({
  attachmentRowsCount,
  activeAttachmentsCount,
  deletedAttachmentsCount,
  storedBytesActive,
  schoolsUsage,
}: StorageOverviewProps) {
  const storageChartRows = prepareStorageQuotaChart(schoolsUsage);
  const tokenChartRows = prepareTokenQuotaChart(schoolsUsage);

  const unlimitedStorageCount = schoolsUsage.filter((s) => s.unlimitedStorage).length;
  const unlimitedTokenCount = schoolsUsage.filter((s) => s.unlimitedToken).length;

  const chartHeight = (rows: number) =>
    Math.min(520, Math.max(220, 48 + rows * 36));

  return (
    <AdminPanel
      titleId="storage-overview-heading"
      title="Storage overview"
      subtitle="attachments · aggregates + schools.storage_limit vs attributed usage"
    >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            label="Attachment rows"
            value={attachmentRowsCount.toLocaleString()}
            hint="All rows in attachments"
          />
          <AdminStatCard
            label="Active (not deleted)"
            value={activeAttachmentsCount.toLocaleString()}
            hint="is_deleted = 0"
          />
          <AdminStatCard
            label="Marked deleted"
            value={deletedAttachmentsCount.toLocaleString()}
            hint="is_deleted ≠ 0"
          />
          <AdminStatCard
            label="Stored (active)"
            value={formatStorageSize(storedBytesActive)}
            hint="Sum of file_size · decimal steps (1000 B → kB → MB → GB)"
          />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <div className="theme-panel-strong min-w-0 border p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              School storage limits
            </p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-(--muted-strong)">
              Usage ÷ quota (<span className="text-(--muted)">storage_limit</span> in MB)
              per school
              (attachments by school users). Capped at 100% on chart; see tooltip for
              overflow.
            </p>
            {storageChartRows.length === 0 ? (
              <p className="mt-6 font-mono text-[12px] text-(--muted)">
                No schools with a finite storage quota — all unlimited or limit is 0.
              </p>
            ) : (
              <ChartContainer
                className="mt-4 w-full min-w-0"
                style={{ height: chartHeight(storageChartRows.length) }}
              >
                <BarChart
                  data={storageChartRows}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={108}
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    interval={0}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0].payload as (typeof storageChartRows)[0];
                      const over =
                        row.used > row.quota ? row.used - row.quota : 0;
                      return (
                        <div className="theme-panel-strong max-w-[280px] rounded border px-3 py-2 font-mono shadow-md">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                            {row.fullName}
                          </p>
                          <p className="mt-2 text-[11px] text-foreground">
                            Used:{" "}
                            <span className="tabular-nums">
                              {formatStorageSize(row.used)}
                            </span>
                          </p>
                          <p className="text-[11px] text-foreground">
                            Quota:{" "}
                            <span className="tabular-nums">
                              {formatStorageSize(row.quota)}
                            </span>
                          </p>
                          <p className="mt-1 text-[11px] text-foreground">
                            Of quota:{" "}
                            <span className="tabular-nums">{row.pct.toFixed(1)}%</span>
                          </p>
                          {over > 0 ? (
                            <p className="mt-1 text-[11px] text-(--danger)">
                              Over quota: {formatStorageSize(over)}
                            </p>
                          ) : null}
                        </div>
                      );
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: 11,
                      paddingTop: 12,
                    }}
                  />
                  <Bar
                    dataKey="pct"
                    name="% of storage quota"
                    fill="var(--chart-1)"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ChartContainer>
            )}
            {unlimitedStorageCount > 0 ? (
              <p className="mt-3 font-mono text-[10px] text-(--muted)">
                {unlimitedStorageCount} school
                {unlimitedStorageCount === 1 ? "" : "s"} with unlimited storage (not
                shown).
              </p>
            ) : null}
          </div>

          <div className="theme-panel-strong min-w-0 border p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              School token limits
            </p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-(--muted-strong)">
              Tokens attributed via <span className="text-(--muted)">prompt</span> ·{" "}
              <span className="text-(--muted)">token_limit</span> per school.
            </p>
            {tokenChartRows.length === 0 ? (
              <p className="mt-6 font-mono text-[12px] text-(--muted)">
                No schools with a finite token quota — all unlimited or limit is 0.
              </p>
            ) : (
              <ChartContainer
                className="mt-4 w-full min-w-0"
                style={{ height: chartHeight(tokenChartRows.length) }}
              >
                <BarChart
                  data={tokenChartRows}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={108}
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    interval={0}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0].payload as (typeof tokenChartRows)[0];
                      const over =
                        row.used > row.quota ? row.used - row.quota : 0;
                      return (
                        <div className="theme-panel-strong max-w-[260px] rounded border px-3 py-2 font-mono shadow-md">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                            {row.fullName}
                          </p>
                          <p className="mt-2 text-[11px] text-foreground">
                            Used:{" "}
                            <span className="tabular-nums">
                              {row.used.toLocaleString()}
                            </span>
                          </p>
                          <p className="text-[11px] text-foreground">
                            Limit:{" "}
                            <span className="tabular-nums">
                              {row.quota.toLocaleString()}
                            </span>
                          </p>
                          <p className="mt-1 text-[11px] text-foreground">
                            Of limit:{" "}
                            <span className="tabular-nums">{row.pct.toFixed(1)}%</span>
                          </p>
                          {over > 0 ? (
                            <p className="mt-1 text-[11px] text-(--danger)">
                              Over limit: {over.toLocaleString()} tokens
                            </p>
                          ) : null}
                        </div>
                      );
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: 11,
                      paddingTop: 12,
                    }}
                  />
                  <Bar
                    dataKey="pct"
                    name="% of token limit"
                    fill="var(--chart-2)"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ChartContainer>
            )}
            {unlimitedTokenCount > 0 ? (
              <p className="mt-3 font-mono text-[10px] text-(--muted)">
                {unlimitedTokenCount} school
                {unlimitedTokenCount === 1 ? "" : "s"} with unlimited tokens (not
                shown).
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/storage"
            className="theme-button-secondary inline-flex border px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors"
          >
            Open storage console
          </Link>
          <Link
            href="/dashboard/ai"
            className="theme-button-secondary inline-flex border px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors"
          >
            AI models & prompts
          </Link>
          <Link
            href="/dashboard/schools"
            className="theme-button-secondary inline-flex border px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors"
          >
            School list & quotas
          </Link>
        </div>
      </AdminPanel>
  );
}
