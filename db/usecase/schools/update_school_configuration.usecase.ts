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
                .set({
                    aiFeat: data.aiFeat ? 1 : 0,
                    enrichmentFeat: data.enrichmentFeat ? 1 : 0,
                    unlimitedStorage: data.unlimitedStorage ? 1 : 0,
                    unlimitedToken: data.unlimitedToken ? 1 : 0,
                    tokenLimit: data.tokenLimit,
                    storageLimit: data.storageLimit,
                    secret: data.secret,
                    apiKey: data.apiKey,
                    defaultAiModelId: data.defaultAiModelId,
                })
                .where(eq(schools.id, schoolId));
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update school configuration");
        }
    }
}
