"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasSubmittedRef = useRef(false);

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
    <form className="space-y-8" action={credentialsAction} aria-busy={isSigningIn}>
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
          disabled={isSigningIn}
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
          disabled={isSigningIn}
          className="theme-input w-full border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:ring-0"
        />
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isSigningIn}
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

        {isSigningIn ? (
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-(--muted)">
            Establishing secure session...
          </p>
        ) : null}

        {errorMessage ? (
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-(--danger)">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
