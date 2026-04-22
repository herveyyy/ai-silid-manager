"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import type { PromptDailyPoint } from "@/lib/prompt-daily-stats";

export type SchoolPromptMetricsChartProps = {
  avgPromptsPerDay: number;
  avgTokensPerDay: number;
  avgTokensPerPrompt: number;
  totalEstCost: number;
  avgEstCostPerDay: number;
  avgEstCostPerPrompt: number;
  spanDays: number;
  activeDays: number;
  periodLabel: string;
  series: PromptDailyPoint[];
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

export function SchoolPromptMetricsChart({
  avgPromptsPerDay,
  avgTokensPerDay,
  avgTokensPerPrompt,
  totalEstCost,
  avgEstCostPerDay,
  avgEstCostPerPrompt,
  spanDays,
  activeDays,
  periodLabel,
  series,
}: SchoolPromptMetricsChartProps) {
  const hasDaily = series.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg prompts / day
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmt(avgPromptsPerDay, 4)}
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--muted)">
            total prompts ÷ {spanDays || "—"} calendar days (first→last log)
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg tokens / day
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmt(avgTokensPerDay, 2)}
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--muted)">
            sum token_ai_value ÷ same day span
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg tokens / prompt
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmt(avgTokensPerPrompt, 2)}
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--muted)">
            total tokens ÷ prompt count
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Est. total cost (parsed)
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmtCost(totalEstCost)}
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--muted)">
            sum of numeric / JSON from cost_value
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg est. cost / day
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmtCost(avgEstCostPerDay)}
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--muted)">
            parsed cost ÷ calendar day span
          </p>
        </div>
        <div className="theme-panel-strong border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Avg est. cost / prompt
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
            {fmtCost(avgEstCostPerPrompt)}
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-(--muted)">
            parsed cost ÷ prompt count
          </p>
        </div>
      </div>

      <p className="font-mono text-[11px] leading-relaxed text-(--muted-strong)">
        {periodLabel}
      </p>

      <div className="theme-panel-strong border p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
          Daily breakdown
        </p>
        <p className="mt-1 font-mono text-[11px] text-(--muted-strong)">
          Bars = prompts · green line = tokens · amber line = est. cost (
          {activeDays} day{activeDays === 1 ? "" : "s"} with activity)
        </p>
        {!hasDaily ? (
          <p className="mt-6 font-mono text-[12px] text-(--muted)">
            Add valid <code className="text-(--muted-strong)">created_at</code>{" "}
            on prompt rows to plot this chart.
          </p>
        ) : (
          <ChartContainer className="mt-4 h-[340px]!">
            <ComposedChart
              data={series}
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
                minTickGap={24}
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
                  const row = payload[0].payload as PromptDailyPoint;
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
                maxBarSize={48}
              />
              <Line
                yAxisId="tokens"
                type="monotone"
                dataKey="tokens"
                name="Tokens / day"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--chart-2)" }}
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
        )}
      </div>
    </div>
  );
}
