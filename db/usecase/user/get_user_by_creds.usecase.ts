import { db } from "@/db";
import { users } from "@/drizzle/schema";
import { SelectUser } from "@/lib/types/user-types";
import { and, eq } from "drizzle-orm";

export class GetUserByCredsUsecase {
    private db = db;

    async execute(email: string, password: string): Promise<SelectUser> {
        try {
            const user = await this.db
                .select()
                .from(users)
                .where(
                    and(eq(users.email, email), eq(users.password, password)),
                );
            if (user.length === 0) {
                throw new Error("User not found");
            }
            return user[0];
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get user by credentials");
        }
    }
}
