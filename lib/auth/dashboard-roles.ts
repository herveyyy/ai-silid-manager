import type { userRoleType } from "@/drizzle/schema";

export type UserRole = (typeof userRoleType.enumValues)[number];

/** Roles allowed to use the Silid admin dashboard and server actions in `app/actions.ts`. */
export const DASHBOARD_ALLOWED_ROLES: readonly UserRole[] = ["admin"];

export function hasDashboardAccess(role: string | undefined | null): boolean {
    if (role == null || role === "") return false;
    return (DASHBOARD_ALLOWED_ROLES as readonly string[]).includes(role);
}
