"use client";

import { signIn } from "next-auth/react";

export function LoginForm() {
  const credentialsAction = (formData: FormData) => {
    signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  };

  return (
    <form className="space-y-8" action={credentialsAction}>
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
          className="theme-input w-full border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:ring-0"
        />
      </div>

      <button
        type="submit"
        className="theme-button-secondary w-full border py-3.5 text-center text-xs font-semibold uppercase tracking-[0.35em] transition-colors duration-150 focus-visible:outline focus-visible:outline-offset-2"
        style={{ outlineColor: "var(--foreground)" }}
      >
        Sign in
      </button>
    </form>
  );
}
