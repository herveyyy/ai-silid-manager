import { OAuth2Client } from "google-auth-library";

export type VerifiedGoogleIdentity = {
    email: string;
    name?: string;
};

export async function verifyGoogleIdToken(
    idToken: string,
): Promise<VerifiedGoogleIdentity | null> {
    const clientId = process.env.AUTH_GOOGLE_ID?.trim();
    if (!clientId || !idToken.trim()) {
        return null;
    }

    const client = new OAuth2Client(clientId);

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: clientId,
        });
        const payload = ticket.getPayload();
        const email = payload?.email?.trim();

        if (!email || payload?.email_verified === false) {
            return null;
        }

        return {
            email,
            name: payload?.name,
        };
    } catch (error) {
        console.error("Google ID token verification failed:", error);
        return null;
    }
}
