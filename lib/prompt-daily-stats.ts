import type { PromptLog } from "@/lib/types/admin-types";

export type PromptDailyPoint = {
    day: string;
    prompts: number;
    tokens: number;
    cost: number;
};


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

export function countDaysWithRecordedCost(
    byDay: Map<string, { prompts: number; tokens: number; cost: number }>,
): number {
    let n = 0;
    for (const b of byDay.values()) {
        if (b.cost > 0) n += 1;
    }
    return n;
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
            promptsWithRecordedCost: 0,
            daysWithRecordedCost: 0,
            periodLabel: "No prompts yet",
            series: [] as PromptDailyPoint[],
        };
    }

    const byDay = new Map<
        string,
        { prompts: number; tokens: number; cost: number }
    >();
    let totalTokens = 0;
    let totalEstCost = 0;
    let promptsWithRecordedCost = 0;

    for (const r of logs) {
        const cost = parsePromptCostValue(r.costValue);
        totalTokens += r.tokenAiValue ?? 0;
        totalEstCost += cost;
        if (cost > 0) promptsWithRecordedCost += 1;

        const raw = r.createdAt;
        if (!raw || typeof raw !== "string") continue;
        const day = raw.slice(0, 10);
        if (day.length < 10) continue;
        const cur = byDay.get(day) ?? { prompts: 0, tokens: 0, cost: 0 };
        cur.prompts += 1;
        cur.tokens += r.tokenAiValue ?? 0;
        cur.cost += cost;
        byDay.set(day, cur);
    }

    const avgTokensPerPrompt = totalTokens / n;
    const avgEstCostPerPrompt =
        promptsWithRecordedCost > 0
            ? totalEstCost / promptsWithRecordedCost
            : 0;

    const sortedDays = [...byDay.keys()].sort();
    const daysWithCostInBuckets = countDaysWithRecordedCost(byDay);

    if (sortedDays.length === 0) {
        const costDayDivisor = totalEstCost > 0 ? 1 : 0;
        const avgEstCostPerDay =
            costDayDivisor > 0 ? totalEstCost / costDayDivisor : 0;
        return {
            avgPromptsPerDay: n,
            avgTokensPerDay: totalTokens,
            avgTokensPerPrompt: avgTokensPerPrompt,
            totalEstCost,
            avgEstCostPerDay,
            avgEstCostPerPrompt,
            spanDays: 1,
            activeDays: 0,
            promptsWithRecordedCost,
            daysWithRecordedCost: costDayDivisor,
            periodLabel:
                "No created_at timestamps — token/prompt rates only; cost treated as single bucket",
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

    const activeDays = sortedDays.length;
    const avgDenominator = activeDays > 0 ? activeDays : 1;
    const avgPromptsPerDay = n / avgDenominator;
    const avgTokensPerDay = totalTokens / avgDenominator;

    const costDayDivisor =
        daysWithCostInBuckets > 0
            ? daysWithCostInBuckets
            : totalEstCost > 0
              ? 1
              : 0;
    const avgEstCostPerDay =
        costDayDivisor > 0 ? totalEstCost / costDayDivisor : 0;

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
        promptsWithRecordedCost,
        daysWithRecordedCost: costDayDivisor,
        periodLabel: `${first} → ${last} · window ${spanDays} calendar day(s) · prompts/tokens ÷ ${activeDays} active day(s) · cost/day ÷ ${costDayDivisor || "—"} day(s) with parsed USD`,
        series,
    };
}
