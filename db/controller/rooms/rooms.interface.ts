import type { RoomUsageDTO } from "@/lib/types/admin-types";

export interface IRooms {
    getSchoolRoomsUsage(schoolId: string): Promise<RoomUsageDTO[]>;
}
