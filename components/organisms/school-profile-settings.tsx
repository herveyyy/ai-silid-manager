"use client";

import { useCallback, useEffect, useState } from "react";
import type { SchoolAdminMetrics, SchoolDTO } from "@/lib/types/admin-types";
import {
  readSchoolConfigOverride,
  writeSchoolConfigOverride,
} from "@/lib/school-config-storage";
import {
  readQuotaOverride,
  writeQuotaOverride,
} from "@/lib/school-quota-storage";
import { formatBytes } from "@/lib/admin-mock-data";

function bytesToGb(n: number): string {
  return (n / (1024 * 1024 * 1024)).toFixed(2);
}

function parseGbInput(s: string): number | null {
  const t = s.trim().replace(",", ".");
  if (t === "") return null;
  const v = Number(t);
  if (!Number.isFinite(v) || v < 0) return null;
  return Math.round(v * 1024 * 1024 * 1024);
}

export function SchoolProfileSettings({
  school,
  metrics,
}: {
  school: SchoolDTO;
  metrics: SchoolAdminMetrics;
}) {
  const [quotaStorageBytes, setQuotaStorageBytes] = useState(
    metrics.quotaStorageBytes,
  );
  const [quotaTokens, setQuotaTokens] = useState(metrics.quotaTokens);
  const [storageGbInput, setStorageGbInput] = useState(
    bytesToGb(metrics.quotaStorageBytes),
  );
  const [tokensInput, setTokensInput] = useState(String(metrics.quotaTokens));
  const [savedFlash, setSavedFlash] = useState(false);
  const [aiFeat, setAiFeat] = useState(school.aiFeat);
  const [unlimitedStorage, setUnlimitedStorage] = useState(
    school.unlimitedStorage,
  );
  const [unlimitedToken, setUnlimitedToken] = useState(school.unlimitedToken);
  const [tokenLimitInput, setTokenLimitInput] = useState(
    String(school.tokenLimit),
  );
  const [storageLimitInput, setStorageLimitInput] = useState(
    String(school.storageLimit),
  );
  const [configSavedFlash, setConfigSavedFlash] = useState(false);

  useEffect(() => {
    const o = readQuotaOverride(school.id);
    const base = o ? { ...metrics, ...o } : metrics;
    const configOverride = readSchoolConfigOverride(school.id);
    const effectiveSchool = configOverride ? { ...school, ...configOverride } : school;

    setTimeout(() => {
      setQuotaStorageBytes(base.quotaStorageBytes);
      setQuotaTokens(base.quotaTokens);
      setStorageGbInput(bytesToGb(base.quotaStorageBytes));
      setTokensInput(String(base.quotaTokens));
      setAiFeat(effectiveSchool.aiFeat);
      setUnlimitedStorage(effectiveSchool.unlimitedStorage);
      setUnlimitedToken(effectiveSchool.unlimitedToken);
      setTokenLimitInput(String(effectiveSchool.tokenLimit));
      setStorageLimitInput(String(effectiveSchool.storageLimit));
    }, 0);
  }, [school, metrics]);

  const storagePct =
    quotaStorageBytes > 0
      ? Math.min(
          100,
          (metrics.storageUsedBytes / quotaStorageBytes) * 100,
        )
      : 0;
  const tokenPct =
    quotaTokens > 0
      ? Math.min(100, (metrics.tokensUsed / quotaTokens) * 100)
      : 0;

  const applySave = useCallback(() => {
    const gb = parseGbInput(storageGbInput);
    const tokens = Number(tokensInput.replace(/,/g, ""));
    if (gb === null || !Number.isFinite(tokens) || tokens < 0) return;
    writeQuotaOverride(school.id, {
      quotaStorageBytes: gb,
      quotaTokens: Math.floor(tokens),
    });
    setQuotaStorageBytes(gb);
    setQuotaTokens(Math.floor(tokens));
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  }, [school.id, storageGbInput, tokensInput]);

  const applyConfigSave = useCallback(() => {
    const tokenLimit = Number(tokenLimitInput.replace(/,/g, ""));
    const storageLimit = Number(storageLimitInput.replace(/,/g, ""));
    if (
      !Number.isFinite(tokenLimit) ||
      tokenLimit < 0 ||
      !Number.isFinite(storageLimit) ||
      storageLimit < 0
    ) {
      return;
    }

    writeSchoolConfigOverride(school.id, {
      aiFeat,
      unlimitedStorage,
      unlimitedToken,
      tokenLimit: Math.floor(tokenLimit),
      storageLimit: Math.floor(storageLimit),
    });
    setConfigSavedFlash(true);
    window.setTimeout(() => setConfigSavedFlash(false), 2200);
  }, [
    aiFeat,
    school.id,
    storageLimitInput,
    tokenLimitInput,
    unlimitedStorage,
    unlimitedToken,
  ]);

  return (
    <div className="space-y-8">
      <div className="theme-panel-strong border p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
          Profile
        </p>
        <h2 className="mt-2 text-lg font-bold uppercase tracking-[0.12em] text-foreground">
          {school.name}
        </h2>
        <dl className="mt-4 grid gap-3 font-mono text-[12px] sm:grid-cols-2">
          <div className="flex justify-between gap-4 border-b py-2" style={{ borderColor: "var(--border)" }}>
            <dt className="text-(--muted)">school_code</dt>
            <dd className="text-(--muted-strong)">{school.schoolCode}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-2" style={{ borderColor: "var(--border)" }}>
            <dt className="text-(--muted)">username</dt>
            <dd className="text-(--muted-strong)">{school.username ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-2 sm:col-span-2" style={{ borderColor: "var(--border)" }}>
            <dt className="text-(--muted)">site</dt>
            <dd className="truncate text-right text-(--success)" title={school.site}>
              {school.site}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-2" style={{ borderColor: "var(--border)" }}>
            <dt className="text-(--muted)">created_at</dt>
            <dd className="text-(--muted-strong)">{school.createdAt.slice(0, 10)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-2" style={{ borderColor: "var(--border)" }}>
            <dt className="text-(--muted)">updated_at</dt>
            <dd className="text-(--muted-strong)">{school.updatedAt.slice(0, 10)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2 sm:col-span-2">
            <dt className="text-(--muted)">id</dt>
            <dd className="break-all text-right text-[10px] text-(--muted)">
              {school.id}
            </dd>
          </div>
        </dl>

        <div
          className="mt-6 border-t pt-5"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
            School configuration
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="theme-panel border p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                AI feature
              </p>
              <label className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                <input
                  type="checkbox"
                  checked={aiFeat}
                  onChange={(e) => setAiFeat(e.target.checked)}
                  className="h-4 w-4 accent-(--accent)"
                />
                {aiFeat ? "Enabled" : "Disabled"}
              </label>
            </div>

            <div className="theme-panel border p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                Unlimited storage
              </p>
              <label className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                <input
                  type="checkbox"
                  checked={unlimitedStorage}
                  onChange={(e) => setUnlimitedStorage(e.target.checked)}
                  className="h-4 w-4 accent-(--accent)"
                />
                {unlimitedStorage ? "Enabled" : "Disabled"}
              </label>
            </div>

            <div className="theme-panel border p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                Unlimited token
              </p>
              <label className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                <input
                  type="checkbox"
                  checked={unlimitedToken}
                  onChange={(e) => setUnlimitedToken(e.target.checked)}
                  className="h-4 w-4 accent-(--accent)"
                />
                {unlimitedToken ? "Enabled" : "Disabled"}
              </label>
            </div>

            <div className="theme-panel border p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                Token limit
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={tokenLimitInput}
                onChange={(e) => setTokenLimitInput(e.target.value)}
                className="theme-input mt-3 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
              />
            </div>

            <div className="theme-panel border p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                Storage limit
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={storageLimitInput}
                onChange={(e) => setStorageLimitInput(e.target.value)}
                className="theme-input mt-3 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={applyConfigSave}
              className="theme-button-secondary border px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              Save configuration
            </button>
            {configSavedFlash ? (
              <span className="font-mono text-[11px] text-(--success)">
                Configuration saved locally
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="theme-panel-strong border p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
          Usage · mock aggregates
        </p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] text-(--muted)">
              Storage used / total quota
            </p>
            <p className="mt-1 font-mono text-sm text-foreground">
              {formatBytes(metrics.storageUsedBytes)} /{" "}
              {formatBytes(quotaStorageBytes)}
            </p>
            <div className="mt-2 h-2 w-full bg-background">
              <div
                className="h-full bg-(--success) transition-[width]"
                style={{ width: `${storagePct}%` }}
              />
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] text-(--muted)">
              AI tokens used / total quota
            </p>
            <p className="mt-1 font-mono text-sm text-foreground">
              {metrics.tokensUsed.toLocaleString()} /{" "}
              {quotaTokens.toLocaleString()}
            </p>
            <div className="mt-2 h-2 w-full bg-background">
              <div
                className="h-full bg-foreground/70 transition-[width]"
                style={{ width: `${tokenPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="theme-panel border p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
          Quotas · admin
        </p>
        <p className="mt-2 max-w-xl font-mono text-[11px] leading-relaxed text-(--muted)">
          Set total storage and total AI token allowance for this school. Values
          persist in <span className="text-(--muted-strong)">localStorage</span> in
          this browser until an API is connected.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-(--muted-strong)">
            Total storage (GB)
            <input
              type="text"
              inputMode="decimal"
              value={storageGbInput}
              onChange={(e) => setStorageGbInput(e.target.value)}
              className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
            />
          </label>
          <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-(--muted-strong)">
            Total tokens
            <input
              type="text"
              inputMode="numeric"
              value={tokensInput}
              onChange={(e) => setTokensInput(e.target.value)}
              className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={applySave}
            className="theme-button border px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors"
          >
            Save quotas
          </button>
          {savedFlash ? (
            <span className="font-mono text-[11px] text-(--success)">
              Saved locally
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
