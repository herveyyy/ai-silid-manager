import { compare, hash } from "bcryptjs";

export const PASSWORD_SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
    return await hash(password, PASSWORD_SALT_ROUNDS);
}

export async function verifyPassword(
    password: string,
    hashedPassword: string | null,
): Promise<boolean> {
    if (!hashedPassword) {
        return false;
    }

    return await compare(password, hashedPassword);
}
