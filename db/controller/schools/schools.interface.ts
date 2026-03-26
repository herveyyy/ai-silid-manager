import { SchoolDTO, SchoolUsageViewDTO } from "@/lib/types/admin-types";

export interface ISchools {
    getAllSchools(): Promise<SchoolDTO[]>;
    getSchoolsUsageView(): Promise<SchoolUsageViewDTO[]>;
}
