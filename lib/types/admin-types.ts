import {
    aiModels,
    attachmentType,
    attachments,
    classrooms,
    schools,
} from "@/drizzle/schema";
export type AttachmentParentType = (typeof attachmentType.enumValues)[number];

export type InsertSchool = typeof schools.$inferInsert;
export type SelectSchool = typeof schools.$inferSelect;
/** `schools` — tinyint flags are typed as booleans for the app layer */
export type School = Omit<
    SelectSchool,
    "aiFeat" | "unlimitedStorage" | "unlimitedToken"
> & {
    aiFeat: boolean;
    unlimitedStorage: boolean;
    unlimitedToken: boolean;
};
export type SchoolDTO = Omit<School, "password"> & {
    /** True when a password value is stored; the value is never sent to the client. */
    passwordCredentialSet: boolean;
};

/** Values ready for DB insert (school password stored as plain text when set). */
export type CreateSchoolPayload = {
    name: string;
    schoolCode: string;
    site: string;
    username: string | null;
    password: string | null;
    secret: string | null;
    apiKey: string | null;
};

/** Updatable registry fields on `schools` (excludes password — use password action). */
export type UpdateSchoolProfilePayload = {
    name: string;
    schoolCode: string;
    site: string;
    username: string | null;
};

export type SelectRoom = typeof classrooms.$inferSelect;
export type RoomDTO = SelectRoom & {
    sectionName: string | null;
    sectionLevel: string | null;
};

export type RoomUsageDTO = RoomDTO & {
    classCardCount: number;
    participantCount: number;
    storageUsedBytes: number;
    tokensUsed: number;
    promptRuns: number;
};

export type PaginatedRoomUsageDTO = {
    rows: RoomUsageDTO[];
    total: number;
    page: number;
    limit: number;
    offset: number;
};

export type InsertAiModel = typeof aiModels.$inferInsert;
export type SelectAiModel = typeof aiModels.$inferSelect;
export type AiModelDTO = SelectAiModel;
export type AiModelMutationInput = Pick<
    AiModelDTO,
    "name" | "description" | "status"
>;

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

export type PaginatedSchoolUsageViewDTO = {
    rows: SchoolUsageViewDTO[];
    total: number;
    page: number;
    limit: number;
    offset: number;
};

/** `attachments` */
export type SelectAttachment = typeof attachments.$inferSelect;
export type Attachment = SelectAttachment;
export type PaginatedAttachmentsDTO = {
    rows: Attachment[];
    total: number;
    page: number;
    limit: number;
    offset: number;
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

export type PaginatedPromptLogDTO = {
    rows: PromptLog[];
    total: number;
    page: number;
    limit: number;
    offset: number;
};
