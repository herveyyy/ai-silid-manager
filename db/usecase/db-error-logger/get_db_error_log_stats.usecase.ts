import { db } from "@/db";
import { dbErrorLogger } from "@/drizzle/schema";
import type { DbErrorLogStatsDTO } from "@/lib/types/admin-types";
import { count, gte, sql } from "drizzle-orm";

export class GetDbErrorLogStatsUsecase {
    private db = db;

    async execute(): Promise<DbErrorLogStatsDTO> {
        try {
            const [
                totalRows,
                last24hRows,
                refTableRows,
                appNameRows,
                sqlStateRows,
            ] = await Promise.all([
                this.db.select({ total: count() }).from(dbErrorLogger),

                this.db
                    .select({ total: count() })
                    .from(dbErrorLogger)
                    .where(
                        gte(
                            dbErrorLogger.createdAt,
                            sql`DATE_SUB(NOW(3), INTERVAL 24 HOUR)`,
                        ),
                    ),

                this.db
                    .select({
                        name: dbErrorLogger.referenceTable,
                        cnt: count(),
                    })
                    .from(dbErrorLogger)
                    .groupBy(dbErrorLogger.referenceTable)
                    .orderBy(sql`count(*) desc`)
                    .limit(10),

                this.db
                    .selectDistinct({ applicationName: dbErrorLogger.applicationName })
                    .from(dbErrorLogger)
                    .orderBy(dbErrorLogger.applicationName),

                this.db
                    .selectDistinct({ sqlState: dbErrorLogger.sqlState })
                    .from(dbErrorLogger)
                    .orderBy(dbErrorLogger.sqlState),
            ]);

            const topReferenceTable =
                refTableRows.length > 0 && refTableRows[0].name
                    ? { name: refTableRows[0].name, count: Number(refTableRows[0].cnt) }
                    : null;

            const distinctReferenceTables = refTableRows
                .map((r) => r.name)
                .filter((n): n is string => n != null);

            const distinctApplicationNames = appNameRows
                .map((r) => r.applicationName)
                .filter((n): n is string => n != null);

            const distinctSqlStates = sqlStateRows
                .map((r) => r.sqlState)
                .filter((s): s is string => s != null);

            return {
                totalCount: Number(totalRows[0]?.total ?? 0),
                last24hCount: Number(last24hRows[0]?.total ?? 0),
                topReferenceTable,
                distinctReferenceTables,
                distinctApplicationNames,
                distinctSqlStates,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get db error log stats");
        }
    }
}
