import { users } from "@/drizzle/schema";
export type UserRole = (typeof users.role.enumValues)[number];
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

/** Dashboard operator without credential fields. */
export type DashboardAccessUserDTO = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string | null;
};