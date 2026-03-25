
import Link from "next/link";
import { AdminPanel } from "@/components/molecules/admin-panel";
import { SchoolsFleetTable } from "@/components/organisms/schools-fleet-table";
import {
  getDefaultSchoolMetrics,
  mockSchools,
} from "@/lib/admin-mock-data";

export default function SchoolsListPage() {
  const rows = mockSchools.map((school) => ({
    school,
    metrics: getDefaultSchoolMetrics(school.id),
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
          Browse every tenant, compare storage and AI token usage against
          quotas, and open a school profile to edit{" "}
          <span className="text-(--muted-strong)">Total storage</span> and{" "}
          <span className="text-(--muted-strong)">Total tokens</span>.
        </p>
      </div>

      <AdminPanel
        title="All schools"
        subtitle="Used / quota · mock usage; quota edits persist locally"
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
