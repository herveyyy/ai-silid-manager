import type { PaginatedRoomUsageDTO } from "@/lib/types/admin-types";

export interface IRooms {
    getSchoolRoomsUsage(
        schoolId: string,
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedRoomUsageDTO>;
}
