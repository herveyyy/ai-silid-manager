import { SchoolsController } from "./controller/schools/schools.controller";
import { SchoolsService } from "./service/schools.service";
import { GetAllSchoolsUsecase } from "./usecase/schools/get_all_schools.usecase";

export function createSchoolsController(): SchoolsController {
    return new SchoolsController(
        new SchoolsService(new GetAllSchoolsUsecase()),
    );
}
