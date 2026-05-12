import { SchoolsController } from "@/db/controller/schools/schools.controller";
import { SchoolsService } from "@/db/service/schools.service";
import { GetAllSchoolsUsecase } from "@/db/usecase/schools/get_all_schools.usecase";
import { GetSchoolsUsageViewUsecase } from "@/db/usecase/schools/get_schools_usage_view.usecase";
import { UpdateSchoolConfigurationUsecase } from "@/db/usecase/schools/update_school_configuration.usecase";
import { CreateSchoolUsecase } from "@/db/usecase/schools/create_school.usecase";
import { UpdateSchoolPasswordUsecase } from "@/db/usecase/schools/update_school_password.usecase";
import { UpdateSchoolProfileUsecase } from "@/db/usecase/schools/update_school_profile.usecase";

export function createSchoolsModule(): SchoolsController {
    return new SchoolsController(
        new SchoolsService(
            new GetAllSchoolsUsecase(),
            new GetSchoolsUsageViewUsecase(),
            new UpdateSchoolConfigurationUsecase(),
            new CreateSchoolUsecase(),
            new UpdateSchoolPasswordUsecase(),
            new UpdateSchoolProfileUsecase(),
        ),
    );
}
