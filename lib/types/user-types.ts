import { users } from "@/drizzle/schema";

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type User = SelectUser;
