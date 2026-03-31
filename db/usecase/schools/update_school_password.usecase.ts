import { db } from "@/db";
import { schools } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export class UpdateSchoolPasswordUsecase {
    private db = db;

    async execute(schoolId: string, password: string | null): Promise<void> {
        try {
            await this.db
                .update(schools)
                .set({
                    password,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(schools.id, schoolId));
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update school password");
        }
    }
}
