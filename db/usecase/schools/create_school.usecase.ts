import { db } from "@/db";
import { schools } from "@/drizzle/schema";
import type { CreateSchoolPayload, SchoolDTO } from "@/lib/types/admin-types";

export class CreateSchoolUsecase {
    private db = db;

    async execute(data: CreateSchoolPayload): Promise<SchoolDTO> {
        try {
            const [row] = await this.db
                .insert(schools)
                .values({
                    name: data.name,
                    schoolCode: data.schoolCode,
                    site: data.site,
                    username: data.username,
                    password: data.password,
                })
                .returning({
                    id: schools.id,
                    name: schools.name,
                    schoolCode: schools.schoolCode,
                    username: schools.username,
                    site: schools.site,
                    createdAt: schools.createdAt,
                    updatedAt: schools.updatedAt,
                    aiFeat: schools.aiFeat,
                    unlimitedStorage: schools.unlimitedStorage,
                    unlimitedToken: schools.unlimitedToken,
                    tokenLimit: schools.tokenLimit,
                    storageLimit: schools.storageLimit,
                    defaultAiModelId: schools.defaultAiModelId,
                });

            if (!row) {
                throw new Error("Insert returned no row");
            }

            return row;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create school");
        }
    }
}
