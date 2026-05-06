import type { GlobalPromptOverviewDTO } from "@/lib/types/admin-types";
import {
    aggregateGlobalPromptOverview,
    type GlobalPromptOverviewDbRow,
} from "@/lib/global-prompt-overview";
import { db } from "@/db";
import { prompt } from "@/drizzle/schema";

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

            return aggregateGlobalPromptOverview(
                rows as GlobalPromptOverviewDbRow[],
            );
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get global prompt overview");
        }
    }
}
