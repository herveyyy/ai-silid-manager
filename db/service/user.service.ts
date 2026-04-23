import { GetUserByCredsUsecase } from "../usecase/user/get_user_by_creds.usecase";
import { GetUserOverviewUsecase } from "../usecase/user/get_user_overview.usecase";
import type { UserOverviewDTO } from "@/lib/types/admin-types";
import { SelectUser } from "@/lib/types/user-types";

export class UserService {
    constructor(
        private readonly getUserByCredsUsecase: GetUserByCredsUsecase,
        private readonly getUserOverviewUsecase: GetUserOverviewUsecase,
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
}
