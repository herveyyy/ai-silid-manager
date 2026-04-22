import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

let _db: MySql2Database | undefined;

function getDb(): MySql2Database {
    if (!_db) {
        const pool = mysql.createPool(process.env.DATABASE_URL!);
        _db = drizzle(pool);
    }
    return _db;
}

export const db: MySql2Database = new Proxy({} as MySql2Database, {
    get(_, prop) {
        return getDb()[prop as keyof MySql2Database];
    },
});
