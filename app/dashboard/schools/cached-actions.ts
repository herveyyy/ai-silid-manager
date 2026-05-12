/**
 * Remote cache slices for the schools fleet list (`"use cache: remote"` + tags).
 * Called from `app/dashboard/schools/queries.ts` when `cache === "cached"`.
 */
import { createSchoolsModule } from "@/db/api-modules/schools.module";
import { cacheLife, cacheTag } from "next/cache";

export const SCHOOLS_FLEET_LIST_CACHE_TAG = "schools-fleet-paginated-usage";

export async function getSchoolsPaginatedUsageCached(
    page: number,
    offset: number,
    limit: number,
) {
    "use cache: remote";
    cacheTag(SCHOOLS_FLEET_LIST_CACHE_TAG);
    cacheLife({ expire: 60 });
    return createSchoolsModule().getPaginatedSchoolsUsageView(
        page,
        offset,
        limit,
    );
}
