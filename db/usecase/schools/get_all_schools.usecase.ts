import { db } from "@/db";
import { schools } from "@/drizzle/schema";
import type { SchoolDTO } from "@/lib/types/admin-types";
import { sql } from "drizzle-orm";

export class GetAllSchoolsUsecase {
    private db = db;

    async execute(): Promise<SchoolDTO[]> {
        try {
            const rows = await this.db
                .select({
                    id: schools.id,
                    name: schools.name,
                    schoolCode: schools.schoolCode,
                    username: schools.username,
                    site: schools.site,
                    createdAt: schools.createdAt,
                    updatedAt: schools.updatedAt,
                    secret: schools.secret,
                    apiKey: schools.apiKey,
                    aiFeat: schools.aiFeat,
                    unlimitedStorage: schools.unlimitedStorage,
                    unlimitedToken: schools.unlimitedToken,
                    tokenLimit: schools.tokenLimit,
                    storageLimit: schools.storageLimit,
                    defaultAiModelId: schools.defaultAiModelId,
                    passwordCredentialSet: sql<boolean>`(
                        ${schools.password} is not null
                        and trim(coalesce(${schools.password}, '')) <> ''
                    )`,
                })
                .from(schools);

            return rows.map((row) => ({
                ...row,
                aiFeat: Boolean(row.aiFeat),
                unlimitedStorage: Boolean(row.unlimitedStorage),
                unlimitedToken: Boolean(row.unlimitedToken),
            }));
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get all schools");
        }
    }
}
