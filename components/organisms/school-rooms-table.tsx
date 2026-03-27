"use client";

import Link from "next/link";
import type { PaginatedRoomUsageDTO } from "@/lib/types/admin-types";
import { formatBytes } from "@/lib/admin-mock-data";

function shortId(id: string): string {
  return `${id.slice(0, 8)}…`;
}

export function SchoolRoomsTable({
  schoolId,
  paginatedRooms,
}: {
  schoolId: string;
  paginatedRooms: PaginatedRoomUsageDTO;
}) {
  const { rows: rooms, total, page, limit, offset } = paginatedRooms;
  const hasPrevious = offset > 0;
  const hasNext = offset + rooms.length < total;

  function createPageHref(nextPage: number, nextOffset: number): string {
    const params = new URLSearchParams({
      page: String(nextPage),
      offset: String(nextOffset),
      limit: String(limit),
    });

    return `/dashboard/schools/${schoolId}?${params.toString()}`;
  }

  return (
    <div className="theme-panel border">
      <div className="divide-y md:hidden" style={{ borderColor: "var(--border)" }}>
        {rooms.map((room) => (
          <article key={room.id} className="space-y-4 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                  room
                </p>
                <h3 className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                  {room.name}
                </h3>
                <p className="mt-1 text-[11px] text-(--muted)">
                  {room.sectionName
                    ? `${room.sectionName}${room.sectionLevel ? ` · ${room.sectionLevel}` : ""}`
                    : "—"}
                </p>
              </div>
              <Link
                href={`/dashboard/schools/${schoolId}/rooms/${room.id}`}
                className="theme-button-secondary shrink-0 border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
              >
                Profile
              </Link>
            </div>

            <dl className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="theme-panel-strong border px-3 py-2">
                <dt className="uppercase tracking-[0.15em] text-(--muted)">
                  class_cards
                </dt>
                <dd className="mt-1 tabular-nums text-foreground">
                  {room.classCardCount}
                </dd>
              </div>
              <div className="theme-panel-strong border px-3 py-2">
                <dt className="uppercase tracking-[0.15em] text-(--muted)">
                  participants
                </dt>
                <dd className="mt-1 tabular-nums text-foreground">
                  {room.participantCount}
                </dd>
              </div>
              <div className="theme-panel-strong border px-3 py-2">
                <dt className="uppercase tracking-[0.15em] text-(--muted)">
                  storage
                </dt>
                <dd className="mt-1 tabular-nums text-foreground">
                  {formatBytes(Number(room.storageUsedBytes ?? 0))}
                </dd>
              </div>
              <div className="theme-panel-strong border px-3 py-2">
                <dt className="uppercase tracking-[0.15em] text-(--muted)">
                  tokens
                </dt>
                <dd className="mt-1 tabular-nums text-foreground">
                  {Number(room.tokensUsed ?? 0).toLocaleString()}
                </dd>
              </div>
              <div className="theme-panel-strong border px-3 py-2 col-span-2">
                <dt className="uppercase tracking-[0.15em] text-(--muted)">
                  prompt_runs
                </dt>
                <dd className="mt-1 tabular-nums text-foreground">
                  {Number(room.promptRuns ?? 0).toLocaleString()}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                  id
                </dt>
                <dd className="mt-1 break-all font-mono text-[10px] text-(--muted-strong)">
                  {room.id}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1080px] border-collapse font-mono text-[11px]">
          <thead>
            <tr
              className="theme-panel-strong border-b text-left text-(--muted)"
              style={{ borderColor: "var(--border-strong)" }}
            >
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                room
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                section
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                class_cards
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                participants
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                storage
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                tokens
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                prompt_runs
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                id
              </th>
              <th className="px-4 py-3 font-normal uppercase tracking-[0.15em]">
                -
              </th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="theme-table-row border-b text-(--muted-strong) transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-4 py-3 font-medium text-foreground">{room.name}</td>
                <td className="px-4 py-3 text-(--muted)">
                  {room.sectionName
                    ? `${room.sectionName}${room.sectionLevel ? ` · ${room.sectionLevel}` : ""}`
                    : "—"}
                </td>
                <td className="px-4 py-3 tabular-nums">{room.classCardCount}</td>
                <td className="px-4 py-3 tabular-nums">{room.participantCount}</td>
                <td className="px-4 py-3 tabular-nums">
                  {formatBytes(Number(room.storageUsedBytes ?? 0))}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {Number(room.tokensUsed ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {Number(room.promptRuns ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-(--muted)" title={room.id}>
                  {shortId(room.id)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/schools/${schoolId}/rooms/${room.id}`}
                    className="theme-button-secondary inline-block border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
                  >
                    Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        className="border-t px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)"
        style={{ borderColor: "var(--border)" }}
      >
        rooms · live classroom usage report · showing {rooms.length} of {total} ·
        {" "}page {page} · offset {offset} · limit {limit}
      </p>
      <div
        className="flex flex-col gap-3 border-t px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted) sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="w-full sm:w-auto">
          {hasPrevious ? (
            <Link
              href={createPageHref(page - 1, Math.max(offset - limit, 0))}
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
    </div>
  );
}
