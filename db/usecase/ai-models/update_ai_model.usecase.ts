import { db } from "@/db";
import { aiModels } from "@/drizzle/schema";
import type { AiModelDTO, AiModelMutationInput } from "@/lib/types/admin-types";
import { eq, sql } from "drizzle-orm";

export class UpdateAiModelUsecase {
    private db = db;

    async execute(
        modelId: string,
        data: AiModelMutationInput,
    ): Promise<AiModelDTO | null> {
        try {
            const [row] = await this.db
                .update(aiModels)
                .set({
                    name: data.name,
                    description: data.description,
                    status: data.status,
                    updatedAt: sql`now()`,
                })
                .where(eq(aiModels.id, modelId))
                .returning();

            return row ?? null;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update AI model");
        }
    }
}
