import { db } from "@/db";
import { attachments } from "@/drizzle/schema";
import type { Attachment, PaginatedAttachmentsDTO } from "@/lib/types/admin-types";
import { count, desc } from "drizzle-orm";

export class GetAttachmentsUsecase {
    private db = db;

    async execute(): Promise<Attachment[]> {
        try {
            return await this.db
                .select()
                .from(attachments)
                .orderBy(desc(attachments.createdAt));
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get attachments");
        }
    }

    async executePaginated(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedAttachmentsDTO> {
        try {
            const [rows, totalRows] = await Promise.all([
                this.db
                    .select()
                    .from(attachments)
                    .orderBy(desc(attachments.createdAt))
                    .limit(limit)
                    .offset(offset),
                this.db.select({ total: count() }).from(attachments),
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
            throw new Error("Failed to get paginated attachments");
        }
    }
}
