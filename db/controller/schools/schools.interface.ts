import { StoredSchoolConfig } from "@/lib/school-config-storage";
import { SchoolDTO, SchoolUsageViewDTO } from "@/lib/types/admin-types";

export interface ISchools {
    getAllSchools(): Promise<SchoolDTO[]>;
    getSchoolsUsageView(): Promise<SchoolUsageViewDTO[]>;
    updateSchoolConfiguration(
        schoolId: string,
        data: StoredSchoolConfig,
    ): Promise<void>;
}
