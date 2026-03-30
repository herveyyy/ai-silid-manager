import { auth } from "@/auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { hasDashboardAccess } from "./dashboard-roles";

/**
 * Ensures the request is authenticated and the user may use admin dashboard APIs.
 * Unauthenticated users go to login; authenticated but disallowed roles go to /unauthorized.
 */
export async function requireDashboardAccess(): Promise<Session> {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }
    const role = (session.user as { role?: string }).role;
    if (!hasDashboardAccess(role)) {
        redirect("/unauthorized");
    }
    return session;
}
