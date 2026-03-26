import { SchoolsService } from "@/db/service/schools.service";
import { ISchools } from "./schools.interface";
import type { SchoolDTO, SchoolUsageViewDTO } from "@/lib/types/admin-types";
import { StoredSchoolConfig } from "@/lib/school-config-storage";

export class SchoolsController implements ISchools {
    constructor(private readonly schoolsService: SchoolsService) {}

    async getAllSchools(): Promise<SchoolDTO[]> {
        return await this.schoolsService.getAllSchools();
    }

    async getSchoolsUsageView(): Promise<SchoolUsageViewDTO[]> {
        return await this.schoolsService.getSchoolsUsageView();
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
}
