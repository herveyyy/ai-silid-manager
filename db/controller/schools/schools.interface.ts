import { SchoolDTO } from "@/lib/admin-types";

export interface ISchools {
    getAllSchools(): Promise<SchoolDTO[]>;
}
