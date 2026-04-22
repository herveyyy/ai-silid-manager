import { drizzle } from "drizzle-orm/mysql2";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mysql = require("mysql2/promise");

const pool = mysql.createPool(process.env.DATABASE_URL!);

export const db = drizzle(pool);
