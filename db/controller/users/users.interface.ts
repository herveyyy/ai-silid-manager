import type { UserOverviewDTO } from "@/lib/types/admin-types";
import {
    CreateUserPayload,
    DashboardAccessUserDTO,
    SelectUser,
} from "@/lib/types/user-types";

export interface IUsers {
    getUserByCreds(email: string, password: string): Promise<SelectUser | null>;
    getUserOverview(): Promise<UserOverviewDTO>;
    getDashboardAccessUsers(): Promise<DashboardAccessUserDTO[]>;
    getUserByEmail(email: string): Promise<SelectUser | null>;
    grantAdminAccess(userId: string): Promise<void>;
    revokeAdminAccess(userId: string): Promise<void>;
    createAdminUser(data: CreateUserPayload): Promise<SelectUser | null>;
}
