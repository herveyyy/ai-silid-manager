import { RoomsService } from "@/db/service/rooms.service";
import type { PaginatedRoomUsageDTO, RoomUsageDTO } from "@/lib/types/admin-types";
import { IRooms } from "./rooms.interface";

export class RoomsController implements IRooms {
    constructor(private readonly roomsService: RoomsService) {}

    async getSchoolRoomsUsage(
        schoolId: string,
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedRoomUsageDTO> {
        return await this.roomsService.getSchoolRoomsUsage(
            schoolId,
            page,
            offset,
            limit,
        );
    }

    async getRoomUsageById(
        schoolId: string,
        roomId: string,
    ): Promise<RoomUsageDTO | null> {
        return await this.roomsService.getRoomUsageById(schoolId, roomId);
    }
}
