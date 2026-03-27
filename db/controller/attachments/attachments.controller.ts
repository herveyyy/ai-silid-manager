import { AttachmentsService } from "@/db/service/attachments.service";
import type { Attachment, PaginatedAttachmentsDTO } from "@/lib/types/admin-types";
import { IAttachments } from "./attachments.interface";

export class AttachmentsController implements IAttachments {
    constructor(private readonly attachmentsService: AttachmentsService) {}

    async getAttachments(): Promise<Attachment[]> {
        return await this.attachmentsService.getAttachments();
    }

    async getPaginatedAttachments(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedAttachmentsDTO> {
        return await this.attachmentsService.getPaginatedAttachments(
            page,
            offset,
            limit,
        );
    }
}
