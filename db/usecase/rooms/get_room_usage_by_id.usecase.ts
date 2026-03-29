import { db } from "@/db";
import {
    attachments,
    classCard,
    classrooms,
    participants,
    prompt,
    sections,
} from "@/drizzle/schema";
import type { RoomUsageDTO } from "@/lib/types/admin-types";
import { and, countDistinct, eq, sql } from "drizzle-orm";

export class GetRoomUsageByIdUsecase {
    private db = db;

    async execute(schoolId: string, roomId: string): Promise<RoomUsageDTO | null> {
        try {
            const roomUsers = this.db
                .selectDistinct({
                    roomId: classCard.classroomId,
                    userId: participants.userId,
                })
                .from(classCard)
                .innerJoin(
                    participants,
                    eq(classCard.id, participants.classCardId),
                )
                .innerJoin(
                    classrooms,
                    eq(classCard.classroomId, classrooms.id),
                )
                .where(
                    and(
                        eq(classrooms.schoolId, schoolId),
                        eq(classrooms.id, roomId),
                    ),
                )
                .as("room_users");

            const storageUsageByRoom = this.db
                .select({
                    roomId: roomUsers.roomId,
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
                .from(roomUsers)
                .leftJoin(attachments, eq(roomUsers.userId, attachments.createdBy))
                .groupBy(roomUsers.roomId)
                .as("storage_usage_by_room");

            const tokenUsageByRoom = this.db
                .select({
                    roomId: roomUsers.roomId,
                    tokensUsed: sql<number>`
                        coalesce(sum(${prompt.tokenAiValue}), 0)
                    `.as("tokens_used"),
                    promptRuns: sql<number>`
                        coalesce(count(${prompt.id}), 0)
                    `.as("prompt_runs"),
                })
                .from(roomUsers)
                .leftJoin(prompt, eq(roomUsers.userId, prompt.createdBy))
                .groupBy(roomUsers.roomId)
                .as("token_usage_by_room");

            const participantCountByRoom = this.db
                .select({
                    roomId: roomUsers.roomId,
                    participantCount: countDistinct(roomUsers.userId).as(
                        "participant_count",
                    ),
                })
                .from(roomUsers)
                .groupBy(roomUsers.roomId)
                .as("participant_count_by_room");

            const classCardCountByRoom = this.db
                .select({
                    roomId: classCard.classroomId,
                    classCardCount: countDistinct(classCard.id).as(
                        "class_card_count",
                    ),
                })
                .from(classCard)
                .innerJoin(
                    classrooms,
                    eq(classCard.classroomId, classrooms.id),
                )
                .where(
                    and(
                        eq(classrooms.schoolId, schoolId),
                        eq(classrooms.id, roomId),
                    ),
                )
                .groupBy(classCard.classroomId)
                .as("class_card_count_by_room");

            const rows = await this.db
                .select({
                    id: classrooms.id,
                    name: classrooms.name,
                    schoolId: classrooms.schoolId,
                    sectionId: classrooms.sectionId,
                    adviserId: classrooms.adviserId,
                    assistantAdviserId: classrooms.assistantAdviserId,
                    createdAt: classrooms.createdAt,
                    updatedAt: classrooms.updatedAt,
                    sectionName: sections.name,
                    sectionLevel: sections.level,
                    classCardCount: sql<number>`coalesce(${classCardCountByRoom.classCardCount}, 0)`,
                    participantCount: sql<number>`coalesce(${participantCountByRoom.participantCount}, 0)`,
                    storageUsedBytes: sql<number>`coalesce(${storageUsageByRoom.storageUsedBytes}, 0)`,
                    tokensUsed: sql<number>`coalesce(${tokenUsageByRoom.tokensUsed}, 0)`,
                    promptRuns: sql<number>`coalesce(${tokenUsageByRoom.promptRuns}, 0)`,
                })
                .from(classrooms)
                .leftJoin(sections, eq(classrooms.sectionId, sections.id))
                .leftJoin(
                    classCardCountByRoom,
                    eq(classrooms.id, classCardCountByRoom.roomId),
                )
                .leftJoin(
                    participantCountByRoom,
                    eq(classrooms.id, participantCountByRoom.roomId),
                )
                .leftJoin(
                    storageUsageByRoom,
                    eq(classrooms.id, storageUsageByRoom.roomId),
                )
                .leftJoin(
                    tokenUsageByRoom,
                    eq(classrooms.id, tokenUsageByRoom.roomId),
                )
                .where(
                    and(
                        eq(classrooms.schoolId, schoolId),
                        eq(classrooms.id, roomId),
                    ),
                )
                .limit(1);

            return rows[0] ?? null;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get room usage by id");
        }
    }
}
