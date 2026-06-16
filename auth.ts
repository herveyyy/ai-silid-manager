import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./drizzle/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
    getRegisteredDashboardUser,
    normalizeAuthEmail,
} from "./lib/auth/dashboard-user";
import { hasDashboardAccess } from "./lib/auth/dashboard-roles";
import {
    clearFailedLoginAttempts,
    createLoginRateLimitKey,
    isLoginBlocked,
    recordFailedLoginAttempt,
} from "./lib/auth/login-rate-limit";
import { verifyGoogleIdToken } from "./lib/auth/verify-google-id-token";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt" },
    trustHost: true,
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                googleIdToken: { label: "Google ID Token", type: "text" },
            },
            async authorize(credentials) {
                try {
                    const googleIdToken = credentials?.googleIdToken as
                        | string
                        | undefined;

                    if (googleIdToken) {
                        const identity =
                            await verifyGoogleIdToken(googleIdToken);
                        if (!identity) {
                            return null;
                        }

                        const registered = await getRegisteredDashboardUser(
                            identity.email,
                        );
                        if (!registered) {
                            return null;
                        }

                        return {
                            id: registered.id,
                            email: registered.email,
                            name: registered.name,
                            role: registered.role,
                        };
                    }

                    const emailRaw = credentials?.email as string | undefined;
                    const password = credentials?.password as
                        | string
                        | undefined;

                    if (!emailRaw || !password) {
                        return null;
                    }

                    const email = normalizeAuthEmail(emailRaw);
                    const rateLimitKey = createLoginRateLimitKey(email);
                    if (isLoginBlocked(rateLimitKey)) {
                        return null;
                    }

                    const [user] = await db
                        .select()
                        .from(users)
                        .where(sql`lower(trim(${users.email})) = ${email}`)
                        .limit(1);

                    if (!user || !user.password) {
                        recordFailedLoginAttempt(rateLimitKey);
                        return null;
                    }

                    if (!hasDashboardAccess(user.role)) {
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
