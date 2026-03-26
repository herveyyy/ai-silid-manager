import { PromptLog } from "@/lib/types/admin-types";
import { GetUserByCredsUsecase } from "../usecase/user/get_user_by_creds.usecase";
import { SelectUser } from "@/lib/types/user-types";
import { GetPromptLogsUsecase } from "../usecase/prompts/get_ai_prompts.usecase";

export class UserService {
    constructor(
        private readonly getUserByCredsUsecase: GetUserByCredsUsecase,
    ) {}
    async getUserByCreds(
        email: string,
        password: string,
    ): Promise<SelectUser | null> {
        return await this.getUserByCredsUsecase.execute(email, password);
    }
}
