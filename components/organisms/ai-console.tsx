"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminPanel } from "@/components/molecules/admin-panel";
import { createAiModelAction, updateAiModelAction } from "@/app/dashboard/ai/actions";
import type {
  AiModelDTO,
  AiModelMutationInput,
  PromptLog,
} from "@/lib/types/admin-types";

const STATUS_OPTIONS = ["active", "inactive", "deprecated"] as const;

function buildDraft(model: AiModelDTO): AiModelMutationInput {
  return {
    name: model.name,
    description: model.description,
    status: model.status,
  };
}

export type AiConsoleProps = {
  promptLogs: PromptLog[];
  aiModels: AiModelDTO[];
};

export function AiConsole({
  promptLogs,
  aiModels,
}: AiConsoleProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [featFilter, setFeatFilter] = useState<string>("all");
  const [newModelName, setNewModelName] = useState("");
  const [newModelDescription, setNewModelDescription] = useState("");
  const [newModelStatus, setNewModelStatus] =
    useState<(typeof STATUS_OPTIONS)[number]>("active");
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [updateMessages, setUpdateMessages] = useState<Record<string, string>>(
    {},
  );
  const [drafts, setDrafts] = useState<Record<string, AiModelMutationInput>>(
    () =>
      Object.fromEntries(aiModels.map((model) => [model.id, buildDraft(model)])),
  );
  const [isCreatePending, startCreateTransition] = useTransition();
  const [isUpdatePending, startUpdateTransition] = useTransition();

  const rows = promptLogs;

  useEffect(() => {
    setDrafts(
      Object.fromEntries(aiModels.map((model) => [model.id, buildDraft(model)])),
    );
  }, [aiModels]);

  const featTypes = useMemo(
    () => Array.from(new Set(rows.map((r) => r.featType))).sort(),
    [rows],
  );
  const statuses = useMemo(
    () => Array.from(new Set(rows.map((r) => r.status))).sort(),
    [rows],
  );

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (featFilter !== "all" && r.featType !== featFilter) return false;
    return true;
  });

  const totalTokens = rows.reduce((a, r) => a + (r.tokenAiValue ?? 0), 0);
  const totalCredits = rows.reduce((a, r) => a + (r.creditsSpent ?? 0), 0);
  const byModel = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const r of rows) {
      const name = r.aiModelName ?? "unknown";
      grouped[name] = (grouped[name] ?? 0) + (r.tokenAiValue ?? 0);
    }
    return grouped;
  }, [rows]);

  const totalModels = aiModels.length;
  const activeModels = aiModels.filter((model) => model.status === "active").length;

  function updateDraft(
    modelId: string,
    key: keyof AiModelMutationInput,
    value: string | null,
  ) {
    setDrafts((current) => ({
      ...current,
      [modelId]: {
        ...current[modelId],
        [key]: value,
      },
    }));
  }

  function handleCreateModel() {
    setCreateMessage(null);
    startCreateTransition(async () => {
      const result = await createAiModelAction({
        name: newModelName,
        description: newModelDescription,
        status: newModelStatus,
      });

      setCreateMessage(result.message);
      if (!result.success) return;

      setNewModelName("");
      setNewModelDescription("");
      setNewModelStatus("active");
      router.refresh();
    });
  }

  function handleUpdateModel(modelId: string) {
    const draft = drafts[modelId];
    if (!draft) return;

    setUpdateMessages((current) => ({ ...current, [modelId]: "" }));
    startUpdateTransition(async () => {
      const result = await updateAiModelAction(modelId, draft);
      setUpdateMessages((current) => ({
        ...current,
        [modelId]: result.message,
      }));

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-8">
      <AdminPanel
        title="AI usage summary"
        subtitle="prompt · token_ai_value, credits_spent, ai_model_name"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Tokens (sum)
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {totalTokens.toLocaleString()}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Credits (sum)
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {totalCredits.toLocaleString()}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Runs
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {rows.length}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Models
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {totalModels}
            </p>
          </div>
          <div className="theme-panel-strong border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Models active
            </p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">
              {activeModels}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
            Tokens by ai_model_name
          </p>
          <ul className="mt-2 space-y-1 font-mono text-[12px] text-(--muted-strong)">
            {Object.entries(byModel)
              .sort((a, b) => b[1] - a[1])
              .map(([model, n]) => (
                <li
                  key={model}
                  className="flex justify-between border-b py-1"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span>{model}</span>
                  <span className="tabular-nums text-foreground">
                    {n.toLocaleString()}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </AdminPanel>

      <AdminPanel
        title="AI models"
        subtitle="Manage ai_models entries used by schools and prompts"
      >
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="theme-panel border p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
              Add model
            </p>
            <div className="mt-4 space-y-4">
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                Name
                <input
                  type="text"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                  placeholder="gpt-4.1-mini"
                />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                Description
                <textarea
                  value={newModelDescription}
                  onChange={(e) => setNewModelDescription(e.target.value)}
                  className="theme-input mt-2 min-h-28 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                  placeholder="Default fast general-purpose model"
                />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                Status
                <select
                  value={newModelStatus}
                  onChange={(e) =>
                    setNewModelStatus(
                      e.target.value as (typeof STATUS_OPTIONS)[number],
                    )
                  }
                  className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={handleCreateModel}
                disabled={isCreatePending}
                className="theme-button w-full border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors"
              >
                {isCreatePending ? "Creating..." : "Create model"}
              </button>
              {createMessage ? (
                <p
                  className={`font-mono text-[11px] ${
                    createMessage.includes("Failed") ||
                    createMessage.includes("required")
                      ? "text-(--danger)"
                      : "text-(--success)"
                  }`}
                >
                  {createMessage}
                </p>
              ) : null}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse font-mono text-[11px]">
              <thead>
                <tr
                  className="border-b text-left text-(--muted)"
                  style={{ borderColor: "var(--border-strong)" }}
                >
                  <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                    name
                  </th>
                  <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                    description
                  </th>
                  <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                    status
                  </th>
                  <th className="pb-2 pr-3 font-normal uppercase tracking-[0.12em]">
                    updated_at
                  </th>
                  <th className="pb-2 font-normal uppercase tracking-[0.12em]">
                    manage
                  </th>
                </tr>
              </thead>
              <tbody>
                {aiModels.map((model) => {
                  const draft = drafts[model.id] ?? buildDraft(model);
                  const message = updateMessages[model.id];

                  return (
                    <tr
                      key={model.id}
                      className="border-b align-top text-(--muted-strong)"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="py-3 pr-3">
                        <input
                          type="text"
                          value={draft.name}
                          onChange={(e) =>
                            updateDraft(model.id, "name", e.target.value)
                          }
                          className="theme-input w-full border px-3 py-2 font-mono text-[12px] outline-none"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <textarea
                          value={draft.description ?? ""}
                          onChange={(e) =>
                            updateDraft(model.id, "description", e.target.value)
                          }
                          className="theme-input min-h-24 w-full border px-3 py-2 font-mono text-[12px] outline-none"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <select
                          value={draft.status}
                          onChange={(e) =>
                            updateDraft(model.id, "status", e.target.value)
                          }
                          className="theme-input w-full border px-3 py-2 font-mono text-[12px] outline-none"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-3 text-(--muted)">
                        {model.updatedAt.slice(0, 19).replace("T", " ")}
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => handleUpdateModel(model.id)}
                          disabled={isUpdatePending}
                          className="theme-button-secondary border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors"
                        >
                          {isUpdatePending ? "Saving..." : "Save"}
                        </button>
                        {message ? (
                          <p
                            className={`mt-2 max-w-32 font-mono text-[10px] ${
                              message.includes("Failed") ||
                              message.includes("Invalid") ||
                              message.includes("not found")
                                ? "text-(--danger)"
                                : "text-(--success)"
                            }`}
                          >
                            {message}
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {aiModels.length === 0 ? (
              <p className="mt-4 font-mono text-[12px] text-(--muted)">
                No AI models found yet.
              </p>
            ) : null}
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Filters" subtitle="Client-side · live prompt rows">
        <div className="flex flex-wrap gap-6">
          <label className="font-mono text-[11px]">
            <span className="block uppercase tracking-[0.15em] text-(--muted)">
              status
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="theme-input mt-2 border px-3 py-2"
            >
              <option value="all">all</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="font-mono text-[11px]">
            <span className="block uppercase tracking-[0.15em] text-(--muted)">
              feat_type
            </span>
            <select
              value={featFilter}
              onChange={(e) => setFeatFilter(e.target.value)}
              className="theme-input mt-2 border px-3 py-2"
            >
              <option value="all">all</option>
              {featTypes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </AdminPanel>

      <AdminPanel title="Prompt log" subtitle="prompt table columns">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse font-mono text-[11px]">
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
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b align-top text-(--muted-strong)"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="py-2 pr-3 text-foreground">{r.featType}</td>
                  <td className="py-2 pr-3 uppercase">{r.status}</td>
                  <td className="py-2 pr-3">{r.aiModelName ?? "—"}</td>
                  <td className="py-2 pr-3 tabular-nums">
                    {(r.tokenAiValue ?? 0).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    {(r.creditsSpent ?? 0).toLocaleString()}
                  </td>
                  <td
                    className="max-w-[140px] truncate py-2 pr-3"
                    title={r.promptTitle ?? ""}
                  >
                    {r.promptTitle ?? "—"}
                  </td>
                  <td className="py-2 text-(--muted)">
                    {r.createdAt?.slice(0, 19).replace("T", " ") ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="mt-4 font-mono text-[12px] text-(--muted)">
            No rows match filters.
          </p>
        ) : null}
      </AdminPanel>
    </div>
  );
}
