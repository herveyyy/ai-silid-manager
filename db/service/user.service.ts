import { GetUserByCredsUsecase } from "../usecase/user/get_user_by_creds.usecase";
import { GetUserOverviewUsecase } from "../usecase/user/get_user_overview.usecase";
import { CreateUsersUsecase } from "../usecase/user/create_users.usecase";
import type { UserOverviewDTO } from "@/lib/types/admin-types";
import { CreateUserPayload, SelectUser } from "@/lib/types/user-types";

export class UserService {
    constructor(
        private readonly getUserByCredsUsecase: GetUserByCredsUsecase,
        private readonly getUserOverviewUsecase: GetUserOverviewUsecase,
        private readonly createUserUsecase: CreateUsersUsecase,
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
}
