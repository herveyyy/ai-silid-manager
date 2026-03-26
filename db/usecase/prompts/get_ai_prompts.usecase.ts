import { PromptLog } from "@/lib/types/admin-types";
import { db } from "@/db";
import { prompt } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
export class GetPromptLogsUsecase {
    private db = db;
    async execute(): Promise<PromptLog[]> {
        try {
            const rows = await this.db
                .select()
                .from(prompt)
                .orderBy(desc(prompt.createdAt));
            return rows;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get AI prompts");
        }
    }
}
