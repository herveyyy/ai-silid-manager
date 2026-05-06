import type { UserOverviewDTO } from "@/lib/types/admin-types";
import { SelectUser } from "@/lib/types/user-types";

export interface IUsers {
    getUserByCreds(email: string, password: string): Promise<SelectUser | null>;
    getUserOverview(): Promise<UserOverviewDTO>;
}
