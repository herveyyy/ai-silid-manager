import { createAttachmentsAction } from "@/app/actions";
import { StorageConsole } from "@/components/organisms/storage-console";
import { attachmentType } from "@/lib/types/admin-types";
export default async function StoragePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; offset?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  function parsePositiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function parseNonNegativeInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }

  const page = parsePositiveInt(resolvedSearchParams.page, 1);
  const limit = parsePositiveInt(resolvedSearchParams.limit, 10);
  const offset = parseNonNegativeInt(resolvedSearchParams.offset, 0);
  const attachmentsController = await createAttachmentsAction();
  const [rows, paginatedAttachments] = await Promise.all([
    attachmentsController.getAttachments(),
    attachmentsController.getPaginatedAttachments(page, offset, limit),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
          Module · storage
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
          Attachments & usage
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-(--muted)">
          Mirrors `attachments`: file_path, file_size, file_type, parent_type
          (`attachment_type` enum), is_used, is_deleted. Usage is live; ceiling
          control stays UI-only until a quota field or settings row exists.
        </p>
      </header>
      <StorageConsole
        rows={rows}
        paginatedAttachments={paginatedAttachments}
        parentTypes={attachmentType.enumValues}
      />
    </div>
  );
}
