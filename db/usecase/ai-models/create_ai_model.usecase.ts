import { db } from "@/db";
import { aiModels } from "@/drizzle/schema";
import type { AiModelDTO, AiModelMutationInput } from "@/lib/types/admin-types";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

export class CreateAiModelUsecase {
    private db = db;

    async execute(data: AiModelMutationInput): Promise<AiModelDTO> {
        try {
            const id = randomUUID();
            await this.db.insert(aiModels).values({
                id,
                name: data.name,
                description: data.description,
                status: data.status,
            });
            const [row] = await this.db
                .select()
                .from(aiModels)
                .where(eq(aiModels.id, id));

            if (!row) {
                throw new Error("Insert returned no row");
            }

            return row;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create AI model");
        }
    }
}
