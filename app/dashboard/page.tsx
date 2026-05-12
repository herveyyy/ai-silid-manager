import Link from "next/link";
import { SchoolsDirectory } from "@/components/organisms/schools-directory";
import { SchoolsFleetAiOverview } from "@/components/organisms/schools-fleet-ai-overview";
import { StorageOverview } from "@/components/organisms/storage-overview";
import { AdminPanel } from "@/components/molecules/admin-panel";
import { AdminStatCard } from "@/components/molecules/admin-stat-card";
import { totalAttachmentBytes } from "@/lib/admin-mock-data";
import {
  getDashboardSchools,
  getDashboardSchoolsUsage,
  getDashboardPromptOverview,
  getDashboardAttachments,
  getDashboardUserOverview,
} from "@/app/dashboard/actions";

export default async function DashboardPage() {
  const [schools, promptOverview, attachmentRows, userOverview, schoolsUsage] =
    await Promise.all([
      getDashboardSchools(undefined, "cached"),
      getDashboardPromptOverview(undefined, "cached"),
      getDashboardAttachments(undefined, "cached"),
      getDashboardUserOverview(undefined, "cached"),
      getDashboardSchoolsUsage(undefined, "cached"),
    ]);

  const activeAttachments = attachmentRows.filter(
    (a) => (a.isDeleted ?? 0) === 0,
  );
  const deletedAttachments = attachmentRows.filter(
    (a) => (a.isDeleted ?? 0) !== 0,
  ).length;
  const storageUsedBytes = totalAttachmentBytes(activeAttachments);
  const schoolCount = schools.length;
  const schoolsWithAiEnabled = schools.filter((s) => s.aiFeat).length;

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
          silid · admin overview
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
          Fleet console
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-(--muted)">
          Cross-tenant summaries aligned with{" "}
          <span className="text-(--muted-strong)">prompt</span>,{" "}
          <span className="text-(--muted-strong)">attachments</span>, and{" "}
          <span className="text-(--muted-strong)">users</span> (see drizzle
          schema). School registry follows below.
        </p>
      </header>

      <section
        id="prompt-overview"
        className="scroll-mt-24 space-y-4"
        aria-labelledby="prompt-overview-heading"
      >
        <AdminPanel
          title="Prompt overview"
          subtitle="Table `prompt` — tokens, credits, status, cost_value; fleet-wide"
        >
          <h2 id="prompt-overview-heading" className="sr-only">
            Prompt overview
          </h2>
          <SchoolsFleetAiOverview
            schoolsInFleet={schoolCount}
            schoolsWithAiEnabled={schoolsWithAiEnabled}
            {...promptOverview}
          />
        </AdminPanel>
      </section>

      <section
        id="storage-overview"
        className="scroll-mt-24 space-y-4"
        aria-labelledby="storage-overview-heading"
      >
        <StorageOverview
          attachmentRowsCount={attachmentRows.length}
          activeAttachmentsCount={activeAttachments.length}
          deletedAttachmentsCount={deletedAttachments}
          storedBytesActive={storageUsedBytes}
          schoolsUsage={schoolsUsage}
        />
      </section>

      <section
        id="user-overview"
        className="scroll-mt-24 space-y-4"
        aria-labelledby="user-overview-heading"
      >
        <AdminPanel
          title="User overview"
          subtitle="Table `users` — role enum: student · teacher · admin · partner"
        >
          <h2 id="user-overview-heading" className="sr-only">
            User overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <AdminStatCard
              label="Total users"
              value={userOverview.totalUsers.toLocaleString()}
            />
            <AdminStatCard
              label="Students"
              value={userOverview.byRole.student.toLocaleString()}
            />
            <AdminStatCard
              label="Teachers"
              value={userOverview.byRole.teacher.toLocaleString()}
            />
            <AdminStatCard
              label="Admins"
              value={userOverview.byRole.admin.toLocaleString()}
            />
            <AdminStatCard
              label="Partners"
              value={userOverview.byRole.partner.toLocaleString()}
            />
          </div>
        </AdminPanel>
      </section>

      <section className="space-y-4">
        <AdminPanel
          title="School directory"
          subtitle="Table `schools` — live query via controller"
        >
          <SchoolsDirectory schools={schools} />
        </AdminPanel>
      </section>

      <AdminPanel title="Shortcuts" subtitle="Per-school settings & tools">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/dashboard/schools"
            className="theme-button-secondary border px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors"
          >
            School list & profiles
          </Link>
          <Link
            href="/dashboard/storage"
            className="theme-button-secondary border px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors"
          >
            Storage
          </Link>
          <Link
            href="/dashboard/ai"
            className="theme-button-secondary border px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors"
          >
            AI
          </Link>
        </div>
        <p className="mt-4 font-mono text-[10px] leading-relaxed text-(--muted)">
          Per-school quotas (storage & tokens) are editable under each school
          profile.
        </p>
      </AdminPanel>
    </div>
  );
}
