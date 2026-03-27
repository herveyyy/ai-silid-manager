import { RoomsService } from "@/db/service/rooms.service";
import type { RoomUsageDTO } from "@/lib/types/admin-types";
import { IRooms } from "./rooms.interface";

export class RoomsController implements IRooms {
    constructor(private readonly roomsService: RoomsService) {}

    async getSchoolRoomsUsage(schoolId: string): Promise<RoomUsageDTO[]> {
        return await this.roomsService.getSchoolRoomsUsage(schoolId);
    }
}
