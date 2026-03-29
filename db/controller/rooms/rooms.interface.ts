import type { PaginatedRoomUsageDTO, RoomUsageDTO } from "@/lib/types/admin-types";

export interface IRooms {
    getSchoolRoomsUsage(
        schoolId: string,
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedRoomUsageDTO>;
    getRoomUsageById(
        schoolId: string,
        roomId: string,
    ): Promise<RoomUsageDTO | null>;
}
