import { db } from "@/db";
import { schools } from "@/drizzle/schema";
import type { SchoolDTO } from "@/lib/admin-types";

export class GetAllSchoolsUsecase {
    private db = db;

    async execute(): Promise<SchoolDTO[]> {
        try {
            const rows = await this.db
                .select({
                    id: schools.id,
                    name: schools.name,
                    schoolCode: schools.schoolCode,
                    username: schools.username,
                    site: schools.site,
                    createdAt: schools.createdAt,
                    updatedAt: schools.updatedAt,
                })
                .from(schools);

            return rows;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get all schools");
        }
    }
}
