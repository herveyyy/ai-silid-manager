import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPanel } from "@/components/molecules/admin-panel";
import { SchoolProfileSettings } from "@/components/organisms/school-profile-settings";
import {
  getDefaultSchoolMetrics,
  getSchoolById,
} from "@/lib/admin-mock-data";

export default async function SchoolProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const school = getSchoolById(id);
  if (!school) notFound();

  const metrics = getDefaultSchoolMetrics(school.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--muted)">
          schools · profile
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em] text-foreground">
          {school.name}
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-[12px] leading-relaxed text-(--muted)">
          Registry fields from <span className="text-(--muted-strong)">schools</span>,
          plus admin quotas for storage and AI tokens.
        </p>
      </div>

      <AdminPanel
        title="School detail"
        subtitle={`school_code ${school.schoolCode} · ${school.id}`}
      >
        <SchoolProfileSettings school={school} metrics={metrics} />
      </AdminPanel>

      <div className="flex flex-wrap gap-6 font-mono text-[11px]">
        <Link
          href="/dashboard/schools"
          className="theme-link text-(--muted-strong) underline underline-offset-2"
        >
          ← School list
        </Link>
        <Link
          href="/dashboard"
          className="theme-link text-(--muted-strong) underline underline-offset-2"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
