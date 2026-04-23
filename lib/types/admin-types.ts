import {
    aiModels,
    attachments,
    classrooms,
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
    "aiFeat" | "unlimitedStorage" | "unlimitedToken"
> & {
    aiFeat: boolean;
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
    unlimitedStorage: boolean;
    unlimitedToken: boolean;
    /** DB value is megabytes; multiply by 10⁶ for byte ceiling vs usage. */
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
    /** `prompt.cost_value` — opaque text (e.g. serialized pricing snapshot). */
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
    /** Rows where parsed cost_value > 0 (divisor for avg est. cost / prompt). */
    promptsWithRecordedCost: number;
    /** Distinct days with summed parsed cost > 0, or 1 fallback when cost exists but no day buckets (divisor for avg est. cost / day). */
    daysWithRecordedCost: number;
    spanDays: number;
    periodLabel: string;
    /** Days with ≥1 prompt (calendar). */
    trackedCalendarDays: number;
    /** Daily chart shows last 90 days when history is longer. */
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
