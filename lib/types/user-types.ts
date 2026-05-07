import { users } from "@/drizzle/schema";
import { UserRole } from "@/lib/auth/dashboard-roles";

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type User = SelectUser;

export type CreateUserPayload = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    imageUrl: string;
};

export type UpdateUserPayload = {
    name: string;
    email: string;
    role: UserRole;
    imageUrl: string;
    password: string;
};