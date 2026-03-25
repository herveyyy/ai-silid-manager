import { SchoolDTO } from "@/lib/types/admin-types";
import { GetAllSchoolsUsecase } from "../usecase/schools/get_all_schools.usecase";

export class SchoolsService {
    constructor(private readonly getAllSchoolsUsecase: GetAllSchoolsUsecase) {}
    async getAllSchools(): Promise<SchoolDTO[]> {
        return await this.getAllSchoolsUsecase.execute();
    }
}
