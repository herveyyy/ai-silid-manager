import { db } from "@/db";
import { schools } from "@/drizzle/schema";
import type { SchoolUsageViewDTO } from "@/lib/types/admin-types";
import { sql } from "drizzle-orm";

export class GetSchoolsUsageViewUsecase {
    private db = db;

    async execute(): Promise<SchoolUsageViewDTO[]> {
        try {
            return await this.db
                .select({
                    id: schools.id,
                    name: schools.name,
                    schoolCode: schools.schoolCode,
                    site: schools.site,
                    aiFeat: schools.aiFeat,
                    unlimitedStorage: schools.unlimitedStorage,
                    unlimitedToken: schools.unlimitedToken,
                    storageLimit: schools.storageLimit,
                    tokenLimit: schools.tokenLimit,
                    // The current schema has per-school limits but no direct school
                    // foreign key on attachments/prompt, so usage stays at zero until
                    // those tables can be linked to a school.
                    storageUsedBytes: sql<number>`0`,
                    tokensUsed: sql<number>`0`,
                })
                .from(schools);
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get schools usage view");
        }
    }
}
