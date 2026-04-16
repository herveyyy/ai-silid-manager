import { db } from "@/db";
import {
    attachments,
    classCard,
    classrooms,
    participants,
    prompt,
    schools,
} from "@/drizzle/schema";
import type {
    PaginatedSchoolUsageViewDTO,
    SchoolUsageViewDTO,
} from "@/lib/types/admin-types";
import { asc, count, eq, sql } from "drizzle-orm";

export class GetSchoolsUsageViewUsecase {
    private db = db;

    private buildSchoolUsersQuery() {
        return this.db
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
    }

    private buildStorageUsageBySchoolQuery(
        schoolUsers: ReturnType<GetSchoolsUsageViewUsecase["buildSchoolUsersQuery"]>,
    ) {
        return this.db
            .select({
                schoolId: schoolUsers.schoolId,
                storageUsedBytes: sql<number>`
                    coalesce(
                        sum(
                            case
                                when ${attachments.isDeleted} = 0
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
    }

    private buildTokenUsageBySchoolQuery(
        schoolUsers: ReturnType<GetSchoolsUsageViewUsecase["buildSchoolUsersQuery"]>,
    ) {
        return this.db
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
    }

    private buildUsageViewSelect(
        storageUsageBySchool: ReturnType<
            GetSchoolsUsageViewUsecase["buildStorageUsageBySchoolQuery"]
        >,
        tokenUsageBySchool: ReturnType<
            GetSchoolsUsageViewUsecase["buildTokenUsageBySchoolQuery"]
        >,
    ) {
        return this.db
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
    }

    async execute(): Promise<SchoolUsageViewDTO[]> {
        try {
            const schoolUsers = this.buildSchoolUsersQuery();
            const storageUsageBySchool =
                this.buildStorageUsageBySchoolQuery(schoolUsers);
            const tokenUsageBySchool =
                this.buildTokenUsageBySchoolQuery(schoolUsers);

            const raw = await this.buildUsageViewSelect(
                storageUsageBySchool,
                tokenUsageBySchool,
            ).orderBy(asc(schools.name));
            return raw.map((row) => ({
                ...row,
                aiFeat: Boolean(row.aiFeat),
                unlimitedStorage: Boolean(row.unlimitedStorage),
                unlimitedToken: Boolean(row.unlimitedToken),
            }));
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get schools usage view");
        }
    }

    async executePaginated(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedSchoolUsageViewDTO> {
        try {
            const schoolUsers = this.buildSchoolUsersQuery();
            const storageUsageBySchool =
                this.buildStorageUsageBySchoolQuery(schoolUsers);
            const tokenUsageBySchool =
                this.buildTokenUsageBySchoolQuery(schoolUsers);

            const [rawRows, totalRows] = await Promise.all([
                this.buildUsageViewSelect(
                    storageUsageBySchool,
                    tokenUsageBySchool,
                )
                    .orderBy(asc(schools.name))
                    .limit(limit)
                    .offset(offset),
                this.db.select({ total: count() }).from(schools),
            ]);

            const rows = rawRows.map((row) => ({
                ...row,
                aiFeat: Boolean(row.aiFeat),
                unlimitedStorage: Boolean(row.unlimitedStorage),
                unlimitedToken: Boolean(row.unlimitedToken),
            }));

            return {
                rows,
                total: Number(totalRows[0]?.total ?? 0),
                page,
                limit,
                offset,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get paginated schools usage view");
        }
    }
}
