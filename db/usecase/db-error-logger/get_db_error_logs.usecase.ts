import { db } from "@/db";
import { dbErrorLogger } from "@/drizzle/schema";
import type {
    DbErrorLog,
    DbErrorLogFilters,
    PaginatedDbErrorLogsDTO,
} from "@/lib/types/admin-types";
import { and, count, desc, like, eq, sql, SQL } from "drizzle-orm";

export class GetDbErrorLogsUsecase {
    private db = db;

    private buildWhereConditions(filters: DbErrorLogFilters): SQL[] {
        const conditions: SQL[] = [];

        if (filters.search) {
            conditions.push(like(dbErrorLogger.errorMessage, `%${filters.search}%`));
        }
        if (filters.referenceTable) {
            conditions.push(eq(dbErrorLogger.referenceTable, filters.referenceTable));
        }
        if (filters.applicationName) {
            conditions.push(eq(dbErrorLogger.applicationName, filters.applicationName));
        }
        if (filters.sqlState) {
            conditions.push(eq(dbErrorLogger.sqlState, filters.sqlState));
        }
        if (filters.createdAtFrom) {
            const fromVal = `${filters.createdAtFrom} 00:00:00.000`;
            conditions.push(sql`${dbErrorLogger.createdAt} >= ${fromVal}`);
        }
        if (filters.createdAtTo) {
            const toVal = `${filters.createdAtTo} 23:59:59.999`;
            conditions.push(sql`${dbErrorLogger.createdAt} <= ${toVal}`);
        }

        return conditions;
    }

    async executePaginated(
        page: number,
        offset: number,
        limit: number,
        filters: DbErrorLogFilters = {},
    ): Promise<PaginatedDbErrorLogsDTO> {
        try {
            const conditions = this.buildWhereConditions(filters);
            const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

            const [rows, totalRows] = await Promise.all([
                this.db
                    .select()
                    .from(dbErrorLogger)
                    .where(whereClause)
                    .orderBy(desc(dbErrorLogger.createdAt))
                    .limit(limit)
                    .offset(offset),
                this.db
                    .select({ total: count() })
                    .from(dbErrorLogger)
                    .where(whereClause),
            ]);

            return {
                rows: rows as DbErrorLog[],
                total: Number(totalRows[0]?.total ?? 0),
                page,
                limit,
                offset,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get paginated db error logs");
        }
    }
}
