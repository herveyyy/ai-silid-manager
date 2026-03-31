"use server";
import { SchoolsController } from "@/db/controller/schools/schools.controller";
import { SchoolsService } from "@/db/service/schools.service";
import { GetAllSchoolsUsecase } from "@/db/usecase/schools/get_all_schools.usecase";
import { GetSchoolsUsageViewUsecase } from "@/db/usecase/schools/get_schools_usage_view.usecase";
import { UsersController } from "@/db/controller/users/users.controller";
import { UserService } from "@/db/service/user.service";
import { GetUserByCredsUsecase } from "@/db/usecase/user/get_user_by_creds.usecase";
import { UpdateSchoolConfigurationUsecase } from "@/db/usecase/schools/update_school_configuration.usecase";
import { CreateSchoolUsecase } from "@/db/usecase/schools/create_school.usecase";
import { UpdateSchoolPasswordUsecase } from "@/db/usecase/schools/update_school_password.usecase";
import { UpdateSchoolProfileUsecase } from "@/db/usecase/schools/update_school_profile.usecase";
import { AttachmentsController } from "@/db/controller/attachments/attachments.controller";
import { AttachmentsService } from "@/db/service/attachments.service";
import { GetAttachmentsUsecase } from "@/db/usecase/attachments/get_attachments.usecase";
import { RoomsController } from "@/db/controller/rooms/rooms.controller";
import { RoomsService } from "@/db/service/rooms.service";
import { GetSchoolRoomsUsageUsecase } from "@/db/usecase/rooms/get_school_rooms_usage.usecase";
import { GetRoomUsageByIdUsecase } from "@/db/usecase/rooms/get_room_usage_by_id.usecase";

import { GetPromptLogsUsecase } from "@/db/usecase/prompts/get_ai_prompts.usecase";
import { GetSchoolPromptLogsUsecase } from "@/db/usecase/prompts/get_school_ai_prompts.usecase";
import { AiPromptsController } from "@/db/controller/ai-prompts/ai-prompts.controller";
import { AiPromptsService } from "@/db/service/ai-prompts.service";
import { AiModelsController } from "@/db/controller/ai-models/ai-models.controller";
import { AiModelsService } from "@/db/service/ai-models.service";
import { GetAiModelsUsecase } from "@/db/usecase/ai-models/get_ai_models.usecase";
import { CreateAiModelUsecase } from "@/db/usecase/ai-models/create_ai_model.usecase";
import { UpdateAiModelUsecase } from "@/db/usecase/ai-models/update_ai_model.usecase";
import { requireDashboardAccess } from "@/lib/auth/require-dashboard-access";

export async function createSchoolsController(): Promise<SchoolsController> {
    await requireDashboardAccess();
    return new SchoolsController(
        new SchoolsService(
            new GetAllSchoolsUsecase(),
            new GetSchoolsUsageViewUsecase(),
            new UpdateSchoolConfigurationUsecase(),
            new CreateSchoolUsecase(),
            new UpdateSchoolPasswordUsecase(),
            new UpdateSchoolProfileUsecase(),
        ),
    );
}

export async function createUsersController(): Promise<UsersController> {
    await requireDashboardAccess();
    return new UsersController(
        new UserService(new GetUserByCredsUsecase()),
    );
}

export async function createAttachmentsController(): Promise<AttachmentsController> {
    await requireDashboardAccess();
    return new AttachmentsController(
        new AttachmentsService(new GetAttachmentsUsecase()),
    );
}

export async function createRoomsController(): Promise<RoomsController> {
    await requireDashboardAccess();
    return new RoomsController(
        new RoomsService(
            new GetSchoolRoomsUsageUsecase(),
            new GetRoomUsageByIdUsecase(),
        ),
    );
}

export async function createAiPromptsController(): Promise<AiPromptsController> {
    await requireDashboardAccess();
    return new AiPromptsController(
        new AiPromptsService(
            new GetPromptLogsUsecase(),
            new GetSchoolPromptLogsUsecase(),
        ),
    );
}

export async function createAiModelsController(): Promise<AiModelsController> {
    await requireDashboardAccess();
    return new AiModelsController(
        new AiModelsService(
            new GetAiModelsUsecase(),
            new CreateAiModelUsecase(),
            new UpdateAiModelUsecase(),
        ),
    );
}
