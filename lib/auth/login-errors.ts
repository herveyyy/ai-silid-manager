export function getLoginErrorMessage(
    error: string | undefined,
    reason: string | undefined,
): string | null {
    if (reason === "expired") {
        return "Your session expired. Please sign in again.";
    }

    switch (error) {
        case "AccessDenied":
            return "This account is not registered for admin access. Ask an owner to add your email.";
        case "Configuration":
            return "Google sign-in is not configured on this server.";
        case "OAuthSignin":
        case "OAuthCallback":
        case "OAuthCreateAccount":
        case "Callback":
            return "Google sign-in failed. Please try again.";
        default:
            return error ? "Sign in failed. Please try again." : null;
    }
}
