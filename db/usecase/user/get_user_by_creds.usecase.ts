import { db } from "@/db";
import { users } from "@/drizzle/schema";
import { verifyPassword } from "@/lib/auth/password";
import { SelectUser } from "@/lib/types/user-types";
import { eq } from "drizzle-orm";

export class GetUserByCredsUsecase {
    private db = db;

    async execute(email: string, password: string): Promise<SelectUser | null> {
        try {
            const foundUsers = await this.db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            const user = foundUsers[0];
            if (!user) {
                return null;
            }

            const isPasswordValid = await verifyPassword(password, user.password);
            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get user by credentials");
        }
    }
}
