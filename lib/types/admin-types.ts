import {
    aiModels,
    attachments,
    classrooms,
    dbErrorLogger,
    schools,
    users,
} from "@/drizzle/schema";
export type AttachmentParentType = (typeof attachmentType.enumValues)[number];
export const attachmentType = attachments.parentType;
export const userRoleType = users.role;
export type InsertSchool = typeof schools.$inferInsert;
export type SelectSchool = typeof schools.$inferSelect;
export type School = Omit<
    SelectSchool,
    "aiFeat" | "enrichmentFeat" | "unlimitedStorage" | "unlimitedToken"
> & {
    aiFeat: boolean;
    enrichmentFeat: boolean;
    unlimitedStorage: boolean;
    unlimitedToken: boolean;
};
export type SchoolDTO = Omit<School, "password"> & {
    passwordCredentialSet: boolean;
    
};

export type CreateSchoolPayload = {
    name: string;
    schoolCode: string;
    site: string;
    username: string | null;
    password: string | null;
    secret: string | null;
    apiKey: string | null;
};

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
    "name" | "description" | "status" | "inCostValue" | "outCostValue"
>;

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
    enrichmentFeat: boolean;
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

export type SelectAttachment = typeof attachments.$inferSelect;
export type Attachment = SelectAttachment;
export type PaginatedAttachmentsDTO = {
    rows: Attachment[];
    total: number;
    page: number;
    limit: number;
    offset: number;
};

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
    costValue: string | null;
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

/** Sum/count aggregates over `prompt` (global). */
export type PromptStatsDTO = {
    totalCount: number;
    totalTokenAiValue: number;
    totalCreditsSpent: number;
};

/** Daily bucket for fleet-wide prompt charts. */
export type GlobalPromptOverviewDay = {
    day: string;
    prompts: number;
    tokens: number;
    cost: number;
};

/** Full-database prompt rollup for schools fleet overview (all tenants). */
export type GlobalPromptOverviewDTO = {
    totalPrompts: number;
    totalTokens: number;
    totalCredits: number;
    totalEstCost: number;
    completed: number;
    failed: number;
    running: number;
    otherStatus: number;
    avgPromptsPerDay: number;
    avgTokensPerDay: number;
    avgEstCostPerDay: number;
    avgTokensPerPrompt: number;
    avgEstCostPerPrompt: number;
    promptsWithRecordedCost: number;
    daysWithRecordedCost: number;
    spanDays: number;
    periodLabel: string;
    trackedCalendarDays: number;
    dailySeriesTruncated: boolean;
    dailySeries: GlobalPromptOverviewDay[];
};

/** Aggregates over `users` (global). */
export type UserOverviewDTO = {
    totalUsers: number;
    byRole: {
        student: number;
        teacher: number;
        admin: number;
        partner: number;
    };
};

export type SelectDbErrorLog = typeof dbErrorLogger.$inferSelect;
export type DbErrorLog = SelectDbErrorLog;

export type DbErrorLogFilters = {
    search?: string;
    referenceTable?: string;
    applicationName?: string;
    sqlState?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
};

export type PaginatedDbErrorLogsDTO = {
    rows: DbErrorLog[];
    total: number;
    page: number;
    limit: number;
    offset: number;
};

export type DbErrorLogStatsDTO = {
    totalCount: number;
    last24hCount: number;
    topReferenceTable: { name: string; count: number } | null;
    distinctReferenceTables: string[];
    distinctApplicationNames: string[];
    distinctSqlStates: string[];
};
