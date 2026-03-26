import { db } from "@/db";
import {
    attachments,
    classCard,
    classrooms,
    participants,
    prompt,
    schools,
} from "@/drizzle/schema";
import type { SchoolUsageViewDTO } from "@/lib/types/admin-types";
import { eq, sql } from "drizzle-orm";

export class GetSchoolsUsageViewUsecase {
    private db = db;

    async execute(): Promise<SchoolUsageViewDTO[]> {
        try {
            const schoolUsers = this.db
                .selectDistinct({
                    schoolId: classrooms.schoolId,
                    userId: participants.userId,
                })
                .from(classrooms)
                .innerJoin(classCard, eq(classrooms.id, classCard.classroomId))
                .innerJoin(
                    participants,
                    eq(classCard.id, participants.classCardId),
                )
                .as("school_users");

            const storageUsageBySchool = this.db
                .select({
                    schoolId: schoolUsers.schoolId,
                    storageUsedBytes: sql<number>`
                        coalesce(
                            sum(
                                case
                                    when ${attachments.isDeleted} = false
                                    then ${attachments.fileSize}
                                    else 0
                                end
                            ),
                            0
                        )
                    `.as("storage_used_bytes"),
                })
                .from(schoolUsers)
                .leftJoin(
                    attachments,
                    eq(schoolUsers.userId, attachments.createdBy),
                )
                .groupBy(schoolUsers.schoolId)
                .as("storage_usage_by_school");

            const tokenUsageBySchool = this.db
                .select({
                    schoolId: schoolUsers.schoolId,
                    tokensUsed: sql<number>`
                        coalesce(sum(${prompt.tokenAiValue}), 0)
                    `.as("tokens_used"),
                })
                .from(schoolUsers)
                .leftJoin(prompt, eq(schoolUsers.userId, prompt.createdBy))
                .groupBy(schoolUsers.schoolId)
                .as("token_usage_by_school");

            const rows = await this.db
                .select({
                    id: schools.id,
                    name: schools.name,
                    schoolCode: schools.schoolCode,
                    site: schools.site,
                    aiFeat: schools.aiFeat,
                    unlimitedStorage: schools.unlimitedStorage,
                    unlimitedToken: schools.unlimitedToken,
                    storageLimit: schools.storageLimit,
                    tokenLimit: schools.tokenLimit,
                    storageUsedBytes: sql<number>`coalesce(${storageUsageBySchool.storageUsedBytes}, 0)`,
                    tokensUsed: sql<number>`coalesce(${tokenUsageBySchool.tokensUsed}, 0)`,
                })
                .from(schools)
                .leftJoin(
                    storageUsageBySchool,
                    eq(schools.id, storageUsageBySchool.schoolId),
                )
                .leftJoin(
                    tokenUsageBySchool,
                    eq(schools.id, tokenUsageBySchool.schoolId),
                );
            console.log(rows);
            return rows;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get schools usage view");
        }
    }
}
