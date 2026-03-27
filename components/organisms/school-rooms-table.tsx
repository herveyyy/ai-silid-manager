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
    <div className="theme-panel overflow-x-auto border">
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
      <p
        className="border-t px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)"
        style={{ borderColor: "var(--border)" }}
      >
        rooms · live classroom usage report · showing {rooms.length} of {total} ·
        {" "}page {page} · offset {offset} · limit {limit}
      </p>
      <div
        className="flex items-center justify-between gap-3 border-t px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)"
        style={{ borderColor: "var(--border)" }}
      >
        <span>
          {hasPrevious ? (
            <Link
              href={createPageHref(page - 1, Math.max(offset - limit, 0))}
              className="theme-button-secondary inline-block border px-3 py-1.5 font-semibold tracking-[0.2em] transition-colors"
            >
              Previous
            </Link>
          ) : (
            <span className="inline-block border px-3 py-1.5 opacity-50">
              Previous
            </span>
          )}
        </span>
        <span>
          {hasNext ? (
            <Link
              href={createPageHref(page + 1, offset + limit)}
              className="theme-button-secondary inline-block border px-3 py-1.5 font-semibold tracking-[0.2em] transition-colors"
            >
              Next
            </Link>
          ) : (
            <span className="inline-block border px-3 py-1.5 opacity-50">
              Next
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
