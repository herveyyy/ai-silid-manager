import { UsersController } from "@/db/controller/users/users.controller";
import { UserService } from "@/db/service/user.service";
import { GetUserByCredsUsecase } from "@/db/usecase/user/get_user_by_creds.usecase";
import { GetUserOverviewUsecase } from "@/db/usecase/user/get_user_overview.usecase";
import { CreateUsersUsecase } from "@/db/usecase/user/create_users.usecase";

export function createUsersModule(): UsersController {
    return new UsersController(
        new UserService(
            new GetUserByCredsUsecase(),
            new GetUserOverviewUsecase(),
            new CreateUsersUsecase(),
        ),
    );
}
