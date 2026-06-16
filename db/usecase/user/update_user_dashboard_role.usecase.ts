import { db } from "@/db";
import { users } from "@/drizzle/schema";
import type { UserRole } from "@/lib/types/user-types";
import { eq } from "drizzle-orm";

const DASHBOARD_OPERATOR_ROLES = new Set<UserRole>(["admin", "owner"]);

export class UpdateUserDashboardRoleUsecase {
    private db = db;

    async execute(userId: string, role: UserRole): Promise<void> {
        if (!DASHBOARD_OPERATOR_ROLES.has(role) && role !== "partner") {
            throw new Error("Invalid dashboard access role");
        }

        try {
            const [existing] = await this.db
                .select({ id: users.id, role: users.role })
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!existing) {
                throw new Error("User not found");
            }

            if (existing.role === "owner") {
                throw new Error("Owner role cannot be changed from this screen");
            }

            await this.db
                .update(users)
                .set({ role })
                .where(eq(users.id, userId));
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            console.error(error);
            throw new Error("Failed to update user dashboard role");
        }
    }
}
