import { db } from "@/db";
import { attachments } from "@/drizzle/schema";
import type { Attachment } from "@/lib/types/admin-types";
import { desc } from "drizzle-orm";

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
}
