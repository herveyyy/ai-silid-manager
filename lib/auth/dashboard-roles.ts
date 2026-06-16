import { UserRole } from "../types/user-types";

export const DASHBOARD_ALLOWED_ROLES: readonly UserRole[] = ["admin", "owner"];

export const OWNER_ROLE: UserRole = "owner";

export function hasDashboardAccess(role: string | undefined | null): boolean {
    if (role == null || role === "") return false;
    return (DASHBOARD_ALLOWED_ROLES as readonly string[]).includes(role);
}

export function hasOwnerAccess(role: string | undefined | null): boolean {
    return role === OWNER_ROLE;
}
