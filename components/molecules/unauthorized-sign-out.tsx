"use client";

import { signOut } from "next-auth/react";

export function UnauthorizedSignOut() {
  return (
    <button
      type="button"
      className="theme-button-secondary inline-flex border px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
    >
      Sign out
    </button>
  );
}
