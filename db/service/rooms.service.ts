import type { PaginatedRoomUsageDTO } from "@/lib/types/admin-types";
import { GetSchoolRoomsUsageUsecase } from "../usecase/rooms/get_school_rooms_usage.usecase";

export class RoomsService {
    constructor(
        private readonly getSchoolRoomsUsageUsecase: GetSchoolRoomsUsageUsecase,
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
}
