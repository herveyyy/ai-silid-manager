import type { Attachment, PaginatedAttachmentsDTO } from "@/lib/types/admin-types";

export interface IAttachments {
    getAttachments(): Promise<Attachment[]>;
    getPaginatedAttachments(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedAttachmentsDTO>;
}
