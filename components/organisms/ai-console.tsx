"use client";

import { useMemo, useState } from "react";
import { mockPromptLogs } from "@/lib/admin-mock-data";
import { AdminPanel } from "@/components/molecules/admin-panel";

export function AiConsole() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [featFilter, setFeatFilter] = useState<string>("all");

  const rows = mockPromptLogs;
  const featTypes = useMemo(
    () => Array.from(new Set(rows.map((r) => r.featType))).sort(),
    [rows],
  );
  const statuses = useMemo(
    () => Array.from(new Set(rows.map((r) => r.status))).sort(),
    [rows],
  );

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (featFilter !== "all" && r.featType !== featFilter) return false;
    return true;
  });

  const totalTokens = rows.reduce((a, r) => a + (r.tokenAiValue ?? 0), 0);
  const totalCredits = rows.reduce((a, r) => a + (r.creditsSpent ?? 0), 0);
  const byModel = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of rows) {
      const name = r.aiModelName ?? "unknown";
      m[name] = (m[name] ?? 0) + (r.tokenAiValue ?? 0);
    }
    return m;
  }, [rows]);

  return (
    <div className="space-y-8">
      <AdminPanel
        title="AI usage summary"
        subtitle="prompt · token_ai_value, credits_spent, ai_model_name"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Tokens (sum)
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {totalTokens.toLocaleString()}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Credits (sum)
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {totalCredits.toLocaleString()}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Runs
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {rows.length}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Tokens by ai_model_name
          </p>
          <ul className="mt-2 space-y-1 font-mono text-[12px] text-(--muted-strong)">
            {Object.entries(byModel)
              .sort((a, b) => b[1] - a[1])
              .map(([model, n]) => (
                <li
                  key={model}
                  className="flex justify-between border-b py-1"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span>{model}</span>
                  <span className="tabular-nums text-foreground">{n.toLocaleString()}</span>
                </li>
              ))}
          </ul>
        </div>
      </AdminPanel>

      <AdminPanel title="Filters" subtitle="Client-side · connect to query later">
        <div className="flex flex-wrap gap-6">
          <label className="font-mono text-[11px]">
            <span className="block uppercase tracking-[0.15em] text-(--muted)">
              status
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="theme-input mt-2 border px-3 py-2"
            >
              <option value="all">all</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="font-mono text-[11px]">
            <span className="block uppercase tracking-[0.15em] text-(--muted)">
              feat_type
            </span>
            <select
              value={featFilter}
              onChange={(e) => setFeatFilter(e.target.value)}
              className="theme-input mt-2 border px-3 py-2"
            >
              <option value="all">all</option>
              {featTypes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </AdminPanel>

      <AdminPanel title="Prompt log" subtitle="prompt table columns">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse font-mono text-[11px]">
            <thead>
              <tr
                className="border-b text-left text-(--muted)"
                style={{ borderColor: "var(--border-strong)" }}
              >
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  feat_type
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  status
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  ai_model_name
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  token_ai_value
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  credits_spent
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  prompt_title
                </th>
                <th className="pb-2 font-normal uppercase tracking-[0.12em]">
                  created_at
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b align-top text-(--muted-strong)"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="py-2 pr-3 text-foreground">{r.featType}</td>
                  <td className="py-2 pr-3 uppercase">{r.status}</td>
                  <td className="py-2 pr-3">{r.aiModelName ?? "—"}</td>
                  <td className="py-2 pr-3 tabular-nums">
                    {(r.tokenAiValue ?? 0).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 tabular-nums">{r.creditsSpent ?? 0}</td>
                  <td className="max-w-[140px] truncate py-2 pr-3" title={r.promptTitle ?? ""}>
                    {r.promptTitle ?? "—"}
                  </td>
                  <td className="py-2 text-(--muted)">
                    {r.createdAt?.slice(0, 19).replace("T", " ") ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
            <p className="mt-4 font-mono text-[12px] text-(--muted)">
            No rows match filters.
          </p>
        ) : null}
      </AdminPanel>
    </div>
  );
}
