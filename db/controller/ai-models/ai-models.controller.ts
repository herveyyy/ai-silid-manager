import type { AiModelDTO, AiModelMutationInput } from "@/lib/types/admin-types";
import { AiModelsService } from "@/db/service/ai-models.service";
import { IAiModels } from "./ai-models.interface";

export class AiModelsController implements IAiModels {
    constructor(private readonly aiModelsService: AiModelsService) { }

    async getAiModels(): Promise<AiModelDTO[]> {
        return await this.aiModelsService.getAiModels();
    }

    async createAiModel(data: AiModelMutationInput): Promise<AiModelDTO> {
        return await this.aiModelsService.createAiModel(data);
    }

    async updateAiModel(
        modelId: string,
        data: AiModelMutationInput,
    ): Promise<AiModelDTO | null> {
        return await this.aiModelsService.updateAiModel(modelId, data);
    }
}
