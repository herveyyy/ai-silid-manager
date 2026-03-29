import type { PaginatedRoomUsageDTO, RoomUsageDTO } from "@/lib/types/admin-types";
import { GetSchoolRoomsUsageUsecase } from "../usecase/rooms/get_school_rooms_usage.usecase";
import { GetRoomUsageByIdUsecase } from "../usecase/rooms/get_room_usage_by_id.usecase";

export class RoomsService {
    constructor(
        private readonly getSchoolRoomsUsageUsecase: GetSchoolRoomsUsageUsecase,
        private readonly getRoomUsageByIdUsecase: GetRoomUsageByIdUsecase,
    ) {}

    async getSchoolRoomsUsage(
        schoolId: string,
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedRoomUsageDTO> {
        return await this.getSchoolRoomsUsageUsecase.execute(
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
        return await this.getRoomUsageByIdUsecase.execute(schoolId, roomId);
    }
}
