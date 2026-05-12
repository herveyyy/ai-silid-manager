import { createAiPromptsModule } from "@/db/api-modules/ai-prompts.module";
import { createAttachmentsModule } from "@/db/api-modules/attachments.module";
import { createSchoolsModule } from "@/db/api-modules/schools.module";
import { createUsersModule } from "@/db/api-modules/users.module";
import { requireDashboardAccess } from "@/lib/auth/require-dashboard-access";
import { Attachment, GlobalPromptOverviewDTO, SchoolDTO, SchoolUsageViewDTO, UserOverviewDTO } from "@/lib/types/admin-types";
import { DashboardOverviewCacheMode } from "../actions";
import { cacheLife, cacheTag } from "next/cache";


async function dashboardSchoolsRemoteCached() {
    "use cache: remote";
    cacheTag("dashboard-schools");
    cacheLife({ expire: 60 });
    return createSchoolsModule().getAllSchools();
}

async function dashboardSchoolsUsageRemoteCached() {
    "use cache: remote";
    cacheTag("dashboard-schools-usage");
    cacheLife({ expire: 60 });
    return createSchoolsModule().getSchoolsUsageView();
}

async function dashboardPromptOverviewRemoteCached() {
    "use cache: remote";
    cacheTag("dashboard-prompt-overview");
    cacheLife({ expire: 60 });
    return createAiPromptsModule().getGlobalPromptOverview();
}

async function dashboardAttachmentsRemoteCached() {
    "use cache: remote";
    cacheTag("dashboard-attachments");
    cacheLife({ expire: 60 });
    return createAttachmentsModule().getAttachments();
}

async function dashboardUserOverviewRemoteCached() {
    "use cache: remote";
    cacheTag("dashboard-users-overview");
    cacheLife({ expire: 60 });
    return createUsersModule().getUserOverview();
}

export async function getDashboardSchools(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<SchoolDTO[]> {
    await requireDashboardAccess();
    if (cache === "cached") return dashboardSchoolsRemoteCached();
    return createSchoolsModule().getAllSchools();
}

export async function getDashboardSchoolsUsage(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<SchoolUsageViewDTO[]> {
    await requireDashboardAccess();
    if (cache === "cached") return dashboardSchoolsUsageRemoteCached();
    return createSchoolsModule().getSchoolsUsageView();
}

export async function getDashboardPromptOverview(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<GlobalPromptOverviewDTO> {
    await requireDashboardAccess();
    if (cache === "cached") return dashboardPromptOverviewRemoteCached();
    return createAiPromptsModule().getGlobalPromptOverview();
}

export async function getDashboardAttachments(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<Attachment[]> {
    await requireDashboardAccess();
    if (cache === "cached") return dashboardAttachmentsRemoteCached();
    return createAttachmentsModule().getAttachments();
}

export async function getDashboardUserOverview(
    _main: unknown,
    cache: DashboardOverviewCacheMode = "not_cached",
): Promise<UserOverviewDTO> {
    await requireDashboardAccess();
    if (cache === "cached") return dashboardUserOverviewRemoteCached();
    return createUsersModule().getUserOverview();
}
