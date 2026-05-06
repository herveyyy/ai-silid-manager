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
            await this.db
                .update(aiModels)
                .set({
                    name: data.name,
                    description: data.description,
                    status: data.status,
                    inCostValue: data.inCostValue,
                    outCostValue: data.outCostValue,
                    updatedAt: sql`now()`,
                })
                .where(eq(aiModels.id, modelId));
            const [row] = await this.db
                .select()
                .from(aiModels)
                .where(eq(aiModels.id, modelId));

            return row ?? null;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update AI model");
        }
    }
}
