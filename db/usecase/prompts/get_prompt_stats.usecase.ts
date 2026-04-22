import type { PromptStatsDTO } from "@/lib/types/admin-types";
import { db } from "@/db";
import { prompt } from "@/drizzle/schema";
import { count, sum } from "drizzle-orm";

function toInt(n: unknown): number {
    if (n == null) return 0;
    if (typeof n === "bigint") return Number(n);
    return Number(n);
}

/** Global aggregates over the `prompt` table (all schools / users). */
export class GetPromptStatsUsecase {
    private db = db;

    async execute(): Promise<PromptStatsDTO> {
        try {
            const [row] = await this.db
                .select({
                    totalCount: count(),
                    totalTokenAiValue: sum(prompt.tokenAiValue),
                    totalCreditsSpent: sum(prompt.creditsSpent),
                })
                .from(prompt);

            return {
                totalCount: Number(row?.totalCount ?? 0),
                totalTokenAiValue: toInt(row?.totalTokenAiValue),
                totalCreditsSpent: toInt(row?.totalCreditsSpent),
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get prompt stats");
        }
    }
}
