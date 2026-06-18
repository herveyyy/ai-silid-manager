import { db } from "@/db";
import { schools } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import type { UpdateSchoolConfigurationPayload } from "@/lib/types/admin-types";

export class UpdateSchoolConfigurationUsecase {
    private db = db;

    async execute(
        schoolId: string,
        data: UpdateSchoolConfigurationPayload,
    ): Promise<void> {
        try {
            const updates: Record<string, unknown> = {
                aiFeat: data.aiFeat ? 1 : 0,
                enrichmentFeat: data.enrichmentFeat ? 1 : 0,
                unlimitedStorage: data.unlimitedStorage ? 1 : 0,
                unlimitedToken: data.unlimitedToken ? 1 : 0,
                tokenLimit: data.tokenLimit,
                storageLimit: data.storageLimit,
                defaultAiModelId: data.defaultAiModelId,
            };
            if (data.apiKey !== undefined) {
                updates.apiKey = data.apiKey;
            }
            if (data.secret !== undefined) {
                updates.secret = data.secret;
            }

            await this.db
                .update(schools)
                .set(updates)
                .where(eq(schools.id, schoolId));
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update school configuration");
        }
    }
}
