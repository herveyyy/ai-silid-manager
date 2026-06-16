import { GetUserByCredsUsecase } from "../usecase/user/get_user_by_creds.usecase";
import { GetUserOverviewUsecase } from "../usecase/user/get_user_overview.usecase";
import { CreateUsersUsecase } from "../usecase/user/create_users.usecase";
import { GetDashboardAccessUsersUsecase } from "../usecase/user/get_dashboard_access_users.usecase";
import { GetUserByEmailUsecase } from "../usecase/user/get_user_by_email.usecase";
import { UpdateUserDashboardRoleUsecase } from "../usecase/user/update_user_dashboard_role.usecase";
import type { UserOverviewDTO } from "@/lib/types/admin-types";
import {
    CreateUserPayload,
    DashboardAccessUserDTO,
    SelectUser,
    UserRole,
} from "@/lib/types/user-types";

export class UserService {
    constructor(
        private readonly getUserByCredsUsecase: GetUserByCredsUsecase,
        private readonly getUserOverviewUsecase: GetUserOverviewUsecase,
        private readonly createUserUsecase: CreateUsersUsecase,
        private readonly getDashboardAccessUsersUsecase: GetDashboardAccessUsersUsecase,
        private readonly getUserByEmailUsecase: GetUserByEmailUsecase,
        private readonly updateUserDashboardRoleUsecase: UpdateUserDashboardRoleUsecase,
    ) {}

    async getUserByCreds(
        email: string,
        password: string,
    ): Promise<SelectUser | null> {
        return await this.getUserByCredsUsecase.execute(email, password);
    }

    async getUserOverview(): Promise<UserOverviewDTO> {
        return await this.getUserOverviewUsecase.execute();
    }

    async createUser(data: CreateUserPayload): Promise<SelectUser | null> {
        return await this.createUserUsecase.execute(data);
    }

    async createSuperAdminUser(password: string): Promise<SelectUser | null> {
        return await this.createUserUsecase.execute({
            name: "superadmin",
            email: "superadmin@livro.systems",
            password,
            role: "admin",
            imageUrl: "",
        });
    }

    async getDashboardAccessUsers(): Promise<DashboardAccessUserDTO[]> {
        return await this.getDashboardAccessUsersUsecase.execute();
    }

    async getUserByEmail(email: string): Promise<SelectUser | null> {
        return await this.getUserByEmailUsecase.execute(email);
    }

    async grantAdminAccess(userId: string): Promise<void> {
        await this.updateUserDashboardRoleUsecase.execute(userId, "admin");
    }

    async revokeAdminAccess(userId: string): Promise<void> {
        await this.updateUserDashboardRoleUsecase.execute(userId, "partner");
    }

    async createAdminUser(data: CreateUserPayload): Promise<SelectUser | null> {
        return await this.createUserUsecase.execute({
            ...data,
            role: "admin" satisfies UserRole,
        });
    }
}
