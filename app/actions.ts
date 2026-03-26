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

import { GetPromptLogsUsecase } from "@/db/usecase/prompts/get_ai_prompts.usecase";
import { GetSchoolPromptLogsUsecase } from "@/db/usecase/prompts/get_school_ai_prompts.usecase";
import { AiPromptsController } from "@/db/controller/ai-prompts/ai-prompts.controller";
import { AiPromptsService } from "@/db/service/ai-prompts.service";

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
