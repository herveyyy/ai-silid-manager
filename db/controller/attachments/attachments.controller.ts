import { AttachmentsService } from "@/db/service/attachments.service";
import type { Attachment } from "@/lib/types/admin-types";
import { IAttachments } from "./attachments.interface";

export class AttachmentsController implements IAttachments {
    constructor(private readonly attachmentsService: AttachmentsService) {}

    async getAttachments(): Promise<Attachment[]> {
        return await this.attachmentsService.getAttachments();
    }
}
