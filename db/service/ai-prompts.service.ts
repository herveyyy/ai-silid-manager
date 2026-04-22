import {
    GlobalPromptOverviewDTO,
    PaginatedPromptLogDTO,
    PromptLog,
    PromptStatsDTO,
} from "@/lib/types/admin-types";

import { GetPromptLogsUsecase } from "../usecase/prompts/get_ai_prompts.usecase";
import { GetPromptStatsUsecase } from "../usecase/prompts/get_prompt_stats.usecase";
import { GetSchoolPromptLogsUsecase } from "../usecase/prompts/get_school_ai_prompts.usecase";
import { GetGlobalPromptOverviewUsecase } from "../usecase/prompts/get_global_prompt_overview.usecase";

export class AiPromptsService {
    constructor(
        private readonly getPromptLogsUsecase: GetPromptLogsUsecase,
        private readonly getSchoolPromptLogsUsecase: GetSchoolPromptLogsUsecase,
        private readonly getPromptStatsUsecase: GetPromptStatsUsecase,
        private readonly getGlobalPromptOverviewUsecase: GetGlobalPromptOverviewUsecase,
    ) { }

    async getPromptLogs(): Promise<PromptLog[]> {
        return await this.getPromptLogsUsecase.execute();
    }

    async getPaginatedPromptLogs(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedPromptLogDTO> {
        return await this.getPromptLogsUsecase.executePaginated(
            page,
            offset,
            limit,
        );
    }

    async getSchoolPromptLogs(schoolId: string): Promise<PromptLog[]> {
        return await this.getSchoolPromptLogsUsecase.execute(schoolId);
    }

    async getPromptStats(): Promise<PromptStatsDTO> {
        return await this.getPromptStatsUsecase.execute();
    }

    async getGlobalPromptOverview(): Promise<GlobalPromptOverviewDTO> {
        return await this.getGlobalPromptOverviewUsecase.execute();
    }
}
