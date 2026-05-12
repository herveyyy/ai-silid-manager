/**
 * Remote cache slices for the fleet dashboard (`"use cache: remote"` + tags).
 * Called from `app/dashboard/actions.ts` when `cache === "cached"`.
 */
import { createAiPromptsModule } from "@/db/api-modules/ai-prompts.module";
import { createAttachmentsModule } from "@/db/api-modules/attachments.module";
import { createSchoolsModule } from "@/db/api-modules/schools.module";
import { createUsersModule } from "@/db/api-modules/users.module";
import { cacheLife, cacheTag } from "next/cache";

export async function getDashboardSchoolsCached() {
    "use cache: remote";
    cacheTag("dashboard-schools");
    cacheLife({ expire: 60 });
    return createSchoolsModule().getAllSchools();
}

export async function getDashboardSchoolsUsageCached() {
    "use cache: remote";
    cacheTag("dashboard-schools-usage");
    cacheLife({ expire: 60 });
    return createSchoolsModule().getSchoolsUsageView();
}

export async function getDashboardPromptOverviewCached() {
    "use cache: remote";
    cacheTag("dashboard-prompt-overview");
    cacheLife({ expire: 60 });
    return createAiPromptsModule().getGlobalPromptOverview();
}

export async function getDashboardAttachmentsCached() {
    "use cache: remote";
    cacheTag("dashboard-attachments");
    cacheLife({ expire: 60 });
    return createAttachmentsModule().getAttachments();
}

export async function getDashboardUserOverviewCached() {
    "use cache: remote";
    cacheTag("dashboard-users-overview");
    cacheLife({ expire: 60 });
    return createUsersModule().getUserOverview();
}
