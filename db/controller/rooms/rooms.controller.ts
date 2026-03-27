import { RoomsService } from "@/db/service/rooms.service";
import type { PaginatedRoomUsageDTO } from "@/lib/types/admin-types";
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
}
