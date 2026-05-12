import Link from "next/link";
import { AdminPanel } from "@/components/molecules/admin-panel";
import { AddSchoolModal } from "@/components/organisms/add-school-modal";
import { SchoolsFleetTable } from "@/components/organisms/schools-fleet-table";
import { getSchoolsPaginatedUsage } from "@/app/dashboard/schools/queries";
import { storageLimitMbToBytes } from "@/lib/storage.utils";

export default async function SchoolsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; offset?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  function parsePositiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function parseNonNegativeInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }

  const page = parsePositiveInt(resolvedSearchParams.page, 1);
  const limit = parsePositiveInt(resolvedSearchParams.limit, 10);
  const offset = parseNonNegativeInt(resolvedSearchParams.offset, 0);
  const paginatedReport = await getSchoolsPaginatedUsage(
    { page, offset, limit },
    "cached",
  );
  const uniqueRows = Array.from(
    new Map(paginatedReport.rows.map((school) => [school.id, school])).values(),
  );

  const rows = uniqueRows.map((school) => ({
    school: {
      id: school.id,
      name: school.name,
      schoolCode: school.schoolCode,
      username: null,
      site: school.site,
      createdAt: "",
      updatedAt: "",
      secret: null,
      apiKey: null,
      passwordCredentialSet: false,
      defaultAiModelId: null,
      aiFeat: school.aiFeat,
      unlimitedStorage: school.unlimitedStorage,
      unlimitedToken: school.unlimitedToken,
      tokenLimit: Number(school.tokenLimit ?? 0),
      storageLimit: Number(school.storageLimit ?? 0),
    },
    metrics: {
      storageUsedBytes: Number(school.storageUsedBytes ?? 0),
      tokensUsed: Number(school.tokensUsed ?? 0),
      quotaStorageBytes: storageLimitMbToBytes(
        Number(school.storageLimit ?? 0),
      ),
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
        <AddSchoolModal />
        <SchoolsFleetTable rows={rows} paginatedSchools={paginatedReport} />
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
