import type { Attachment } from "@/lib/types/admin-types";

export interface IAttachments {
    getAttachments(): Promise<Attachment[]>;
}
