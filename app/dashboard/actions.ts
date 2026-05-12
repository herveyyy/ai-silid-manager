
import { createAiPromptsModule } from "@/db/api-modules/ai-prompts.module";
import { createAttachmentsModule } from "@/db/api-modules/attachments.module";
import { createSchoolsModule } from "@/db/api-modules/schools.module";
import { createUsersModule } from "@/db/api-modules/users.module";
import { requireDashboardAccess } from "@/lib/auth/require-dashboard-access";
import type {
    Attachment,
    GlobalPromptOverviewDTO,
    SchoolDTO,
    SchoolUsageViewDTO,
    UserOverviewDTO,
} from "@/lib/types/admin-types";
import {
    getDashboardAttachmentsCached,
    getDashboardPromptOverviewCached,
    getDashboardSchoolsCached,
    getDashboardSchoolsUsageCached,
    getDashboardUserOverviewCached,
} from "./cached-actions";

export type DashboardOverviewCacheMode = "cached" | "not_cached";

export async function getDashboardSchools(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<SchoolDTO[]> {
    await requireDashboardAccess();
    if (cache === "cached") return getDashboardSchoolsCached();
    return createSchoolsModule().getAllSchools();
}

export async function getDashboardSchoolsUsage(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<SchoolUsageViewDTO[]> {
    await requireDashboardAccess();
    if (cache === "cached") return getDashboardSchoolsUsageCached();
    return createSchoolsModule().getSchoolsUsageView();
}

export async function getDashboardPromptOverview(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<GlobalPromptOverviewDTO> {
    await requireDashboardAccess();
    if (cache === "cached") return getDashboardPromptOverviewCached();
    return createAiPromptsModule().getGlobalPromptOverview();
}

export async function getDashboardAttachments(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<Attachment[]> {
    await requireDashboardAccess();
    if (cache === "cached") return getDashboardAttachmentsCached();
    return createAttachmentsModule().getAttachments();
}

export async function getDashboardUserOverview(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<UserOverviewDTO> {
    await requireDashboardAccess();
    if (cache === "cached") return getDashboardUserOverviewCached();
    return createUsersModule().getUserOverview();
}
