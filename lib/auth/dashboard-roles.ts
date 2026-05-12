import { UserRole } from "../types/user-types";

export const DASHBOARD_ALLOWED_ROLES: readonly UserRole[] = ["admin"];

export function hasDashboardAccess(role: string | undefined | null): boolean {
    if (role == null || role === "") return false;
    return (DASHBOARD_ALLOWED_ROLES as readonly string[]).includes(role);
}
