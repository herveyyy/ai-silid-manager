import { SchoolsController } from "./controller/schools/schools.controller";
import { UsersController } from "./controller/users/users.controller";
import { SchoolsService } from "./service/schools.service";
import { UserService } from "./service/user.service";
import { GetAllSchoolsUsecase } from "./usecase/schools/get_all_schools.usecase";
import { GetUserByCredsUsecase } from "./usecase/user/get_user_by_creds.usecase";

export function createSchoolsController(): SchoolsController {
    return new SchoolsController(
        new SchoolsService(new GetAllSchoolsUsecase()),
    );
}
export function createUsersController(): UsersController {
    return new UsersController(new UserService(new GetUserByCredsUsecase()));
}
