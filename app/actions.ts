"use server";
import { cacheLife, cacheTag } from "next/cache";
import { SchoolsController } from "@/db/controller/schools/schools.controller";
import { UsersController } from "@/db/controller/users/users.controller";
import { AttachmentsController } from "@/db/controller/attachments/attachments.controller";
import { RoomsController } from "@/db/controller/rooms/rooms.controller";
import { AiPromptsController } from "@/db/controller/ai-prompts/ai-prompts.controller";
import { AiModelsController } from "@/db/controller/ai-models/ai-models.controller";
import { DbErrorLoggerController } from "@/db/controller/db-error-logger/db-error-logger.controller";
import { createAiModelsModule } from "@/db/api-modules/ai-models.module";
import { createAiPromptsModule } from "@/db/api-modules/ai-prompts.module";
import { createAttachmentsModule } from "@/db/api-modules/attachments.module";
import { createDbErrorLoggerModule } from "@/db/api-modules/db-error-logger.module";
import { createRoomsModule } from "@/db/api-modules/rooms.module";
import { createSchoolsModule } from "@/db/api-modules/schools.module";
import { createUsersModule } from "@/db/api-modules/users.module";
import type {
    Attachment,
    GlobalPromptOverviewDTO,
    SchoolDTO,
    SchoolUsageViewDTO,
    UserOverviewDTO,
} from "@/lib/types/admin-types";
import { requireDashboardAccess } from "@/lib/auth/require-dashboard-access";

export type DashboardOverviewCacheMode = "cached" | "not_cached";

export async function createSchoolsAction(): Promise<SchoolsController> {
    await requireDashboardAccess();
    return createSchoolsModule();
}

export async function createUsersAction(): Promise<UsersController> {
    await requireDashboardAccess();
    return createUsersModule();
}

export async function createAttachmentsAction(): Promise<AttachmentsController> {
    await requireDashboardAccess();
    return createAttachmentsModule();
}

export async function createRoomsAction(): Promise<RoomsController> {
    await requireDashboardAccess();
    return createRoomsModule();
}

export async function createAiPromptsAction(): Promise<AiPromptsController> {
    await requireDashboardAccess();
    return createAiPromptsModule();
}

export async function createAiModelsAction(): Promise<AiModelsController> {
    await requireDashboardAccess();
    return createAiModelsModule();
}

export async function createDbErrorLoggerAction(): Promise<DbErrorLoggerController> {
    await requireDashboardAccess();
    return createDbErrorLoggerModule();
}
