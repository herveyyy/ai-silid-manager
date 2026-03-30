import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UnauthorizedSignOut } from "@/components/molecules/unauthorized-sign-out";
import { hasDashboardAccess } from "@/lib/auth/dashboard-roles";

export const metadata: Metadata = {
  title: "Access denied · Silid Admin",
  description: "You do not have permission to use the admin console",
};

export default async function UnauthorizedPage() {
  const session = await auth();
  const role = session?.user
    ? (session.user as { role?: string }).role
    : undefined;

  if (hasDashboardAccess(role)) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans text-foreground">
      <div className="theme-grid pointer-events-none absolute inset-0 opacity-[0.85]" />
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
        ACCESS // DENIED
      </div>
      <div className="pointer-events-none absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
        RBAC // ENFORCED
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
        <div className="theme-panel theme-inset-shadow border px-8 py-10">
          <header
            className="mb-8 space-y-2 border-b pb-8"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-(--muted)">
              POLICY.403
            </p>
            <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-foreground md:text-2xl">
              Unauthorized
            </h1>
            <p className="font-mono text-[12px] leading-relaxed text-(--muted)">
              The admin control surface is limited to authorized roles. Your
              account is signed in but does not have access to this application.
            </p>
          </header>

          {session?.user ? (
            <div className="space-y-6">
              <dl className="space-y-3 font-mono text-[11px]">
                <div>
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    identity
                  </dt>
                  <dd className="mt-1 text-(--muted-strong)">
                    {session.user.email ?? session.user.name ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    role
                  </dt>
                  <dd className="mt-1 uppercase text-(--muted-strong)">
                    {role ?? "unknown"}
                  </dd>
                </div>
              </dl>
              <p className="font-mono text-[11px] leading-relaxed text-(--muted)">
                Allowed roles for this console:{" "}
                <span className="text-(--muted-strong)">admin</span>. Contact
                an administrator if you need elevated access.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <UnauthorizedSignOut />
                <Link
                  href="/"
                  className="theme-link inline-block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted-strong) underline underline-offset-2 sm:text-left"
                >
                  Back to home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="font-mono text-[11px] text-(--muted)">
                You are not signed in. Use the admin login to continue.
              </p>
              <Link
                href="/login"
                className="theme-button inline-flex w-full items-center justify-center border px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors sm:w-auto"
              >
                Sign in
              </Link>
              <Link
                href="/"
                className="theme-link block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted-strong) underline underline-offset-2"
              >
                Back to home
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
