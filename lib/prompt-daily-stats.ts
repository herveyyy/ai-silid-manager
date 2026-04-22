import type { PromptLog } from "@/lib/types/admin-types";

export type PromptDailyPoint = {
    day: string;
    prompts: number;
    tokens: number;
    cost: number;
};

/** Parse `prompt.cost_value` text when numeric or JSON with amount-like keys. */
export function parsePromptCostValue(raw: string | null): number {
    if (raw == null) return 0;
    const t = String(raw).trim();
    if (!t) return 0;
    const n = Number(t);
    if (Number.isFinite(n)) return n;
    try {
        const j = JSON.parse(t) as unknown;
        if (typeof j === "number" && Number.isFinite(j)) return j;
        if (j && typeof j === "object" && j !== null) {
            const o = j as Record<string, unknown>;
            for (const key of ["total", "amount", "cost", "value", "usd"]) {
                const v = o[key];
                if (typeof v === "number" && Number.isFinite(v)) return v;
                if (typeof v === "string") {
                    const parsed = Number(v.trim());
                    if (Number.isFinite(parsed)) return parsed;
                }
            }
        }
    } catch {
        /* non-json or malformed */
    }
    return 0;
}

/** Buckets + rates from `prompt.created_at` for this school’s logs. */
export function buildPromptDailyStats(logs: PromptLog[]) {
    const n = logs.length;
    if (n === 0) {
        return {
            avgPromptsPerDay: 0,
            avgTokensPerDay: 0,
            avgTokensPerPrompt: 0,
            totalEstCost: 0,
            avgEstCostPerDay: 0,
            avgEstCostPerPrompt: 0,
            spanDays: 0,
            activeDays: 0,
            periodLabel: "No prompts yet",
            series: [] as PromptDailyPoint[],
        };
    }

    const totalTokens = logs.reduce((a, r) => a + (r.tokenAiValue ?? 0), 0);
    const totalEstCost = logs.reduce(
        (a, r) => a + parsePromptCostValue(r.costValue),
        0,
    );
    const avgTokensPerPrompt = totalTokens / n;
    const avgEstCostPerPrompt = totalEstCost / n;

    const byDay = new Map<
        string,
        { prompts: number; tokens: number; cost: number }
    >();
    for (const r of logs) {
        const raw = r.createdAt;
        if (!raw || typeof raw !== "string") continue;
        const day = raw.slice(0, 10);
        if (day.length < 10) continue;
        const cur = byDay.get(day) ?? { prompts: 0, tokens: 0, cost: 0 };
        cur.prompts += 1;
        cur.tokens += r.tokenAiValue ?? 0;
        cur.cost += parsePromptCostValue(r.costValue);
        byDay.set(day, cur);
    }

    const sortedDays = [...byDay.keys()].sort();
    if (sortedDays.length === 0) {
        return {
            avgPromptsPerDay: n,
            avgTokensPerDay: totalTokens,
            avgTokensPerPrompt: avgTokensPerPrompt,
            totalEstCost,
            avgEstCostPerDay: totalEstCost,
            avgEstCostPerPrompt,
            spanDays: 1,
            activeDays: 0,
            periodLabel: "No created_at timestamps — totals only",
            series: [] as PromptDailyPoint[],
        };
    }

    const first = sortedDays[0]!;
    const last = sortedDays[sortedDays.length - 1]!;
    const t0 = Date.parse(`${first}T00:00:00.000Z`);
    const t1 = Date.parse(`${last}T00:00:00.000Z`);
    const spanDays = Math.max(
        1,
        Math.round((t1 - t0) / 86_400_000) + 1,
    );

    const avgPromptsPerDay = n / spanDays;
    const avgTokensPerDay = totalTokens / spanDays;
    const avgEstCostPerDay = totalEstCost / spanDays;

    const series: PromptDailyPoint[] = sortedDays.map((day) => {
        const b = byDay.get(day)!;
        return {
            day,
            prompts: b.prompts,
            tokens: b.tokens,
            cost: b.cost,
        };
    });

    return {
        avgPromptsPerDay,
        avgTokensPerDay,
        avgTokensPerPrompt,
        totalEstCost,
        avgEstCostPerDay,
        avgEstCostPerPrompt,
        spanDays,
        activeDays: sortedDays.length,
        periodLabel: `${first} → ${last} · ${spanDays} calendar day span · ${sortedDays.length} active day(s)`,
        series,
    };
}
