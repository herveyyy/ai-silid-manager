import { db } from "@/db";
import { aiModels } from "@/drizzle/schema";
import type { AiModelDTO, AiModelMutationInput } from "@/lib/types/admin-types";

export class CreateAiModelUsecase {
    private db = db;

    async execute(data: AiModelMutationInput): Promise<AiModelDTO> {
        try {
            const [row] = await this.db
                .insert(aiModels)
                .values({
                    name: data.name,
                    description: data.description,
                    status: data.status,
                })
                .returning();

            return row;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create AI model");
        }
    }
}
