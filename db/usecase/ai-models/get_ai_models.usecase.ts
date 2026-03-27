import { db } from "@/db";
import { aiModels } from "@/drizzle/schema";
import type { AiModelDTO } from "@/lib/types/admin-types";
import { asc } from "drizzle-orm";

export class GetAiModelsUsecase {
    private db = db;

    async execute(): Promise<AiModelDTO[]> {
        try {
            return await this.db
                .select()
                .from(aiModels)
                .orderBy(asc(aiModels.name));
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get AI models");
        }
    }
}
