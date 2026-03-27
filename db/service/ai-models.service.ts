import type { AiModelDTO, AiModelMutationInput } from "@/lib/types/admin-types";
import { CreateAiModelUsecase } from "../usecase/ai-models/create_ai_model.usecase";
import { GetAiModelsUsecase } from "../usecase/ai-models/get_ai_models.usecase";
import { UpdateAiModelUsecase } from "../usecase/ai-models/update_ai_model.usecase";

export class AiModelsService {
    constructor(
        private readonly getAiModelsUsecase: GetAiModelsUsecase,
        private readonly createAiModelUsecase: CreateAiModelUsecase,
        private readonly updateAiModelUsecase: UpdateAiModelUsecase,
    ) {}

    async getAiModels(): Promise<AiModelDTO[]> {
        return await this.getAiModelsUsecase.execute();
    }

    async createAiModel(data: AiModelMutationInput): Promise<AiModelDTO> {
        return await this.createAiModelUsecase.execute(data);
    }

    async updateAiModel(
        modelId: string,
        data: AiModelMutationInput,
    ): Promise<AiModelDTO | null> {
        return await this.updateAiModelUsecase.execute(modelId, data);
    }
}
