"use client";

import { signOut } from "next-auth/react";

/**
 * Clears the session without following Auth.js server redirects.
 * Avoids production misroutes to http://0.0.0.0:3000 when AUTH_URL is unset.
 */
export async function signOutToLogin(): Promise<void> {
    await signOut({ redirect: false });
    window.location.assign("/login");
}
