import { PromptLog } from "@/lib/types/admin-types";

import { GetPromptLogsUsecase } from "../usecase/prompts/get_ai_prompts.usecase";
import { GetSchoolPromptLogsUsecase } from "../usecase/prompts/get_school_ai_prompts.usecase";

export class AiPromptsService {
    constructor(
        private readonly getPromptLogsUsecase: GetPromptLogsUsecase,
        private readonly getSchoolPromptLogsUsecase: GetSchoolPromptLogsUsecase,
    ) {}

    async getPromptLogs(): Promise<PromptLog[]> {
        return await this.getPromptLogsUsecase.execute();
    }

    async getSchoolPromptLogs(schoolId: string): Promise<PromptLog[]> {
        return await this.getSchoolPromptLogsUsecase.execute(schoolId);
    }
}
