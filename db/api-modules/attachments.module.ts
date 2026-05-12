import { AttachmentsController } from "@/db/controller/attachments/attachments.controller";
import { AttachmentsService } from "@/db/service/attachments.service";
import { GetAttachmentsUsecase } from "@/db/usecase/attachments/get_attachments.usecase";

export function createAttachmentsModule(): AttachmentsController {
    return new AttachmentsController(
        new AttachmentsService(new GetAttachmentsUsecase()),
    );
}
