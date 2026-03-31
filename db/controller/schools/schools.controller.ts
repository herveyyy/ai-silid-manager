import { SchoolsService } from "@/db/service/schools.service";
import { ISchools } from "./schools.interface";
import type {
    CreateSchoolPayload,
    PaginatedSchoolUsageViewDTO,
    SchoolDTO,
    SchoolUsageViewDTO,
} from "@/lib/types/admin-types";
import { StoredSchoolConfig } from "@/lib/school-config-storage";

export class SchoolsController implements ISchools {
    constructor(private readonly schoolsService: SchoolsService) {}

    async getAllSchools(): Promise<SchoolDTO[]> {
        return await this.schoolsService.getAllSchools();
    }

    async getSchoolsUsageView(): Promise<SchoolUsageViewDTO[]> {
        return await this.schoolsService.getSchoolsUsageView();
    }

    async getPaginatedSchoolsUsageView(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedSchoolUsageViewDTO> {
        return await this.schoolsService.getPaginatedSchoolsUsageView(
            page,
            offset,
            limit,
        );
    }

    async updateSchoolConfiguration(
        schoolId: string,
        data: StoredSchoolConfig,
    ): Promise<void> {
        return await this.schoolsService.updateSchoolConfiguration(
            schoolId,
            data,
        );
    }

    async createSchool(data: CreateSchoolPayload): Promise<SchoolDTO> {
        return await this.schoolsService.createSchool(data);
    }

    async updateSchoolPassword(
        schoolId: string,
        password: string | null,
    ): Promise<void> {
        return await this.schoolsService.updateSchoolPassword(
            schoolId,
            password,
        );
    }
}
