import type { RoomUsageDTO } from "@/lib/types/admin-types";
import { GetSchoolRoomsUsageUsecase } from "../usecase/rooms/get_school_rooms_usage.usecase";

export class RoomsService {
    constructor(
        private readonly getSchoolRoomsUsageUsecase: GetSchoolRoomsUsageUsecase,
    ) {}

    async getSchoolRoomsUsage(schoolId: string): Promise<RoomUsageDTO[]> {
        return await this.getSchoolRoomsUsageUsecase.execute(schoolId);
    }
}
