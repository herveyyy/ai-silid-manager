import type {
    DbErrorLogFilters,
    DbErrorLogStatsDTO,
    PaginatedDbErrorLogsDTO,
} from "@/lib/types/admin-types";

export interface IDbErrorLogger {
    getPaginatedDbErrorLogs(
        page: number,
        offset: number,
        limit: number,
        filters?: DbErrorLogFilters,
    ): Promise<PaginatedDbErrorLogsDTO>;
    getDbErrorLogStats(): Promise<DbErrorLogStatsDTO>;
}
