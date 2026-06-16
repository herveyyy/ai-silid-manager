import { auth } from "@/auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { hasOwnerAccess } from "./dashboard-roles";

/**
 * Ensures the request is authenticated and the user has the owner role.
 */
export async function requireOwnerAccess(): Promise<Session> {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }
    const role = (session.user as { role?: string }).role;
    if (!hasOwnerAccess(role)) {
        redirect("/unauthorized");
    }
    return session;
}
