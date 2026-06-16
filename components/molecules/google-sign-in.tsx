"use client";

import {
    GoogleOAuthProvider,
    useGoogleOAuth,
    type CredentialResponse,
} from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";

const LOGIN_BUTTON_CLASS =
    "theme-button-secondary flex w-full items-center justify-center gap-3 border py-3.5 text-center text-xs font-semibold uppercase tracking-[0.35em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-75 focus-visible:outline focus-visible:outline-offset-2";

function GoogleMark() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="shrink-0"
        >
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    );
}

function GoogleSignInButton({
    disabled,
    onError,
}: {
    disabled: boolean;
    onError: (message: string | null) => void;
}) {
    const router = useRouter();
    const hiddenButtonRef = useRef<HTMLDivElement>(null);
    const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const completeGoogleSignIn = useCallback(
        async (credential: string) => {
            setIsSigningIn(true);
            onError(null);

            try {
                const result = await signIn("credentials", {
                    googleIdToken: credential,
                    redirect: false,
                });

                if (result?.error) {
                    setIsSigningIn(false);
                    onError(
                        "This Google account is not registered for admin access. Ask an owner to add your email.",
                    );
                    return;
                }

                router.push("/dashboard");
                router.refresh();
            } catch {
                setIsSigningIn(false);
                onError(
                    "Unable to sign in with Google right now. Please try again.",
                );
            }
        },
        [onError, router],
    );

    useEffect(() => {
        if (!scriptLoadedSuccessfully || !hiddenButtonRef.current) {
            return;
        }

        const google = (
            window as Window & {
                google?: {
                    accounts: {
                        id: {
                            initialize: (config: {
                                client_id: string;
                                callback: (
                                    response: CredentialResponse,
                                ) => void;
                            }) => void;
                            renderButton: (
                                element: HTMLElement,
                                config: Record<string, unknown>,
                            ) => void;
                        };
                    };
                };
            }
        ).google;
        if (!google?.accounts?.id) {
            return;
        }

        google.accounts.id.initialize({
            client_id: clientId,
            callback: (credentialResponse: CredentialResponse) => {
                const credential = credentialResponse.credential;
                if (!credential) {
                    onError("Google sign-in did not return a credential.");
                    return;
                }

                void completeGoogleSignIn(credential);
            },
        });

        google.accounts.id.renderButton(hiddenButtonRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            width: 400,
        });
    }, [clientId, completeGoogleSignIn, onError, scriptLoadedSuccessfully]);

    function handleClick() {
        if (disabled || isSigningIn || !scriptLoadedSuccessfully) {
            return;
        }

        const googleButton = hiddenButtonRef.current?.querySelector(
            '[role="button"]',
        ) as HTMLElement | null;

        if (!googleButton) {
            onError("Google sign-in is still loading. Please try again.");
            return;
        }

        googleButton.click();
    }

    const isBusy = disabled || isSigningIn;

    return (
        <div className="relative w-full">
            <button
                type="button"
                disabled={isBusy || !scriptLoadedSuccessfully}
                onClick={handleClick}
                className={LOGIN_BUTTON_CLASS}
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
                    <>
                        <GoogleMark />
                        Continue with Google
                    </>
                )}
            </button>

            <div
                ref={hiddenButtonRef}
                className="pointer-events-none absolute left-[-9999px] h-10 w-[400px] overflow-hidden opacity-0"
                aria-hidden="true"
            />
        </div>
    );
}

export function GoogleSignIn({
    clientId,
    disabled,
    onError,
}: {
    clientId: string;
    disabled: boolean;
    onError: (message: string | null) => void;
}) {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleSignInButton disabled={disabled} onError={onError} />
        </GoogleOAuthProvider>
    );
}
