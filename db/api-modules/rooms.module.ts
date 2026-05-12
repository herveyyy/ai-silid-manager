import { RoomsController } from "@/db/controller/rooms/rooms.controller";
import { RoomsService } from "@/db/service/rooms.service";
import { GetSchoolRoomsUsageUsecase } from "@/db/usecase/rooms/get_school_rooms_usage.usecase";
import { GetRoomUsageByIdUsecase } from "@/db/usecase/rooms/get_room_usage_by_id.usecase";

export function createRoomsModule(): RoomsController {
    return new RoomsController(
        new RoomsService(
            new GetSchoolRoomsUsageUsecase(),
            new GetRoomUsageByIdUsecase(),
        ),
    );
}
