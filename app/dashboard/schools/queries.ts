/**
 * Server GET helpers for the schools fleet list (optional remote cache via `./cached-actions`).
 */
import { createSchoolsModule } from "@/db/api-modules/schools.module";
import { requireDashboardAccess } from "@/lib/auth/require-dashboard-access";
import type { PaginatedSchoolUsageViewDTO } from "@/lib/types/admin-types";
import { getSchoolsPaginatedUsageCached } from "./cached-actions";

export type SchoolsListCacheMode = "cached" | "not_cached";

export type SchoolsPaginatedUsageMain = {
    page: number;
    offset: number;
    limit: number;
};

export async function getSchoolsPaginatedUsage(
    main: SchoolsPaginatedUsageMain,
    cache: SchoolsListCacheMode = "not_cached",
): Promise<PaginatedSchoolUsageViewDTO> {
    await requireDashboardAccess();
    if (cache === "cached") {
        return getSchoolsPaginatedUsageCached(main.page, main.offset, main.limit);
    }
    return createSchoolsModule().getPaginatedSchoolsUsageView(
        main.page,
        main.offset,
        main.limit,
    );
}
