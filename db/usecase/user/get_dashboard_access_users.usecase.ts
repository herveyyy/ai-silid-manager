import { db } from "@/db";
import { users } from "@/drizzle/schema";
import type { DashboardAccessUserDTO } from "@/lib/types/user-types";
import { asc, inArray } from "drizzle-orm";

export class GetDashboardAccessUsersUsecase {
    private db = db;

    async execute(): Promise<DashboardAccessUserDTO[]> {
        try {
            const rows = await this.db
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    role: users.role,
                    createdAt: users.createdAt,
                })
                .from(users)
                .where(inArray(users.role, ["admin", "owner"]))
                .orderBy(asc(users.role), asc(users.name));

            return rows;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get dashboard access users");
        }
    }
}
