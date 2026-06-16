"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GoogleSignIn } from "@/components/molecules/google-sign-in";

export function LoginForm({
    initialErrorMessage = null,
    googleClientId = "",
}: {
    initialErrorMessage?: string | null;
    googleClientId?: string;
}) {
    const router = useRouter();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        initialErrorMessage,
    );
    const hasSubmittedRef = useRef(false);

    const googleAuthEnabled = googleClientId.length > 0;
    const isBusy = isSigningIn;

    const credentialsAction = async (formData: FormData) => {
        if (hasSubmittedRef.current) {
            return;
        }

        hasSubmittedRef.current = true;
        setIsSigningIn(true);
        setErrorMessage(null);

        try {
            const result = await signIn("credentials", {
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                redirect: false,
            });

            if (result?.error) {
                hasSubmittedRef.current = false;
                setIsSigningIn(false);
                setErrorMessage("Invalid email or password.");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            hasSubmittedRef.current = false;
            setIsSigningIn(false);
            setErrorMessage("Unable to sign in right now. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            {googleAuthEnabled ? (
                <section className="space-y-3">
                    <GoogleSignIn
                        clientId={googleClientId}
                        disabled={isBusy}
                        onError={setErrorMessage}
                    />
                    <p className="text-center font-mono text-[10px] leading-relaxed text-(--muted)">
                        Only emails registered by an owner can sign in with Google.
                    </p>
                    <div
                        className="flex items-center gap-3 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)"
                        aria-hidden="true"
                    >
                        <span className="h-px flex-1 bg-(--border)" />
                        or email
                        <span className="h-px flex-1 bg-(--border)" />
                    </div>
                </section>
            ) : null}

            <form className="space-y-6" action={credentialsAction} aria-busy={isBusy}>
                <div className="space-y-2">
                    <label
                        htmlFor="credentials-email"
                        className="block font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)"
                    >
                        Email
                    </label>
                    <input
                        id="credentials-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        disabled={isBusy}
                        className="theme-input w-full border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:ring-0"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="credentials-password"
                        className="block font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)"
                    >
                        Password
                    </label>
                    <input
                        id="credentials-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        disabled={isBusy}
                        className="theme-input w-full border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:ring-0"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isBusy}
                    className="theme-button-secondary flex w-full items-center justify-center gap-3 border py-3.5 text-center text-xs font-semibold uppercase tracking-[0.35em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-75 focus-visible:outline focus-visible:outline-offset-2"
                    style={{ outlineColor: "var(--foreground)" }}
                >
                    {isSigningIn ? (
                        <>
                            <span
                                className="h-4 w-4 animate-spin rounded-full border-2 border-(--muted) border-t-foreground"
                                aria-hidden="true"
                            />
                            Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>

            {isBusy ? (
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">
                    Establishing secure session...
                </p>
            ) : null}

            {errorMessage ? (
                <p className="rounded border border-(--danger)/30 bg-(--danger)/5 px-3 py-2 text-center font-mono text-[10px] leading-relaxed tracking-[0.12em] text-(--danger)">
                    {errorMessage}
                </p>
            ) : null}
        </div>
    );
}
