import { db } from "@/db";
import { users } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { hasDashboardAccess } from "./dashboard-roles";

export type RegisteredDashboardUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export function normalizeAuthEmail(email: string): string {
    return email.trim().toLowerCase();
}

export async function getRegisteredDashboardUser(
    email: string,
): Promise<RegisteredDashboardUser | null> {
    const normalized = normalizeAuthEmail(email);
    if (!normalized) {
        return null;
    }

    const [user] = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
        })
        .from(users)
        .where(sql`lower(trim(${users.email})) = ${normalized}`)
        .limit(1);

    if (!user || !hasDashboardAccess(user.role)) {
        return null;
    }

    return user;
}

export function isGoogleAuthConfigured(): boolean {
    return Boolean(process.env.AUTH_GOOGLE_ID?.trim());
}

export function getGoogleClientId(): string {
    return process.env.AUTH_GOOGLE_ID?.trim() ?? "";
}
