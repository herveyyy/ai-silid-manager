
import Link from "next/link";
import { AdminPanel } from "@/components/molecules/admin-panel";
import { SchoolsFleetTable } from "@/components/organisms/schools-fleet-table";
import { createSchoolsController } from "@/app/actions";

export default async function SchoolsListPage() {
  const schoolsController = await createSchoolsController();
  const report = await schoolsController.getSchoolsUsageView();
  const uniqueReport = Array.from(
    new Map(report.map((school) => [school.id, school])).values(),
  );

  const rows = uniqueReport.map((school) => ({
    school: {
      id: school.id,
      name: school.name,
      schoolCode: school.schoolCode,
      username: null,
      site: school.site,
      createdAt: "",
      updatedAt: "",
      aiFeat: school.aiFeat,
      unlimitedStorage: school.unlimitedStorage,
      unlimitedToken: school.unlimitedToken,
      tokenLimit: school.tokenLimit,
      storageLimit: school.storageLimit,
    },
    metrics: {
      storageUsedBytes: Number(school.storageUsedBytes ?? 0),
      tokensUsed: Number(school.tokensUsed ?? 0),
      quotaStorageBytes: Number(school.storageLimit ?? 0),
      quotaTokens: Number(school.tokenLimit ?? 0),
    },
  }));

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
          schools · fleet
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
          School list
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-(--muted)">
          Browse every tenant, review the school usage report, compare storage
          and AI token usage against quotas, and open a school profile to edit{" "}
          <span className="text-(--muted-strong)">Total storage</span> and{" "}
          <span className="text-(--muted-strong)">Total tokens</span>.
        </p>
      </div>

      <AdminPanel
        title="All schools"
        subtitle="Usage report by school · limits from schools table"
      >
        <SchoolsFleetTable rows={rows} />
      </AdminPanel>

      <p className="font-mono text-[11px] text-(--muted)">
        <Link
          href="/dashboard"
          className="theme-link text-(--muted-strong) underline underline-offset-2"
        >
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
