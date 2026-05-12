import { db } from "@/db";
import { schools } from "@/drizzle/schema";
import type { UpdateSchoolProfilePayload } from "@/lib/types/admin-types";
import { eq, sql } from "drizzle-orm";

export class UpdateSchoolProfileUsecase {
    private db = db;

    async execute(
        schoolId: string,
        data: UpdateSchoolProfilePayload,
    ): Promise<void> {
        try {
            await this.db
                .update(schools)
                .set({
                    name: data.name,
                    schoolCode: data.schoolCode,
                    site: data.site,
                    username: data.username,
                    updatedAt: sql`(now(3))`,
                })
                .where(eq(schools.id, schoolId));
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update school profile");
        }
    }
}
