"use server";

import { SchoolsController } from "@/db/controller/schools/schools.controller";
import { SchoolsService } from "@/db/service/schools.service";
import { GetAllSchoolsUsecase } from "@/db/usecase/schools/get_all_schools.usecase";

export async function createSchoolsController(): Promise<SchoolsController> {
    const schoolsService = new SchoolsService(new GetAllSchoolsUsecase());
    return new SchoolsController(schoolsService);
}
