import { createDbErrorLoggerController } from "@/app/actions";
import { DbErrorLoggerConsole } from "@/components/organisms/db-error-logger-console";
import type { DbErrorLogFilters } from "@/lib/types/admin-types";

export default async function DbErrorLoggerPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    offset?: string;
    search?: string;
    referenceTable?: string;
    applicationName?: string;
    sqlState?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
  }>;
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
  const limit = parsePositiveInt(resolvedSearchParams.limit, 20);
  const offset = parseNonNegativeInt(resolvedSearchParams.offset, 0);

  const filters: DbErrorLogFilters = {
    search: resolvedSearchParams.search || undefined,
    referenceTable: resolvedSearchParams.referenceTable || undefined,
    applicationName: resolvedSearchParams.applicationName || undefined,
    sqlState: resolvedSearchParams.sqlState || undefined,
    createdAtFrom: resolvedSearchParams.createdAtFrom || undefined,
    createdAtTo: resolvedSearchParams.createdAtTo || undefined,
  };

  const controller = await createDbErrorLoggerController();
  const [paginatedLogs, stats] = await Promise.all([
    controller.getPaginatedDbErrorLogs(page, offset, limit, filters),
    controller.getDbErrorLogStats(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
          System · diagnostics
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
          DB Error Logger
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-(--muted)">
          Live view of the <span className="text-(--muted-strong)">db_error_logger</span> table.
          Rows are written by database triggers or application-level error hooks.
          Filtered queries preserve all active params across pagination.
        </p>
      </div>
      <DbErrorLoggerConsole
        paginatedLogs={paginatedLogs}
        stats={stats}
        filters={filters}
      />
    </div>
  );
}
