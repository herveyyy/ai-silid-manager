import type { AiModelDTO, AiModelMutationInput } from "@/lib/types/admin-types";

export interface IAiModels {
    getAiModels(): Promise<AiModelDTO[]>;
    createAiModel(data: AiModelMutationInput): Promise<AiModelDTO>;
    updateAiModel(
        modelId: string,
        data: AiModelMutationInput,
    ): Promise<AiModelDTO | null>;
}
