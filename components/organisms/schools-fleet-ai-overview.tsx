"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import type {
  GlobalPromptOverviewDay,
  GlobalPromptOverviewDTO,
} from "@/lib/types/admin-types";

export type SchoolsFleetAiOverviewProps = GlobalPromptOverviewDTO & {
  schoolsInFleet: number;
  schoolsWithAiEnabled: number;
};

function fmt(n: number, maxFrac = 2) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFrac,
  });
}

function fmtCost(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
}

export function SchoolsFleetAiOverview({
  schoolsInFleet,
  schoolsWithAiEnabled,
  totalPrompts,
  totalTokens,
  totalCredits,
  totalEstCost,
  completed,
  failed,
  running,
  otherStatus,
  avgPromptsPerDay,
  avgTokensPerDay,
  avgEstCostPerDay,
  avgTokensPerPrompt,
  avgEstCostPerPrompt,
  spanDays,
  periodLabel,
  trackedCalendarDays,
  dailySeriesTruncated,
  dailySeries,
}: SchoolsFleetAiOverviewProps) {
  const outcomeRows = [
    {
      key: "completed",
      name: "Completed",
      value: completed,
      fill: "var(--success)",
      hint: "done · success · succeeded",
    },
    {
      key: "errors",
      name: "Errors",
      value: failed,
      fill: "var(--danger)",
      hint: "failed · error statuses",
    },
    {
      key: "in_progress",
      name: "In progress",
      value: running,
      fill: "var(--accent)",
      hint: "running · pending · queued",
    },
    {
      key: "other",
      name: "Other",
      value: otherStatus,
      fill: "var(--muted)",
      hint: "other statuses",
    },
  ];

  const outcomePositive = outcomeRows.filter((r) => r.value > 0);
  const hasDaily = dailySeries.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Schools in fleet
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {schoolsInFleet.toLocaleString()}
          </p>
          <p className="mt-2 font-mono text-[11px] tabular-nums text-(--muted-strong)">
            <span className="text-(--success)">
              {schoolsWithAiEnabled.toLocaleString()}
            </span>{" "}
            <span className="uppercase tracking-[0.12em] text-(--muted)">
              with AI enabled
            </span>
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--muted)">
            tenants in usage view
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Total prompts (all schools)
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {totalPrompts.toLocaleString()}
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Total tokens
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {totalTokens.toLocaleString()}
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Total credits spent
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {totalCredits.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Est. total cost (parsed)
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmtCost(totalEstCost)}
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--muted)">
            from cost_value across all prompts
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg prompts / day (fleet)
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmt(avgPromptsPerDay, 4)}
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--muted)">
            ÷ {spanDays || "—"} calendar days (first→last log)
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg tokens / day (fleet)
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmt(avgTokensPerDay, 2)}
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg est. cost / day
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmtCost(avgEstCostPerDay)}
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg tokens / prompt
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmt(avgTokensPerPrompt, 2)}
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg est. cost / prompt
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmtCost(avgEstCostPerPrompt)}
          </p>
        </div>
      </div>

      <p className="font-mono text-[11px] leading-relaxed text-(--muted-strong)">
        {periodLabel}
        {trackedCalendarDays > 0 ? (
          <>
            {" "}
            · <span className="text-(--muted)">{trackedCalendarDays}</span>{" "}
            calendar day(s) with ≥1 prompt
          </>
        ) : null}
        {dailySeriesTruncated ? (
          <span className="block pt-1 text-(--muted)">
            Daily chart shows the last 90 days when history is longer.
          </span>
        ) : null}
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="theme-panel-strong border p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Outcomes (fleet-wide)
          </p>
          <p className="mt-1 font-mono text-[11px] text-(--muted-strong)">
            All prompts · status buckets
          </p>
          {outcomePositive.length === 0 ? (
            <p className="mt-8 font-mono text-[12px] text-(--muted)">
              No outcome slices.
            </p>
          ) : (
            <ChartContainer className="mt-4 h-[280px]">
              <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Pie
                  data={outcomePositive}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {outcomePositive.map((entry) => (
                    <Cell key={entry.key} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0].payload as (typeof outcomeRows)[0];
                    return (
                      <div className="theme-panel-strong rounded border px-3 py-2 font-mono shadow-md">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                          {p.name}
                        </p>
                        <p className="mt-1 text-lg tabular-nums text-foreground">
                          {p.value.toLocaleString()}
                        </p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-(--muted)">
                          {p.hint}
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ChartContainer>
          )}
        </div>

        <div className="theme-panel-strong border p-4 lg:col-span-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Daily trend (fleet)
          </p>
          <p className="mt-1 font-mono text-[11px] text-(--muted-strong)">
            Bars = prompts · green = tokens · amber = est. cost
          </p>
          {!hasDaily ? (
            <p className="mt-8 font-mono text-[12px] text-(--muted)">
              Need <code className="text-(--muted-strong)">created_at</code> on
              prompts to plot days.
            </p>
          ) : (
            <div className="w-full min-w-0 [&_.recharts-bar-rectangles_path]:fill-(--chart-1)">
              <ChartContainer className="mt-4 h-[340px]">
                <ComposedChart
                  data={dailySeries}
                  margin={{ top: 12, right: 24, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={{ stroke: "var(--border-strong)" }}
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    tickFormatter={(v) => {
                      const s = String(v);
                      const [, m, d] = s.split("-");
                      return m && d ? `${m}/${d}` : s;
                    }}
                    interval="preserveStartEnd"
                    minTickGap={20}
                  />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={{ stroke: "var(--border-strong)" }}
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    allowDecimals={false}
                    label={{
                      value: "Prompts",
                      angle: -90,
                      position: "insideLeft",
                      fill: "var(--chart-1)",
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    yAxisId="tokens"
                    orientation="right"
                    tickLine={false}
                    axisLine={{ stroke: "var(--border-strong)" }}
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    tickFormatter={(v) => fmt(Number(v), 0)}
                    width={56}
                    label={{
                      value: "Tokens",
                      angle: 90,
                      position: "insideRight",
                      fill: "var(--chart-2)",
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    yAxisId="cost"
                    orientation="right"
                    tickLine={false}
                    axisLine={{ stroke: "var(--border-strong)" }}
                    tick={{ fill: "var(--muted)", fontSize: 9 }}
                    tickFormatter={(v) => fmtCost(Number(v))}
                    width={64}
                    label={{
                      value: "Est. cost",
                      angle: 90,
                      position: "insideRight",
                      fill: "var(--chart-3)",
                      fontSize: 10,
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0].payload as GlobalPromptOverviewDay;
                      return (
                        <div className="theme-panel-strong max-w-[260px] rounded border px-3 py-2 font-mono shadow-md">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                            {row.day}
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            Prompts:{" "}
                            <span className="tabular-nums">{row.prompts}</span>
                          </p>
                          <p className="text-sm text-foreground">
                            Tokens:{" "}
                            <span className="tabular-nums">
                              {row.tokens.toLocaleString()}
                            </span>
                          </p>
                          <p className="text-sm text-foreground">
                            Est. cost:{" "}
                            <span className="tabular-nums">{fmtCost(row.cost)}</span>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: 11,
                      paddingTop: 16,
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="prompts"
                    name="Prompts / day"
                    fill="var(--chart-1)"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={36}
                  />
                  <Line
                    yAxisId="tokens"
                    type="monotone"
                    dataKey="tokens"
                    name="Tokens / day"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "var(--chart-2)" }}
                  />
                  <Line
                    yAxisId="cost"
                    type="monotone"
                    dataKey="cost"
                    name="Est. cost / day"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "var(--accent)" }}
                  />
                </ComposedChart>
              </ChartContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
