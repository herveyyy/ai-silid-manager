import { AiModelsController } from "@/db/controller/ai-models/ai-models.controller";
import { AiModelsService } from "@/db/service/ai-models.service";
import { GetAiModelsUsecase } from "@/db/usecase/ai-models/get_ai_models.usecase";
import { CreateAiModelUsecase } from "@/db/usecase/ai-models/create_ai_model.usecase";
import { UpdateAiModelUsecase } from "@/db/usecase/ai-models/update_ai_model.usecase";

export function createAiModelsModule(): AiModelsController {
    return new AiModelsController(
        new AiModelsService(
            new GetAiModelsUsecase(),
            new CreateAiModelUsecase(),
            new UpdateAiModelUsecase(),
        ),
    );
}
