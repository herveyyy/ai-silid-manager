import { PromptLog } from "@/lib/types/admin-types";

export interface IAIPrompts {
    getAIPrompts(): Promise<PromptLog[]>;
    getSchoolAIPrompts(schoolId: string): Promise<PromptLog[]>;
}
