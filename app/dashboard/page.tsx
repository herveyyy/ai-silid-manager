
import Link from "next/link";
import { SchoolsDirectory } from "@/components/organisms/schools-directory";
import { SchoolsFleetAiOverview } from "@/components/organisms/schools-fleet-ai-overview";
import { AdminPanel } from "@/components/molecules/admin-panel";
import { AdminStatCard } from "@/components/molecules/admin-stat-card";
import {
  formatBytes,
  mockAttachments,
  mockPromptLogs,
  totalAttachmentBytes,
} from "@/lib/admin-mock-data";
import {
  createAiPromptsController,
  createSchoolsController,
} from "@/app/actions";

export default async function DashboardPage() {
  const schoolsController = await createSchoolsController();
  const aiPromptsController = await createAiPromptsController();
  const [schools, promptOverview] = await Promise.all([
    schoolsController.getAllSchools(),
    aiPromptsController.getGlobalPromptOverview(),
  ]);
  const storageUsed = totalAttachmentBytes(
    mockAttachments.filter((a) => !a.isDeleted),
  );
  const aiTokens = mockPromptLogs.reduce((a, r) => a + (r.tokenAiValue ?? 0), 0);
  const aiCredits = mockPromptLogs.reduce((a, r) => a + (r.creditsSpent ?? 0), 0);
  const schoolCount = schools.length;
  const schoolsWithAiEnabled = schools.filter((s) => s.aiFeat).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
          schools · fleet registry
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
          All schools
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-(--muted)">
          Admin view over every row in{" "}
          <span className="text-(--muted-strong)">schools</span> from the
          database via the schools controller.
        </p>
      </div>

      <AdminPanel
        title="Fleet AI overview"
        subtitle="All tenants · totals and rates from the prompt table (cross-school)"
      >
        <SchoolsFleetAiOverview
          schoolsInFleet={schoolCount}
          schoolsWithAiEnabled={schoolsWithAiEnabled}
          {...promptOverview}
        />
      </AdminPanel>

      <AdminPanel
        title="School directory"
        subtitle="Live schools query via controller → service → usecase"
      >
        <SchoolsDirectory schools={schools} />
      </AdminPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Platform snapshot" subtitle="Mock aggregates (not per school yet)">
          <ul className="space-y-3 font-mono text-[12px] text-(--muted-strong)">
            <li className="flex justify-between border-b py-2" style={{ borderColor: "var(--border)" }}>
              <span className="text-(--muted)">attachments rows (mock)</span>
              <span className="text-foreground">{mockAttachments.length}</span>
            </li>
            <li className="flex justify-between py-2">
              <span className="text-(--muted)">prompt rows (mock)</span>
              <span className="text-foreground">{mockPromptLogs.length}</span>
            </li>
          </ul>
        </AdminPanel>

        <AdminPanel title="Shortcuts" subtitle="Cross-cutting views">
          <div className="flex flex-col gap-3">
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
            profile; usage remains mock until API wiring.
          </p>
        </AdminPanel>
      </div>
    </div>
  );
}
