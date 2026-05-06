"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Link from "next/link";
import { AdminPanel } from "@/components/molecules/admin-panel";
import type {
    DbErrorLog,
    DbErrorLogFilters,
    DbErrorLogStatsDTO,
    PaginatedDbErrorLogsDTO,
} from "@/lib/types/admin-types";

function StatCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div
            className="theme-panel-strong border px-4 py-3"
            style={
                accent
                    ? {
                          borderColor:
                              "color-mix(in srgb, var(--danger) 40%, transparent)",
                      }
                    : undefined
            }
        >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                {label}
            </p>
            <p
                className="mt-1 font-mono text-xl tabular-nums text-foreground"
                style={accent ? { color: "var(--danger)" } : undefined}
            >
                {value}
            </p>
        </div>
    );
}

function buildHref(
    base: string,
    overrides: Record<string, string | number | undefined>,
): string {
    const params = new URLSearchParams(overrides as Record<string, string>);
    for (const [key, value] of Object.entries(overrides)) {
        if (value == null || value === "") {
            params.delete(key);
        }
    }
    return `${base}?${params.toString()}`;
}

export function DbErrorLoggerConsole({
    paginatedLogs,
    stats,
    filters,
}: {
    paginatedLogs: PaginatedDbErrorLogsDTO;
    stats: DbErrorLogStatsDTO;
    filters: DbErrorLogFilters;
}) {
    const { rows, total, page, limit, offset } = paginatedLogs;
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const hasPrevious = offset > 0;
    const hasNext = offset + rows.length < total;

    function createPageHref(nextPage: number, nextOffset: number): string {
        return buildHref("/dashboard/db-error-logger", {
            page: String(nextPage),
            limit: String(limit),
            offset: String(nextOffset),
            search: filters.search,
            referenceTable: filters.referenceTable,
            applicationName: filters.applicationName,
            sqlState: filters.sqlState,
            createdAtFrom: filters.createdAtFrom,
            createdAtTo: filters.createdAtTo,
        });
    }

    function handleFilterChange() {
        if (!formRef.current) return;
        const data = new FormData(formRef.current);
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("limit", String(limit));
        params.set("offset", "0");
        for (const [key, value] of data.entries()) {
            const v = value as string;
            if (v.trim()) params.set(key, v);
        }
        router.push(`/dashboard/db-error-logger?${params.toString()}`);
    }

    function formatDate(raw: string | null): string {
        if (!raw) return "—";
        // DB stores datetime as "YYYY-MM-DD HH:MM:SS.mmm" — trim to second precision.
        // Avoid toLocaleString() which differs between server (Node.js) and browser locales.
        return raw.length >= 19 ? raw.slice(0, 19).replace("T", " ") : raw;
    }

    function truncate(str: string | null | undefined, max = 80): string {
        if (!str) return "—";
        return str.length > max ? `${str.slice(0, max)}…` : str;
    }

    return (
        <div className="space-y-8">
            {/* Overview stat cards */}
            <AdminPanel title="Overview" subtitle="db_error_logger · aggregate counts">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Total errors"
                        value={stats.totalCount.toLocaleString()}
                        accent={stats.totalCount > 0}
                    />
                    <StatCard
                        label="Last 24 h"
                        value={stats.last24hCount.toLocaleString()}
                        accent={stats.last24hCount > 0}
                    />
                    <StatCard
                        label="Top reference_table"
                        value={
                            stats.topReferenceTable
                                ? `${stats.topReferenceTable.name} (${stats.topReferenceTable.count})`
                                : "—"
                        }
                    />
                </div>
            </AdminPanel>

            {/* Filters */}
            <AdminPanel
                title="Filters"
                subtitle="All filters preserved across pagination"
            >
                <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                                Search error_message
                            </label>
                            <input
                                name="search"
                                type="text"
                                defaultValue={filters.search ?? ""}
                                placeholder="keyword…"
                                className="mt-2 w-full border bg-background px-3 py-2 font-mono text-[12px] text-foreground outline-none focus:ring-1"
                                style={{ borderColor: "var(--border)" }}
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                                Reference table
                            </label>
                            <select
                                name="referenceTable"
                                defaultValue={filters.referenceTable ?? ""}
                                className="mt-2 w-full border bg-background px-3 py-2 font-mono text-[12px] text-foreground outline-none focus:ring-1"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <option value="">All</option>
                                {stats.distinctReferenceTables.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                                Application name
                            </label>
                            <select
                                name="applicationName"
                                defaultValue={filters.applicationName ?? ""}
                                className="mt-2 w-full border bg-background px-3 py-2 font-mono text-[12px] text-foreground outline-none focus:ring-1"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <option value="">All</option>
                                {stats.distinctApplicationNames.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                                SQL state
                            </label>
                            <select
                                name="sqlState"
                                defaultValue={filters.sqlState ?? ""}
                                className="mt-2 w-full border bg-background px-3 py-2 font-mono text-[12px] text-foreground outline-none focus:ring-1"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <option value="">All</option>
                                {stats.distinctSqlStates.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                                Created at · from
                            </label>
                            <input
                                name="createdAtFrom"
                                type="date"
                                defaultValue={filters.createdAtFrom ?? ""}
                                className="mt-2 w-full border bg-background px-3 py-2 font-mono text-[12px] text-foreground outline-none focus:ring-1"
                                style={{ borderColor: "var(--border)" }}
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                                Created at · to
                            </label>
                            <input
                                name="createdAtTo"
                                type="date"
                                defaultValue={filters.createdAtTo ?? ""}
                                className="mt-2 w-full border bg-background px-3 py-2 font-mono text-[12px] text-foreground outline-none focus:ring-1"
                                style={{ borderColor: "var(--border)" }}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={handleFilterChange}
                            className="border px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
                            style={{
                                borderColor: "var(--accent)",
                                color: "var(--accent)",
                            }}
                        >
                            Apply filters
                        </button>
                        <Link
                            href="/dashboard/db-error-logger"
                            className="theme-button-secondary border px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
                        >
                            Clear
                        </Link>
                    </div>
                </form>
            </AdminPanel>

            {/* Error log table */}
            <AdminPanel
                title="Error log registry"
                subtitle="db_error_logger · ordered by created_at desc"
            >
                {/* Mobile cards */}
                <div className="divide-y md:hidden" style={{ borderColor: "var(--border)" }}>
                    {rows.length === 0 ? (
                        <p className="py-8 text-center font-mono text-[12px] text-(--muted)">
                            No errors found.
                        </p>
                    ) : (
                        rows.map((row) => <MobileErrorCard key={row.id} row={row} />)
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[900px] border-collapse font-mono text-[11px]">
                        <thead>
                            <tr
                                className="border-b text-left text-(--muted)"
                                style={{ borderColor: "var(--border-strong)" }}
                            >
                                <th className="pb-2 pr-4 font-normal uppercase tracking-[0.15em]">
                                    created_at
                                </th>
                                <th className="pb-2 pr-4 font-normal uppercase tracking-[0.15em]">
                                    sql_state
                                </th>
                                <th className="pb-2 pr-4 font-normal uppercase tracking-[0.15em]">
                                    error_message
                                </th>
                                <th className="pb-2 pr-4 font-normal uppercase tracking-[0.15em]">
                                    reference_table
                                </th>
                                <th className="pb-2 pr-4 font-normal uppercase tracking-[0.15em]">
                                    application_name
                                </th>
                                <th className="pb-2 font-normal uppercase tracking-[0.15em]">
                                    errored_by_user
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-8 text-center text-(--muted)"
                                    >
                                        No errors found.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row) => (
                                    <DesktopErrorRow
                                        key={row.id}
                                        row={row}
                                        formatDate={formatDate}
                                        truncate={truncate}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination info */}
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                    db_error_logger · showing {rows.length} of {total} · page {page} ·
                    offset {offset} · limit {limit}
                </p>

                {/* Pagination controls */}
                <div className="mt-4 flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted) sm:flex-row sm:items-center sm:justify-between">
                    <span className="w-full sm:w-auto">
                        {hasPrevious ? (
                            <Link
                                href={createPageHref(
                                    page - 1,
                                    Math.max(offset - limit, 0),
                                )}
                                className="theme-button-secondary inline-block w-full border px-3 py-1.5 text-center font-semibold tracking-[0.2em] transition-colors sm:w-auto"
                            >
                                Previous
                            </Link>
                        ) : (
                            <span className="inline-block w-full border px-3 py-1.5 text-center opacity-50 sm:w-auto">
                                Previous
                            </span>
                        )}
                    </span>
                    <span className="w-full sm:w-auto">
                        {hasNext ? (
                            <Link
                                href={createPageHref(page + 1, offset + limit)}
                                className="theme-button-secondary inline-block w-full border px-3 py-1.5 text-center font-semibold tracking-[0.2em] transition-colors sm:w-auto"
                            >
                                Next
                            </Link>
                        ) : (
                            <span className="inline-block w-full border px-3 py-1.5 text-center opacity-50 sm:w-auto">
                                Next
                            </span>
                        )}
                    </span>
                </div>
            </AdminPanel>
        </div>
    );
}

function MobileErrorCard({ row }: { row: DbErrorLog }) {
    return (
        <article className="space-y-4 py-4">
            <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                    error #{row.id}
                </p>
                <p className="mt-1 font-mono text-[10px] text-(--muted-strong)">
                    {row.createdAt ?? "—"}
                </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="theme-panel-strong border px-3 py-2">
                    <dt className="uppercase tracking-[0.15em] text-(--muted)">
                        sql_state
                    </dt>
                    <dd className="mt-1 text-foreground">{row.sqlState ?? "—"}</dd>
                </div>
                <div className="theme-panel-strong border px-3 py-2">
                    <dt className="uppercase tracking-[0.15em] text-(--muted)">
                        reference_table
                    </dt>
                    <dd className="mt-1 text-foreground">{row.referenceTable ?? "—"}</dd>
                </div>
                <div className="theme-panel-strong col-span-2 border px-3 py-2">
                    <dt className="uppercase tracking-[0.15em] text-(--muted)">
                        error_message
                    </dt>
                    <dd className="mt-1 text-foreground">{row.errorMessage}</dd>
                </div>
                {row.detail ? (
                    <div className="theme-panel-strong col-span-2 border px-3 py-2">
                        <details>
                            <summary className="cursor-pointer uppercase tracking-[0.15em] text-(--muted)">
                                detail
                            </summary>
                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all text-[10px] text-foreground">
                                {row.detail}
                            </pre>
                        </details>
                    </div>
                ) : null}
                {row.failedQuery ? (
                    <div className="theme-panel-strong col-span-2 border px-3 py-2">
                        <details>
                            <summary className="cursor-pointer uppercase tracking-[0.15em] text-(--muted)">
                                failed_query
                            </summary>
                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all text-[10px] text-foreground">
                                {row.failedQuery}
                            </pre>
                        </details>
                    </div>
                ) : null}
            </dl>
        </article>
    );
}

function DesktopErrorRow({
    row,
    formatDate,
    truncate,
}: {
    row: DbErrorLog;
    formatDate: (v: string | null) => string;
    truncate: (v: string | null | undefined, max?: number) => string;
}) {
    return (
        <>
            <tr
                className="border-b text-(--muted-strong)"
                style={{ borderColor: "var(--border)" }}
            >
                <td className="py-2 pr-4 tabular-nums text-(--muted)">
                    {formatDate(row.createdAt)}
                </td>
                <td className="py-2 pr-4">
                    <span
                        className="border px-1.5 py-0.5 text-[10px] uppercase"
                        style={{
                            borderColor:
                                "color-mix(in srgb, var(--danger) 40%, transparent)",
                            color: "var(--danger)",
                        }}
                    >
                        {row.sqlState ?? "—"}
                    </span>
                </td>
                <td className="py-2 pr-4 text-foreground">
                    {row.detail || row.failedQuery ? (
                        <details>
                            <summary className="cursor-pointer">
                                {truncate(row.errorMessage)}
                            </summary>
                            {row.detail ? (
                                <pre className="mt-2 max-w-prose overflow-x-auto whitespace-pre-wrap break-all text-[10px] text-(--muted)">
                                    <span className="font-semibold text-(--muted-strong)">
                                        detail:
                                    </span>
                                    {"\n"}
                                    {row.detail}
                                </pre>
                            ) : null}
                            {row.failedQuery ? (
                                <pre className="mt-2 max-w-prose overflow-x-auto whitespace-pre-wrap break-all text-[10px] text-(--muted)">
                                    <span className="font-semibold text-(--muted-strong)">
                                        failed_query:
                                    </span>
                                    {"\n"}
                                    {row.failedQuery}
                                </pre>
                            ) : null}
                        </details>
                    ) : (
                        truncate(row.errorMessage)
                    )}
                </td>
                <td className="py-2 pr-4">{row.referenceTable ?? "—"}</td>
                <td className="py-2 pr-4">{row.applicationName ?? "—"}</td>
                <td className="py-2">{row.erroredByUser ?? "—"}</td>
            </tr>
        </>
    );
}
