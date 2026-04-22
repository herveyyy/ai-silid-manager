import {
    GlobalPromptOverviewDTO,
    PaginatedPromptLogDTO,
    PromptLog,
    PromptStatsDTO,
} from "@/lib/types/admin-types";
import { IAIPrompts } from "./ai-prompts.interface";
import { AiPromptsService } from "@/db/service/ai-prompts.service";

export class AiPromptsController implements IAIPrompts {
    constructor(private readonly aiPromptsService: AiPromptsService) {}

    async getAIPrompts(): Promise<PromptLog[]> {
        return await this.aiPromptsService.getPromptLogs();
    }

    async getPaginatedAIPrompts(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedPromptLogDTO> {
        return await this.aiPromptsService.getPaginatedPromptLogs(
            page,
            offset,
            limit,
        );
    }

    async getSchoolAIPrompts(schoolId: string): Promise<PromptLog[]> {
        return await this.aiPromptsService.getSchoolPromptLogs(schoolId);
    }

    async getPromptStats(): Promise<PromptStatsDTO> {
        return await this.aiPromptsService.getPromptStats();
    }

    async getGlobalPromptOverview(): Promise<GlobalPromptOverviewDTO> {
        return await this.aiPromptsService.getGlobalPromptOverview();
    }
}
