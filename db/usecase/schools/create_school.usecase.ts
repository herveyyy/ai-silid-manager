import { db } from "@/db";
import { schools } from "@/drizzle/schema";
import type { CreateSchoolPayload, SchoolDTO } from "@/lib/types/admin-types";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

export class CreateSchoolUsecase {
    private db = db;

    async execute(data: CreateSchoolPayload): Promise<SchoolDTO> {
        try {
            const id = randomUUID();
            await this.db.insert(schools).values({
                id,
                name: data.name,
                schoolCode: data.schoolCode,
                site: data.site,
                username: data.username,
                password: data.password,
                secret: data.secret,
                apiKey: data.apiKey,
            });
            const [row] = await this.db
                .select({
                    id: schools.id,
                    name: schools.name,
                    schoolCode: schools.schoolCode,
                    username: schools.username,
                    site: schools.site,
                    createdAt: schools.createdAt,
                    updatedAt: schools.updatedAt,
                    aiFeat: schools.aiFeat,
                    enrichmentFeat: schools.enrichmentFeat,
                    unlimitedStorage: schools.unlimitedStorage,
                    unlimitedToken: schools.unlimitedToken,
                    tokenLimit: schools.tokenLimit,
                    storageLimit: schools.storageLimit,
                    defaultAiModelId: schools.defaultAiModelId,
                })
                .from(schools)
                .where(eq(schools.id, id));

            if (!row) {
                throw new Error("Insert returned no row");
            }

            return {
                ...row,
                passwordCredentialSet: Boolean(data.password),
                apiKeySet: Boolean(data.apiKey),
                secretSet: Boolean(data.secret),
                aiFeat: Boolean(row.aiFeat),
                enrichmentFeat: Boolean(row.enrichmentFeat),
                unlimitedStorage: Boolean(row.unlimitedStorage),
                unlimitedToken: Boolean(row.unlimitedToken),
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create school");
        }
    }
}
