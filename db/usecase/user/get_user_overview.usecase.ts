import { db } from "@/db";
import { users } from "@/drizzle/schema";
import type { UserOverviewDTO } from "@/lib/types/admin-types";
import { count } from "drizzle-orm";

const ROLES = ["student", "teacher", "admin", "partner"] as const;

export class GetUserOverviewUsecase {
    private db = db;

    async execute(): Promise<UserOverviewDTO> {
        const rows = await this.db
            .select({
                role: users.role,
                n: count(),
            })
            .from(users)
            .groupBy(users.role);

        const byRole: UserOverviewDTO["byRole"] = {
            student: 0,
            teacher: 0,
            admin: 0,
            partner: 0,
        };

        for (const row of rows) {
            const r = row.role;
            if (r === "student" || r === "teacher" || r === "admin" || r === "partner") {
                byRole[r] = Number(row.n);
            }
        }

        const totalUsers = ROLES.reduce((acc, role) => acc + byRole[role], 0);

        return { totalUsers, byRole };
    }
}
