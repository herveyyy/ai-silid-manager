import type { Metadata } from "next";
import { LoginForm } from "@/components/organisms/login-form";

export const metadata: Metadata = {
  title: "AUTH.01 // System Access",
  description: "Secure administrative access",
};

export default function LoginPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-background font-sans text-foreground">
      {/* Technical backdrop */}
      <div className="theme-grid pointer-events-none absolute inset-0 opacity-[0.85]" />
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
        GRID_REF // 00.00.00
      </div>
      <div className="pointer-events-none absolute right-24 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
        NODE_SYNC // OK
      </div>
      <div className="pointer-events-none absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
        LAT // ——.——
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
        LNG // ——.——
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="theme-panel theme-inset-shadow w-full max-w-md border px-8 py-10">
          <header className="mb-10 space-y-2 border-b pb-8" style={{ borderColor: "var(--border)" }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-(--muted)">
              STRATIGRAPHY.01
            </p>
            <h1 className="text-xl font-bold uppercase tracking-[0.28em] text-foreground md:text-2xl">
              AUTH.01{" "}
              <span className="text-(--muted)">{"//"}</span> SYSTEM ACCESS
            </h1>
            <p className="font-mono text-[11px] text-(--success)">
              <span className="inline-block h-1.5 w-1.5 bg-(--success) align-middle" />{" "}
              ENCRYPTED_LINK_ESTABLISHED
            </p>
          </header>

          <LoginForm />

          <footer className="mt-10 border-t pt-6" style={{ borderColor: "var(--border)" }}>
            <p className="font-mono text-[11px] tracking-wide text-(--success)">
              • SECURE_PORT_OPEN
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Session telemetry · local only
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
