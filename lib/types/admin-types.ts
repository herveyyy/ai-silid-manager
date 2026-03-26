import { schools } from "@/drizzle/schema";
export type AttachmentParentType =
    | "question"
    | "section-question"
    | "student-answer"
    | "class-card"
    | "post-comment"
    | "profile"
    | "post"
    | "quiz-evidence"
    | "assignment"
    | "materials"
    | "attendance"
    | "school-badge"
    | "chatbox"
    | "chatbox-message"
    | "content"
    | "content-question";

export type InsertSchool = typeof schools.$inferInsert;
export type SelectSchool = typeof schools.$inferSelect;
/** `schools` */
export type School = SelectSchool & {
    aiFeat: boolean;
    unlimitedStorage: boolean;
    unlimitedToken: boolean;
    tokenLimit: number;
    storageLimit: number;
};
export type SchoolDTO = Omit<School, "password" | "secret" | "apiKey">;

/** Admin quotas and usage (mock / future API — not in `schools` table yet). */
export type SchoolAdminMetrics = {
    storageUsedBytes: number;
    tokensUsed: number;
    quotaStorageBytes: number;
    quotaTokens: number;
};

export type SchoolProfile = School & SchoolAdminMetrics;

export type SchoolUsageViewDTO = {
    id: string;
    name: string;
    schoolCode: string;
    site: string;
    aiFeat: boolean;
    unlimitedStorage: boolean;
    unlimitedToken: boolean;
    storageLimit: number;
    tokenLimit: number;
    storageUsedBytes: number;
    tokensUsed: number;
};

/** `attachments` */
export type Attachment = {
    id: string;
    parentId: string;
    filePath: string;
    fileType: string;
    parentType: AttachmentParentType | null;
    isDeleted: boolean | null;
    isUsed: boolean | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string | null;
    fileSize: string;
    fileName: string;
};

/** `prompt` — AI feature usage log */
export type PromptLog = {
    id: string;
    featType: string;
    userPrompt: string;
    promptTitle: string | null;
    result: string | null;
    aiModelName: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    completedAt: string | null;
    tokenAiValue: number | null;
    creditsSpent: number | null;
    status: string;
    createdBy: string;
};
