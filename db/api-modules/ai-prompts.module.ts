import { AiPromptsController } from "@/db/controller/ai-prompts/ai-prompts.controller";
import { AiPromptsService } from "@/db/service/ai-prompts.service";
import { GetPromptLogsUsecase } from "@/db/usecase/prompts/get_ai_prompts.usecase";
import { GetPromptStatsUsecase } from "@/db/usecase/prompts/get_prompt_stats.usecase";
import { GetSchoolPromptLogsUsecase } from "@/db/usecase/prompts/get_school_ai_prompts.usecase";
import { GetGlobalPromptOverviewUsecase } from "@/db/usecase/prompts/get_global_prompt_overview.usecase";

export function createAiPromptsModule(): AiPromptsController {
    return new AiPromptsController(
        new AiPromptsService(
            new GetPromptLogsUsecase(),
            new GetSchoolPromptLogsUsecase(),
            new GetPromptStatsUsecase(),
            new GetGlobalPromptOverviewUsecase(),
        ),
    );
}
