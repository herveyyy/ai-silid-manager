import {
    CreateSchoolPayload,
    PaginatedSchoolUsageViewDTO,
    SchoolDTO,
    SchoolUsageViewDTO,
} from "@/lib/types/admin-types";
import { GetAllSchoolsUsecase } from "../usecase/schools/get_all_schools.usecase";
import { GetSchoolsUsageViewUsecase } from "../usecase/schools/get_schools_usage_view.usecase";
import { StoredSchoolConfig } from "@/lib/school-config-storage";
import { UpdateSchoolConfigurationUsecase } from "../usecase/schools/update_school_configuration.usecase";
import { CreateSchoolUsecase } from "../usecase/schools/create_school.usecase";

export class SchoolsService {
    constructor(
        private readonly getAllSchoolsUsecase: GetAllSchoolsUsecase,
        private readonly getSchoolsUsageViewUsecase: GetSchoolsUsageViewUsecase,
        private readonly updateSchoolConfigurationUsecase: UpdateSchoolConfigurationUsecase,
        private readonly createSchoolUsecase: CreateSchoolUsecase,
    ) {}

    async getAllSchools(): Promise<SchoolDTO[]> {
        return await this.getAllSchoolsUsecase.execute();
    }

    async getSchoolsUsageView(): Promise<SchoolUsageViewDTO[]> {
        return await this.getSchoolsUsageViewUsecase.execute();
    }

    async getPaginatedSchoolsUsageView(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedSchoolUsageViewDTO> {
        return await this.getSchoolsUsageViewUsecase.executePaginated(
            page,
            offset,
            limit,
        );
    }

    async updateSchoolConfiguration(
        schoolId: string,
        data: StoredSchoolConfig,
    ): Promise<void> {
        return await this.updateSchoolConfigurationUsecase.execute(
            schoolId,
            data,
        );
    }

    async createSchool(data: CreateSchoolPayload): Promise<SchoolDTO> {
        return await this.createSchoolUsecase.execute(data);
    }
}
