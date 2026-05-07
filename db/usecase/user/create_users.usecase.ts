import { db } from "@/db";
import { users } from "@/drizzle/schema";
import { SelectUser, CreateUserPayload } from "@/lib/types/user-types";
import { hashPassword } from "@/lib/auth/password";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

export class CreateUsersUsecase {
    private db = db;

    async execute(data: CreateUserPayload): Promise<SelectUser | null> {
        try {

            const existingUser = await this.db.select().from(users).where(eq(users.email, data.email)).limit(1);
            if (existingUser.length > 0) {
                throw new Error("User already exists");
            }

            const id = randomUUID();
            const passwordHash = await hashPassword(data.password);
            await this.db.insert(users).values({
                id,
                name: data.name,
                email: data.email,
                password: passwordHash,
                role: data.role,
                imageUrl: data.imageUrl,
            });

            const [row] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
            if (!row) {
                throw new Error("Insert returned no row");
            }

            return row;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create user");
        }
    }
}
