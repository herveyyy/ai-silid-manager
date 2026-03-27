import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPanel } from "@/components/molecules/admin-panel";
import { createRoomsController, createSchoolsController } from "@/app/actions";
import { formatBytes } from "@/lib/admin-mock-data";

export default async function RoomProfilePage({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>;
}) {
  const { id, roomId } = await params;
  const schoolsController = await createSchoolsController();
  const roomsController = await createRoomsController();
  const [schools, rooms] = await Promise.all([
    schoolsController.getAllSchools(),
    roomsController.getSchoolRoomsUsage(id),
  ]);

  const school = schools.find((entry) => entry.id === id);
  if (!school) notFound();

  const room = rooms.find((entry) => entry.id === roomId);
  if (!room) notFound();

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
          schools · rooms · profile
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
          {room.name}
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-(--muted)">
          Room profile inside{" "}
          <span className="text-(--muted-strong)">{school.name}</span> with
          storage, token, participant, and class-card usage.
        </p>
      </div>

      <AdminPanel
        title="Room detail"
        subtitle={`school_code ${school.schoolCode} · room ${room.id}`}
      >
        <dl className="grid gap-3 font-mono text-[12px] sm:grid-cols-2">
          <div
            className="flex justify-between gap-4 border-b py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <dt className="text-(--muted)">room_name</dt>
            <dd className="text-(--muted-strong)">{room.name}</dd>
          </div>
          <div
            className="flex justify-between gap-4 border-b py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <dt className="text-(--muted)">section</dt>
            <dd className="text-(--muted-strong)">
              {room.sectionName
                ? `${room.sectionName}${room.sectionLevel ? ` · ${room.sectionLevel}` : ""}`
                : "—"}
            </dd>
          </div>
          <div
            className="flex justify-between gap-4 border-b py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <dt className="text-(--muted)">created_at</dt>
            <dd className="text-(--muted-strong)">{room.createdAt.slice(0, 10)}</dd>
          </div>
          <div
            className="flex justify-between gap-4 border-b py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <dt className="text-(--muted)">updated_at</dt>
            <dd className="text-(--muted-strong)">{room.updatedAt.slice(0, 10)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2 sm:col-span-2">
            <dt className="text-(--muted)">id</dt>
            <dd className="break-all text-right text-[10px] text-(--muted)">
              {room.id}
            </dd>
          </div>
        </dl>
      </AdminPanel>

      <AdminPanel
        title="Usage snapshot"
        subtitle="Live aggregates from attachments, prompt, participants, and class_card"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Storage
            </p>
            <p className="mt-1 font-mono text-xl tabular-nums text-foreground">
              {formatBytes(Number(room.storageUsedBytes ?? 0))}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Tokens
            </p>
            <p className="mt-1 font-mono text-xl tabular-nums text-foreground">
              {Number(room.tokensUsed ?? 0).toLocaleString()}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Prompt runs
            </p>
            <p className="mt-1 font-mono text-xl tabular-nums text-foreground">
              {Number(room.promptRuns ?? 0).toLocaleString()}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Participants
            </p>
            <p className="mt-1 font-mono text-xl tabular-nums text-foreground">
              {Number(room.participantCount ?? 0).toLocaleString()}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Class cards
            </p>
            <p className="mt-1 font-mono text-xl tabular-nums text-foreground">
              {Number(room.classCardCount ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
      </AdminPanel>

      <div className="flex flex-wrap gap-6 font-mono text-[11px]">
        <Link
          href={`/dashboard/schools/${school.id}`}
          className="theme-link text-(--muted-strong) underline underline-offset-2"
        >
          ← School profile
        </Link>
        <Link
          href="/dashboard/schools"
          className="theme-link text-(--muted-strong) underline underline-offset-2"
        >
          School list
        </Link>
      </div>
    </div>
  );
}
