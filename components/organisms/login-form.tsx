"use client";

export function LoginForm() {
  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="space-y-2">
        <label
          htmlFor="identification"
          className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]"
        >
          Identification
        </label>
        <input
          id="identification"
          name="identification"
          type="text"
          autoComplete="username"
          className="theme-input w-full border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:ring-0"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="access_key"
          className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]"
        >
          Access_key
        </label>
        <input
          id="access_key"
          name="access_key"
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
        Initialize login
      </button>
    </form>
  );
}
