import { SchoolDTO, SchoolUsageViewDTO } from "@/lib/types/admin-types";
import { GetAllSchoolsUsecase } from "../usecase/schools/get_all_schools.usecase";
import { GetSchoolsUsageViewUsecase } from "../usecase/schools/get_schools_usage_view.usecase";

export class SchoolsService {
    constructor(
        private readonly getAllSchoolsUsecase: GetAllSchoolsUsecase,
        private readonly getSchoolsUsageViewUsecase: GetSchoolsUsageViewUsecase,
    ) {}

    async getAllSchools(): Promise<SchoolDTO[]> {
        return await this.getAllSchoolsUsecase.execute();
    }

    async getSchoolsUsageView(): Promise<SchoolUsageViewDTO[]> {
        return await this.getSchoolsUsageViewUsecase.execute();
    }
}
