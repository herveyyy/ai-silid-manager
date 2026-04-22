import type { GlobalPromptOverviewDTO } from "@/lib/types/admin-types";
import { db } from "@/db";
import { prompt } from "@/drizzle/schema";
import { parsePromptCostValue } from "@/lib/prompt-daily-stats";

type StatusBucket = "completed" | "failed" | "running" | "other";

function bucketStatus(status: string): StatusBucket {
    const s = status.trim().toLowerCase();
    if (
        s === "completed" ||
        s === "success" ||
        s === "done" ||
        s === "succeeded"
    ) {
        return "completed";
    }
    if (
        s === "failed" ||
        s === "error" ||
        s.includes("fail") ||
        s.endsWith("_error")
    ) {
        return "failed";
    }
    if (
        s === "running" ||
        s === "pending" ||
        s === "queued" ||
        s === "processing" ||
        s === "in_progress"
    ) {
        return "running";
    }
    return "other";
}

const MAX_CHART_DAYS = 90;

export class GetGlobalPromptOverviewUsecase {
    private db = db;
    async execute(): Promise<GlobalPromptOverviewDTO> {
        try {
            const rows = await this.db
                .select({
                    createdAt: prompt.createdAt,
                    costValue: prompt.costValue,
                    tokenAiValue: prompt.tokenAiValue,
                    creditsSpent: prompt.creditsSpent,
                    status: prompt.status,
                })
                .from(prompt);

            const n = rows.length;
            if (n === 0) {
                return {
                    totalPrompts: 0,
                    totalTokens: 0,
                    totalCredits: 0,
                    totalEstCost: 0,
                    completed: 0,
                    failed: 0,
                    running: 0,
                    otherStatus: 0,
                    avgPromptsPerDay: 0,
                    avgTokensPerDay: 0,
                    avgEstCostPerDay: 0,
                    avgTokensPerPrompt: 0,
                    avgEstCostPerPrompt: 0,
                    spanDays: 0,
                    periodLabel: "No prompts in database yet",
                    trackedCalendarDays: 0,
                    dailySeriesTruncated: false,
                    dailySeries: [],
                };
            }

            let totalTokens = 0;
            let totalCredits = 0;
            let totalEstCost = 0;
            let completed = 0;
            let failed = 0;
            let running = 0;
            let otherStatus = 0;

            const byDay = new Map<
                string,
                { prompts: number; tokens: number; cost: number }
            >();

            for (const r of rows) {
                totalTokens += r.tokenAiValue ?? 0;
                totalCredits += r.creditsSpent ?? 0;
                totalEstCost += parsePromptCostValue(r.costValue);

                switch (bucketStatus(r.status)) {
                    case "completed":
                        completed++;
                        break;
                    case "failed":
                        failed++;
                        break;
                    case "running":
                        running++;
                        break;
                    default:
                        otherStatus++;
                }

                const raw = r.createdAt;
                if (!raw || typeof raw !== "string") continue;
                const day = raw.slice(0, 10);
                if (day.length < 10) continue;
                const cur = byDay.get(day) ?? {
                    prompts: 0,
                    tokens: 0,
                    cost: 0,
                };
                cur.prompts += 1;
                cur.tokens += r.tokenAiValue ?? 0;
                cur.cost += parsePromptCostValue(r.costValue);
                byDay.set(day, cur);
            }

            const sortedDays = [...byDay.keys()].sort();
            let spanDays = 1;
            let periodLabel = "";

            if (sortedDays.length === 0) {
                spanDays = 1;
                periodLabel =
                    "No created_at on prompts — rates use a 1-day divisor";
            } else {
                const first = sortedDays[0]!;
                const last = sortedDays[sortedDays.length - 1]!;
                const t0 = Date.parse(`${first}T00:00:00.000Z`);
                const t1 = Date.parse(`${last}T00:00:00.000Z`);
                spanDays = Math.max(
                    1,
                    Math.round((t1 - t0) / 86_400_000) + 1,
                );
                periodLabel = `${first} → ${last} · ${spanDays} calendar day span · ${sortedDays.length} active day(s)`;
            }

            const avgPromptsPerDay = n / spanDays;
            const avgTokensPerDay = totalTokens / spanDays;
            const avgEstCostPerDay = totalEstCost / spanDays;
            const avgTokensPerPrompt = totalTokens / n;
            const avgEstCostPerPrompt = totalEstCost / n;

            const fullSeries = sortedDays.map((day) => {
                const b = byDay.get(day)!;
                return {
                    day,
                    prompts: b.prompts,
                    tokens: b.tokens,
                    cost: b.cost,
                };
            });

            const dailySeriesTruncated = fullSeries.length > MAX_CHART_DAYS;
            const dailySeries = dailySeriesTruncated
                ? fullSeries.slice(-MAX_CHART_DAYS)
                : fullSeries;

            return {
                totalPrompts: n,
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
                trackedCalendarDays: sortedDays.length,
                dailySeriesTruncated,
                dailySeries,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get global prompt overview");
        }
    }
}
