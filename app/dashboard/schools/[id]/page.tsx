import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPanel } from "@/components/molecules/admin-panel";
import { SchoolProfileSettings } from "@/components/organisms/school-profile-settings";
import { SchoolRoomsTable } from "@/components/organisms/school-rooms-table";
import {
  createAiModelsController,
  createAiPromptsController,
  createRoomsController,
  createSchoolsController,
} from "@/app/actions";

export default async function SchoolProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; offset?: string; limit?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  function parsePositiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  const page = parsePositiveInt(resolvedSearchParams.page, 1);
  const limit = parsePositiveInt(resolvedSearchParams.limit, 10);
  const offset = parsePositiveInt(resolvedSearchParams.offset, 0);
  const schoolsController = await createSchoolsController();
  const aiModelsController = await createAiModelsController();
  const aiPromptsController = await createAiPromptsController();
  const roomsController = await createRoomsController();
  const [schools, report, aiModels, promptLogs, paginatedRooms] = await Promise.all([
    schoolsController.getAllSchools(),
    schoolsController.getSchoolsUsageView(),
    aiModelsController.getAiModels(),
    aiPromptsController.getSchoolAIPrompts(id),
    roomsController.getSchoolRoomsUsage(id, page, offset, limit),
  ]);

  const school = schools.find((entry) => entry.id === id);
  if (!school) notFound();

  const schoolReport = report.find((entry) => entry.id === school.id);
  const metrics = {
    storageUsedBytes: Number(schoolReport?.storageUsedBytes ?? 0),
    tokensUsed: Number(schoolReport?.tokensUsed ?? 0),
    quotaStorageBytes: Number(school.storageLimit ?? 0),
    quotaTokens: Number(school.tokenLimit ?? 0),
  };
  const totalPromptTokens = promptLogs.reduce(
    (total, row) => total + (row.tokenAiValue ?? 0),
    0,
  );
  const totalPromptCredits = promptLogs.reduce(
    (total, row) => total + (row.creditsSpent ?? 0),
    0,
  );

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
          plus usage totals and admin quotas for storage and AI tokens.
        </p>
      </div>

      <AdminPanel
        title="School detail"
        subtitle={`school_code ${school.schoolCode} · ${school.id}`}
      >
        <SchoolProfileSettings school={school} metrics={metrics} aiModels={aiModels} />
      </AdminPanel>

      <AdminPanel
        title="School rooms"
        subtitle="Classrooms with storage, token, and participant usage"
      >
        <SchoolRoomsTable schoolId={school.id} paginatedRooms={paginatedRooms} />
      </AdminPanel>

      <AdminPanel
        title="School AI activity"
        subtitle="Recent prompt logs scoped to this school"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Prompt runs
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {promptLogs.length}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Tokens used
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {totalPromptTokens.toLocaleString()}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Credits spent
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {totalPromptCredits.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y md:hidden" style={{ borderColor: "var(--border)" }}>
          {promptLogs.slice(0, 12).map((row) => (
            <article key={row.id} className="space-y-4 py-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-(--muted)">
                  prompt
                </p>
                <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                  {row.featType}
                </h3>
                <p className="mt-1 uppercase text-(--muted-strong)">{row.status}</p>
              </div>
              <dl className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="theme-panel-strong border px-3 py-2">
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    ai_model_name
                  </dt>
                  <dd className="mt-1 text-foreground">{row.aiModelName ?? "—"}</dd>
                </div>
                <div className="theme-panel-strong border px-3 py-2">
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    created_at
                  </dt>
                  <dd className="mt-1 text-(--muted)">
                    {row.createdAt?.slice(0, 19).replace("T", " ") ?? "—"}
                  </dd>
                </div>
                <div className="theme-panel-strong border px-3 py-2">
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    token_ai_value
                  </dt>
                  <dd className="mt-1 tabular-nums text-foreground">
                    {(row.tokenAiValue ?? 0).toLocaleString()}
                  </dd>
                </div>
                <div className="theme-panel-strong border px-3 py-2">
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    credits_spent
                  </dt>
                  <dd className="mt-1 tabular-nums text-foreground">
                    {(row.creditsSpent ?? 0).toLocaleString()}
                  </dd>
                </div>
                <div className="theme-panel-strong border px-3 py-2 col-span-2">
                  <dt className="uppercase tracking-[0.15em] text-(--muted)">
                    prompt_title
                  </dt>
                  <dd className="mt-1 wrap-break-word text-foreground">
                    {row.promptTitle ?? "—"}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-6 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[920px] border-collapse font-mono text-[11px]">
            <thead>
              <tr
                className="border-b text-left text-(--muted)"
                style={{ borderColor: "var(--border-strong)" }}
              >
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  feat_type
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  status
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  ai_model_name
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  token_ai_value
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  credits_spent
                </th>
                <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                  prompt_title
                </th>
                <th className="pb-2 font-normal uppercase tracking-[0.12em]">
                  created_at
                </th>
              </tr>
            </thead>
            <tbody>
              {promptLogs.slice(0, 12).map((row) => (
                <tr
                  key={row.id}
                  className="border-b align-top text-(--muted-strong)"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="py-2 pr-3 text-foreground">{row.featType}</td>
                  <td className="py-2 pr-3 uppercase">{row.status}</td>
                  <td className="py-2 pr-3">{row.aiModelName ?? "—"}</td>
                  <td className="py-2 pr-3 tabular-nums">
                    {(row.tokenAiValue ?? 0).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    {(row.creditsSpent ?? 0).toLocaleString()}
                  </td>
                  <td
                    className="max-w-[180px] truncate py-2 pr-3"
                    title={row.promptTitle ?? ""}
                  >
                    {row.promptTitle ?? "—"}
                  </td>
                  <td className="py-2 text-(--muted)">
                    {row.createdAt?.slice(0, 19).replace("T", " ") ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {promptLogs.length === 0 ? (
          <p className="mt-4 font-mono text-[12px] text-(--muted)">
            No AI prompt activity found for this school yet.
          </p>
        ) : null}
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
