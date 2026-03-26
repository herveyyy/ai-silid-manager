import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
    clearFailedLoginAttempts,
    createLoginRateLimitKey,
    isLoginBlocked,
    recordFailedLoginAttempt,
} from "./lib/auth/login-rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const email = credentials?.email as string | undefined;
                    const password = credentials?.password as
                        | string
                        | undefined;

                    if (!email || !password) {
                        return null;
                    }

                    const rateLimitKey = createLoginRateLimitKey(email);
                    if (isLoginBlocked(rateLimitKey)) {
                        return null;
                    }

                    const [user] = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, email))
                        .limit(1);

                    if (!user || !user.password) {
                        recordFailedLoginAttempt(rateLimitKey);
                        return null;
                    }

                    const isValid = await bcrypt.compare(
                        password,
                        user.password,
                    );
                    if (!isValid) {
                        recordFailedLoginAttempt(rateLimitKey);
                        return null;
                    }

                    clearFailedLoginAttempts(rateLimitKey);

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
            }

            return session;
        },
    },
});
