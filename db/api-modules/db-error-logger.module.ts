import { DbErrorLoggerController } from "@/db/controller/db-error-logger/db-error-logger.controller";
import { DbErrorLoggerService } from "@/db/service/db-error-logger.service";
import { GetDbErrorLogsUsecase } from "@/db/usecase/db-error-logger/get_db_error_logs.usecase";
import { GetDbErrorLogStatsUsecase } from "@/db/usecase/db-error-logger/get_db_error_log_stats.usecase";

export function createDbErrorLoggerModule(): DbErrorLoggerController {
    return new DbErrorLoggerController(
        new DbErrorLoggerService(
            new GetDbErrorLogsUsecase(),
            new GetDbErrorLogStatsUsecase(),
        ),
    );
}
