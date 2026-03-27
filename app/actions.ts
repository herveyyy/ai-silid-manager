"use server";
import { SchoolsController } from "@/db/controller/schools/schools.controller";
import { SchoolsService } from "@/db/service/schools.service";
import { GetAllSchoolsUsecase } from "@/db/usecase/schools/get_all_schools.usecase";
import { GetSchoolsUsageViewUsecase } from "@/db/usecase/schools/get_schools_usage_view.usecase";
import { UsersController } from "@/db/controller/users/users.controller";
import { UserService } from "@/db/service/user.service";
import { GetUserByCredsUsecase } from "@/db/usecase/user/get_user_by_creds.usecase";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UpdateSchoolConfigurationUsecase } from "@/db/usecase/schools/update_school_configuration.usecase";
import { AttachmentsController } from "@/db/controller/attachments/attachments.controller";
import { AttachmentsService } from "@/db/service/attachments.service";
import { GetAttachmentsUsecase } from "@/db/usecase/attachments/get_attachments.usecase";
import { RoomsController } from "@/db/controller/rooms/rooms.controller";
import { RoomsService } from "@/db/service/rooms.service";
import { GetSchoolRoomsUsageUsecase } from "@/db/usecase/rooms/get_school_rooms_usage.usecase";

import { GetPromptLogsUsecase } from "@/db/usecase/prompts/get_ai_prompts.usecase";
import { GetSchoolPromptLogsUsecase } from "@/db/usecase/prompts/get_school_ai_prompts.usecase";
import { AiPromptsController } from "@/db/controller/ai-prompts/ai-prompts.controller";
import { AiPromptsService } from "@/db/service/ai-prompts.service";
import { AiModelsController } from "@/db/controller/ai-models/ai-models.controller";
import { AiModelsService } from "@/db/service/ai-models.service";
import { GetAiModelsUsecase } from "@/db/usecase/ai-models/get_ai_models.usecase";
import { CreateAiModelUsecase } from "@/db/usecase/ai-models/create_ai_model.usecase";
import { UpdateAiModelUsecase } from "@/db/usecase/ai-models/update_ai_model.usecase";

export async function createSchoolsController(): Promise<SchoolsController> {
    try {
        const session = await auth();
        if (!session?.user) {
            redirect("/login");
        }
        return new SchoolsController(
            new SchoolsService(
                new GetAllSchoolsUsecase(),
                new GetSchoolsUsageViewUsecase(),
                new UpdateSchoolConfigurationUsecase(),
            ),
        );
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create schools controller");
    }
}
export async function createUsersController(): Promise<UsersController> {
    try {
        const session = await auth();
        if (!session?.user) {
            redirect("/login");
        }
        return new UsersController(
            new UserService(new GetUserByCredsUsecase()),
        );
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create users controller");
    }
}

export async function createAttachmentsController(): Promise<AttachmentsController> {
    try {
        const session = await auth();
        if (!session?.user) {
            redirect("/login");
        }
        return new AttachmentsController(
            new AttachmentsService(new GetAttachmentsUsecase()),
        );
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create attachments controller");
    }
}

export async function createRoomsController(): Promise<RoomsController> {
    try {
        const session = await auth();
        if (!session?.user) {
            redirect("/login");
        }
        return new RoomsController(
            new RoomsService(new GetSchoolRoomsUsageUsecase()),
        );
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create rooms controller");
    }
}

export async function createAiPromptsController(): Promise<AiPromptsController> {
    try {
        const session = await auth();
        if (!session?.user) {
            redirect("/login");
        }
        return new AiPromptsController(
            new AiPromptsService(
                new GetPromptLogsUsecase(),
                new GetSchoolPromptLogsUsecase(),
            ),
        );
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create ai prompts controller");
    }
}

export async function createAiModelsController(): Promise<AiModelsController> {
    try {
        const session = await auth();
        if (!session?.user) {
            redirect("/login");
        }
        return new AiModelsController(
            new AiModelsService(
                new GetAiModelsUsecase(),
                new CreateAiModelUsecase(),
                new UpdateAiModelUsecase(),
            ),
        );
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create ai models controller");
    }
}
