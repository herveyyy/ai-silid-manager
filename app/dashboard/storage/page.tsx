import { StorageConsole } from "@/components/organisms/storage-console";

export default function StoragePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
          Module · storage
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
          Attachments & usage
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-[var(--muted)]">
          Mirrors `attachments`: file_path, file_size, file_type, parent_type
          (attachment_type enum), is_used, is_deleted. Ceiling control is UI
          only until a quota field or settings row exists in the schema.
        </p>
      </header>
      <StorageConsole />
    </div>
  );
}
