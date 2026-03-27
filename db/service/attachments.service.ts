import type {
    Attachment,
    PaginatedAttachmentsDTO,
} from "@/lib/types/admin-types";
import { GetAttachmentsUsecase } from "../usecase/attachments/get_attachments.usecase";

export class AttachmentsService {
    constructor(
        private readonly getAttachmentsUsecase: GetAttachmentsUsecase,
    ) {}

    async getAttachments(): Promise<Attachment[]> {
        return await this.getAttachmentsUsecase.execute();
    }

    async getPaginatedAttachments(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedAttachmentsDTO> {
        return await this.getAttachmentsUsecase.executePaginated(
            page,
            offset,
            limit,
        );
    }
}
