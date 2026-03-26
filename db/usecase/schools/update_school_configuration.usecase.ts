import { db } from "@/db";
import { schools } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { StoredSchoolConfig } from "@/lib/school-config-storage";

export class UpdateSchoolConfigurationUsecase {
    private db = db;

    async execute(schoolId: string, data: StoredSchoolConfig): Promise<void> {
        try {
            await this.db
                .update(schools)
                .set(data)
                .where(eq(schools.id, schoolId));
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update school configuration");
        }
    }
}
