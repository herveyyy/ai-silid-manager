import { db } from "@/db";
import { classCard, classrooms, participants, prompt } from "@/drizzle/schema";
import type { PromptLog } from "@/lib/types/admin-types";
import { desc, eq } from "drizzle-orm";

export class GetSchoolPromptLogsUsecase {
    private db = db;

    async execute(schoolId: string): Promise<PromptLog[]> {
        try {
            const schoolUsers = this.db
                .selectDistinct({
                    userId: participants.userId,
                })
                .from(classrooms)
                .innerJoin(classCard, eq(classrooms.id, classCard.classroomId))
                .innerJoin(
                    participants,
                    eq(classCard.id, participants.classCardId),
                )
                .where(eq(classrooms.schoolId, schoolId))
                .as("school_users");

            const rows = await this.db
                .select()
                .from(prompt)
                .innerJoin(
                    schoolUsers,
                    eq(prompt.createdBy, schoolUsers.userId),
                )
                .orderBy(desc(prompt.createdAt));

            return rows.map(({ prompt }) => prompt);
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get school AI prompts");
        }
    }
}
