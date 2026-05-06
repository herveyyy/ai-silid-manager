import { DbErrorLoggerService } from "@/db/service/db-error-logger.service";
import type {
    DbErrorLogFilters,
    DbErrorLogStatsDTO,
    PaginatedDbErrorLogsDTO,
} from "@/lib/types/admin-types";
import { IDbErrorLogger } from "./db-error-logger.interface";

export class DbErrorLoggerController implements IDbErrorLogger {
    constructor(
        private readonly dbErrorLoggerService: DbErrorLoggerService,
    ) {}

    async getPaginatedDbErrorLogs(
        page: number,
        offset: number,
        limit: number,
        filters?: DbErrorLogFilters,
    ): Promise<PaginatedDbErrorLogsDTO> {
        return await this.dbErrorLoggerService.getPaginatedDbErrorLogs(
            page,
            offset,
            limit,
            filters,
        );
    }

    async getDbErrorLogStats(): Promise<DbErrorLogStatsDTO> {
        return await this.dbErrorLoggerService.getDbErrorLogStats();
    }
}
