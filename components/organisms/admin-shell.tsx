"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../molecules/theme-toggle";
import { signOut } from "next-auth/react";

const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/schools", label: "Schools" },
    { href: "/dashboard/storage", label: "Storage" },
    { href: "/dashboard/ai", label: "AI" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-background font-sans text-foreground">
            <div className="theme-grid pointer-events-none fixed inset-0 opacity-[0.85]" />

            <aside className="theme-panel-strong relative z-10 flex w-56 shrink-0 flex-col border-r">
                <div
                    className="border-b px-4 py-6 flex w-full justify-between "
                    style={{ borderColor: "var(--border)" }}
                >
                    <div>
                        {" "}
                        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-(--muted)">
                            Silid admin
                        </p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                            Schools fleet
                        </p>
                    </div>
                    <div>
                        <ThemeToggle />
                    </div>
                </div>
                <nav className="flex flex-1 flex-col gap-0 p-2">
                    {nav.map((item) => {
                        const active =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : item.href === "/dashboard/schools"
                                  ? pathname === "/dashboard/schools" ||
                                    pathname.startsWith("/dashboard/schools/")
                                  : pathname === item.href ||
                                    pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`border px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors ${
                                    active
                                        ? "text-(--accent-contrast)"
                                        : "border-transparent text-(--muted)"
                                }`}
                                style={
                                    active
                                        ? {
                                              borderColor: "var(--accent)",
                                              backgroundColor: "var(--accent)",
                                          }
                                        : undefined
                                }
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div
                    className="border-t p-4"
                    style={{ borderColor: "var(--border)" }}
                >
                    <p className="font-mono text-[10px] text-(--success)">
                        • ADMIN_SESSION_ACTIVE
                    </p>
                    <button
                        className="theme-link mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)"
                    onClick={() => {
                        signOut();
                    }}
                    >
                        Sign out
                    </button>
                </div>
            </aside>

            <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col">
                <header
                    className="theme-panel flex shrink-0 items-center justify-between border-b px-6 py-4"
                    style={{ borderColor: "var(--border)" }}
                >
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
                            Operations console
                        </p>
                        <p className="mt-0.5 text-sm font-bold uppercase tracking-[0.15em]">
                            All schools · registry
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-[10px] text-(--muted)">
                            Local preview
                        </p>
                        <p className="font-mono text-[11px] text-(--success)">
                            DATA_DISCONNECTED
                        </p>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    );
}
