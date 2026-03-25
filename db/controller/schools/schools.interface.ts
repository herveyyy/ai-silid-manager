import { SchoolDTO } from "@/lib/types/admin-types";

export interface ISchools {
    getAllSchools(): Promise<SchoolDTO[]>;
}
