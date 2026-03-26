import { PromptLog } from "@/lib/types/admin-types";
import { IAIPrompts } from "./ai-prompts.interface";
import { AiPromptsService } from "@/db/service/ai-prompts.service";

export class AiPromptsController implements IAIPrompts {
    constructor(private readonly aiPromptsService: AiPromptsService) {}

    async getAIPrompts(): Promise<PromptLog[]> {
        return await this.aiPromptsService.getPromptLogs();
    }

    async getSchoolAIPrompts(schoolId: string): Promise<PromptLog[]> {
        return await this.aiPromptsService.getSchoolPromptLogs(schoolId);
    }
}
