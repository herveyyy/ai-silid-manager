import { db } from "@/db";
import { users } from "@/drizzle/schema";
import type { SelectUser } from "@/lib/types/user-types";
import { eq } from "drizzle-orm";

export class GetUserByEmailUsecase {
    private db = db;

    async execute(email: string): Promise<SelectUser | null> {
        try {
            const [row] = await this.db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            return row ?? null;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get user by email");
        }
    }
}
