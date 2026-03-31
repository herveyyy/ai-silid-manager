import { StoredSchoolConfig } from "@/lib/school-config-storage";
import {
    CreateSchoolPayload,
    PaginatedSchoolUsageViewDTO,
    SchoolDTO,
    SchoolUsageViewDTO,
    UpdateSchoolProfilePayload,
} from "@/lib/types/admin-types";

export interface ISchools {
    getAllSchools(): Promise<SchoolDTO[]>;
    getSchoolsUsageView(): Promise<SchoolUsageViewDTO[]>;
    getPaginatedSchoolsUsageView(
        page: number,
        offset: number,
        limit: number,
    ): Promise<PaginatedSchoolUsageViewDTO>;
    updateSchoolConfiguration(
        schoolId: string,
        data: StoredSchoolConfig,
    ): Promise<void>;
    createSchool(data: CreateSchoolPayload): Promise<SchoolDTO>;
    updateSchoolPassword(
        schoolId: string,
        password: string | null,
    ): Promise<void>;
    updateSchoolProfile(
        schoolId: string,
        data: UpdateSchoolProfilePayload,
    ): Promise<void>;
}
