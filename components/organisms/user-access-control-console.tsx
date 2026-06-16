"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import type { DashboardAccessUserDTO } from "@/lib/types/user-types";
import {
    createAdminUserAction,
    revokeAdminAccessAction,
} from "@/app/dashboard/user-access-control/actions";

export function UserAccessControlConsole({
    users,
    currentUserId,
}: {
    users: DashboardAccessUserDTO[];
    currentUserId: string;
}) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [formSavedFlash, setFormSavedFlash] = useState(false);
    const [rowError, setRowError] = useState<string | null>(null);
    const [isFormPending, startFormTransition] = useTransition();
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);

    const applyCreateAdmin = useCallback(() => {
        setFormError(null);
        startFormTransition(async () => {
            const result = await createAdminUserAction({ name, email, password });
            if (!result.success) {
                setFormSavedFlash(false);
                setFormError(result.message);
                return;
            }
            setName("");
            setEmail("");
            setPassword("");
            setFormSavedFlash(true);
            window.setTimeout(() => setFormSavedFlash(false), 2200);
            router.refresh();
        });
    }, [email, name, password, router]);

    const applyRevoke = useCallback(
        (userId: string, userName: string) => {
            if (
                !window.confirm(
                    `Revoke admin access for ${userName}? They will lose dashboard access.`,
                )
            ) {
                return;
            }
            setRowError(null);
            setPendingUserId(userId);
            startFormTransition(async () => {
                const result = await revokeAdminAccessAction(userId);
                setPendingUserId(null);
                if (!result.success) {
                    setRowError(result.message);
                    return;
                }
                router.refresh();
            });
        },
        [router],
    );

    return (
        <div className="space-y-8">
            <div className="theme-panel-strong border p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
                    Add admin
                </p>
                <p className="mt-2 max-w-2xl font-mono text-[11px] leading-relaxed text-(--muted)">
                    Create a new admin account or promote an existing user by email.
                    Only owners can manage dashboard operators.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={500}
                            className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                        />
                    </label>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={320}
                            autoComplete="off"
                            className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                        />
                    </label>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong) sm:col-span-2">
                        Password{" "}
                        <span className="normal-case tracking-normal text-(--muted)">
                            (required for new accounts)
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            maxLength={100}
                            autoComplete="new-password"
                            className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                            placeholder="Min 8 characters"
                        />
                    </label>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={applyCreateAdmin}
                        disabled={isFormPending}
                        className="theme-button border px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
                    >
                        {isFormPending && !pendingUserId ? "Saving…" : "Add admin"}
                    </button>
                    {formSavedFlash ? (
                        <span className="font-mono text-[11px] text-(--success)">
                            Saved
                        </span>
                    ) : null}
                    {formError ? (
                        <span className="font-mono text-[11px] text-(--danger)">
                            {formError}
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="theme-panel border">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse font-mono text-[11px]">
                        <thead>
                            <tr
                                className="theme-panel-strong border-b text-left text-(--muted)"
                                style={{ borderColor: "var(--border-strong)" }}
                            >
                                <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                                    name
                                </th>
                                <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                                    email
                                </th>
                                <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                                    role
                                </th>
                                <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                                    created_at
                                </th>
                                <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                                    —
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                const isOwner = user.role === "owner";
                                const isSelf = user.id === currentUserId;
                                const canRevoke = !isOwner && !isSelf;

                                return (
                                    <tr
                                        key={user.id}
                                        className="theme-table-row border-b text-(--muted-strong) transition-colors"
                                        style={{ borderColor: "var(--border)" }}
                                    >
                                        <td className="px-4 py-3 font-medium text-foreground">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3 uppercase">{user.role}</td>
                                        <td className="px-4 py-3 text-(--muted)">
                                            {user.createdAt?.slice(0, 10) ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {canRevoke ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        applyRevoke(user.id, user.name)
                                                    }
                                                    disabled={
                                                        isFormPending &&
                                                        pendingUserId === user.id
                                                    }
                                                    className="border border-(--danger)/40 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-(--danger) transition-colors hover:bg-(--danger)/10 disabled:opacity-50"
                                                >
                                                    {isFormPending &&
                                                    pendingUserId === user.id
                                                        ? "Revoking…"
                                                        : "Revoke admin"}
                                                </button>
                                            ) : (
                                                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                                                    {isOwner ? "Owner" : "You"}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 ? (
                    <p className="px-4 py-6 font-mono text-[12px] text-(--muted)">
                        No dashboard operators found.
                    </p>
                ) : null}
                {rowError ? (
                    <p className="border-t px-4 py-3 font-mono text-[11px] text-(--danger)" style={{ borderColor: "var(--border)" }}>
                        {rowError}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
