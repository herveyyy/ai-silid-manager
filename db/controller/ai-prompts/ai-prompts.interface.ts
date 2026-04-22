import {
    GlobalPromptOverviewDTO,
    PaginatedPromptLogDTO,
    PromptLog,
    PromptStatsDTO,
} from "@/lib/types/admin-types";

export interface IAIPrompts {
    getAIPrompts(): Promise<PromptLog[]>;
    getPaginatedAIPrompts(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedPromptLogDTO>;
    getSchoolAIPrompts(schoolId: string): Promise<PromptLog[]>;
    getPromptStats(): Promise<PromptStatsDTO>;
    getGlobalPromptOverview(): Promise<GlobalPromptOverviewDTO>;
}
