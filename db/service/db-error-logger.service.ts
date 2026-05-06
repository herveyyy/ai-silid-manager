import type {
    DbErrorLogFilters,
    DbErrorLogStatsDTO,
    PaginatedDbErrorLogsDTO,
} from "@/lib/types/admin-types";
import { GetDbErrorLogsUsecase } from "../usecase/db-error-logger/get_db_error_logs.usecase";
import { GetDbErrorLogStatsUsecase } from "../usecase/db-error-logger/get_db_error_log_stats.usecase";

export class DbErrorLoggerService {
    constructor(
        private readonly getDbErrorLogsUsecase: GetDbErrorLogsUsecase,
        private readonly getDbErrorLogStatsUsecase: GetDbErrorLogStatsUsecase,
    ) {}

    async getPaginatedDbErrorLogs(
        page: number,
        offset: number,
        limit: number,
        filters: DbErrorLogFilters = {},
    ): Promise<PaginatedDbErrorLogsDTO> {
        return await this.getDbErrorLogsUsecase.executePaginated(
            page,
            offset,
            limit,
            filters,
        );
    }

    async getDbErrorLogStats(): Promise<DbErrorLogStatsDTO> {
        return await this.getDbErrorLogStatsUsecase.execute();
    }
}
