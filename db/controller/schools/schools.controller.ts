import { SchoolsService } from "@/db/service/schools.service";
import { ISchools } from "./schools.interface";
import type { SchoolDTO } from "@/lib/types/admin-types";

export class SchoolsController implements ISchools {
    constructor(private readonly schoolsService: SchoolsService) {}

    async getAllSchools(): Promise<SchoolDTO[]> {
        return await this.schoolsService.getAllSchools();
    }
}
