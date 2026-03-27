import { PaginatedPromptLogDTO, PromptLog } from "@/lib/types/admin-types";
import { db } from "@/db";
import { prompt } from "@/drizzle/schema";
import { count, desc } from "drizzle-orm";
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

    async executePaginated(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedPromptLogDTO> {
        try {
            const [rows, totalRows] = await Promise.all([
                this.db
                    .select()
                    .from(prompt)
                    .orderBy(desc(prompt.createdAt))
                    .limit(limit)
                    .offset(offset),
                this.db.select({ total: count() }).from(prompt),
            ]);

            return {
                rows,
                total: Number(totalRows[0]?.total ?? 0),
                page,
                limit,
                offset,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get paginated AI prompts");
        }
    }
}
