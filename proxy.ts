import { NextResponse, type NextRequest } from "next/server";
import { decode } from "@auth/core/jwt";

function getSessionCookieName(request: NextRequest): string {
    return request.cookies.get("__Secure-authjs.session-token")
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isDashboardPage = pathname.startsWith("/dashboard");
    const isLoginPage = pathname === "/login";
    const cookieName = getSessionCookieName(request);
    const rawToken = request.cookies.get(cookieName)?.value;

    if (!rawToken) {
        if (isDashboardPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    }

    try {
        const decoded = await decode({
            token: rawToken,
            secret: process.env.AUTH_SECRET!,
            salt: cookieName,
        });
        const now = Math.floor(Date.now() / 1000);
        const isExpired = Boolean(
            decoded?.exp &&
            typeof decoded.exp === "number" &&
            decoded.exp < now,
        );

        if (!decoded || isExpired) {
            if (isDashboardPage) {
                return NextResponse.redirect(
                    new URL("/login?reason=expired", request.url),
                );
            }

            return NextResponse.next();
        }

        if (isLoginPage) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Security Bypass Attempt or Decoding Error:", error);

        if (isDashboardPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};
