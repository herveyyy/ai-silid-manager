"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  AiModelDTO,
  SchoolAdminMetrics,
  SchoolDTO,
} from "@/lib/types/admin-types";
import {
  updateSchoolConfigurationAction,
  updateSchoolPasswordAction,
  updateSchoolProfileAction,
} from "@/app/dashboard/schools/actions";
import { formatStorageSize } from "@/lib/storage.utils";

export function SchoolProfileSettings({
  school,
  metrics,
  aiModels,
}: {
  school: SchoolDTO;
  metrics: SchoolAdminMetrics;
  aiModels: AiModelDTO[];
}) {
  const router = useRouter();
  const [aiFeat, setAiFeat] = useState(school.aiFeat);
  const [enrichmentFeat, setEnrichmentFeat] = useState(school.enrichmentFeat);
  const [unlimitedStorage, setUnlimitedStorage] = useState(
    school.unlimitedStorage,
  );
  const [unlimitedToken, setUnlimitedToken] = useState(school.unlimitedToken);
  const [defaultAiModelId, setDefaultAiModelId] = useState(
    school.defaultAiModelId ?? "",
  );
  const [tokenLimitInput, setTokenLimitInput] = useState(
    String(school.tokenLimit),
  );
  const [storageLimitInput, setStorageLimitInput] = useState(
    String(school.storageLimit),
  );
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [configError, setConfigError] = useState<string | null>(null);
  const [configSavedFlash, setConfigSavedFlash] = useState(false);
  const [isConfigPending, startConfigTransition] = useTransition();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSavedFlash, setPwdSavedFlash] = useState(false);
  const [isPwdPending, startPwdTransition] = useTransition();
  const [nameInput, setNameInput] = useState(school.name);
  const [schoolCodeInput, setSchoolCodeInput] = useState(school.schoolCode);
  const [siteInput, setSiteInput] = useState(school.site);
  const [usernameInput, setUsernameInput] = useState(school.username ?? "");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSavedFlash, setProfileSavedFlash] = useState(false);
  const [isProfilePending, startProfileTransition] = useTransition();
  useEffect(() => {
    setTimeout(() => {
      setAiFeat(school.aiFeat);
      setEnrichmentFeat(school.enrichmentFeat);
      setDefaultAiModelId(school.defaultAiModelId ?? "");
      setUnlimitedStorage(school.unlimitedStorage);
      setUnlimitedToken(school.unlimitedToken);
      setTokenLimitInput(String(school.tokenLimit));
      setStorageLimitInput(String(school.storageLimit));
      setNameInput(school.name);
      setSchoolCodeInput(school.schoolCode);
      setSiteInput(school.site);
      setUsernameInput(school.username ?? "");
    }, 0);
  }, [school]);

  const storagePct =
    !unlimitedStorage && metrics.quotaStorageBytes > 0
      ? Math.min(
        100,
        (metrics.storageUsedBytes / metrics.quotaStorageBytes) * 100,
      )
      : 0;
  const tokenPct =
    !unlimitedToken && metrics.quotaTokens > 0
      ? Math.min(100, (metrics.tokensUsed / metrics.quotaTokens) * 100)
      : 0;

  const applyConfigSave = useCallback(() => {
    const tokenLimit = Number(tokenLimitInput.replace(/,/g, ""));
    const storageLimit = Number(storageLimitInput.replace(/,/g, ""));
    if (
      !Number.isFinite(tokenLimit) ||
      tokenLimit < 0 ||
      !Number.isFinite(storageLimit) ||
      storageLimit < 0
    ) {
      setConfigError("Enter valid non-negative numeric limits.");
      return;
    }
    const apiKeyNorm = apiKeyInput.trim();
    const secretNorm = secretInput.trim();
    if (apiKeyNorm !== "" && apiKeyNorm.length > 100) {
      setConfigError("API key must be at most 100 characters.");
      return;
    }
    if (secretNorm !== "" && secretNorm.length > 100) {
      setConfigError("Secret must be at most 100 characters.");
      return;
    }
    setConfigError(null);
    startConfigTransition(async () => {
      const result = await updateSchoolConfigurationAction(school.id, {
        aiFeat,
        enrichmentFeat,
        defaultAiModelId: defaultAiModelId || null,
        unlimitedStorage,
        unlimitedToken,
        tokenLimit: Math.floor(tokenLimit),
        storageLimit: Math.floor(storageLimit),
        ...(apiKeyNorm !== "" ? { apiKey: apiKeyNorm } : {}),
        ...(secretNorm !== "" ? { secret: secretNorm } : {}),
      });

      if (!result.success) {
        setConfigSavedFlash(false);
        setConfigError(result.message);
        return;
      }

      setTokenLimitInput(String(Math.floor(tokenLimit)));
      setStorageLimitInput(String(Math.floor(storageLimit)));
      setApiKeyInput("");
      setSecretInput("");
      setConfigSavedFlash(true);
      window.setTimeout(() => setConfigSavedFlash(false), 2200);
      router.refresh();
    });
  }, [
    aiFeat,
    enrichmentFeat,
    apiKeyInput,
    defaultAiModelId,
    router,
    school.id,
    secretInput,
    storageLimitInput,
    tokenLimitInput,
    unlimitedStorage,
    unlimitedToken,
  ]);

  const applyPasswordUpdate = useCallback(() => {
    setPwdError(null);
    startPwdTransition(async () => {
      const result = await updateSchoolPasswordAction(school.id, {
        newPassword,
        confirmPassword,
      });
      if (!result.success) {
        setPwdSavedFlash(false);
        setPwdError(result.message);
        return;
      }
      setNewPassword("");
      setConfirmPassword("");
      setPwdSavedFlash(true);
      window.setTimeout(() => setPwdSavedFlash(false), 2200);
      router.refresh();
    });
  }, [confirmPassword, newPassword, router, school.id]);

  const applyRemovePassword = useCallback(() => {
    if (
      !window.confirm(
        "Remove the stored password for this school? Tenant login using this password will no longer work.",
      )
    ) {
      return;
    }
    setPwdError(null);
    startPwdTransition(async () => {
      const result = await updateSchoolPasswordAction(school.id, {
        removeCredential: true,
      });
      if (!result.success) {
        setPwdSavedFlash(false);
        setPwdError(result.message);
        return;
      }
      setNewPassword("");
      setConfirmPassword("");
      setPwdSavedFlash(true);
      window.setTimeout(() => setPwdSavedFlash(false), 2200);
      router.refresh();
    });
  }, [router, school.id]);

  const applyProfileSave = useCallback(() => {
    setProfileError(null);
    startProfileTransition(async () => {
      const result = await updateSchoolProfileAction(school.id, {
        name: nameInput,
        schoolCode: schoolCodeInput,
        site: siteInput,
        username: usernameInput,
      });
      if (!result.success) {
        setProfileSavedFlash(false);
        setProfileError(result.message);
        return;
      }
      setProfileSavedFlash(true);
      window.setTimeout(() => setProfileSavedFlash(false), 2200);
      router.refresh();
    });
  }, [
    nameInput,
    router,
    school.id,
    schoolCodeInput,
    siteInput,
    usernameInput,
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

        <div
          className="mt-6 border-t pt-5"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
            Edit school info
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
              Name
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={500}
                className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
              />
            </label>
            <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
              School code
              <input
                type="text"
                value={schoolCodeInput}
                onChange={(e) => setSchoolCodeInput(e.target.value)}
                maxLength={50}
                className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
              />
            </label>
            <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong) sm:col-span-2">
              Site
              <input
                type="text"
                value={siteInput}
                onChange={(e) => setSiteInput(e.target.value)}
                maxLength={2000}
                className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
              />
            </label>
            <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong) sm:col-span-2">
              Username{" "}
              <span className="normal-case tracking-normal text-(--muted)">
                (optional)
              </span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                maxLength={100}
                autoComplete="off"
                className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={applyProfileSave}
              disabled={isProfilePending}
              className="theme-button border px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
            >
              {isProfilePending ? "Saving…" : "Save school info"}
            </button>
            {profileSavedFlash ? (
              <span className="font-mono text-[11px] text-(--success)">
                Saved
              </span>
            ) : null}
            {profileError ? (
              <span className="font-mono text-[11px] text-(--danger)">
                {profileError}
              </span>
            ) : null}
          </div>
        </div>

        <dl className="mt-6 grid gap-3 font-mono text-[12px] sm:grid-cols-2">
          <div className="flex justify-between gap-4 border-b py-2" style={{ borderColor: "var(--border)" }}>
            <dt className="text-(--muted)">password</dt>
            <dd className="text-(--muted-strong)">
              {school.passwordCredentialSet ? "Set (plain text)" : "Not set"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-2 sm:col-span-2" style={{ borderColor: "var(--border)" }}>
            <dt className="text-(--muted)">api_key</dt>
            <dd className="text-(--muted-strong)">
              {school.apiKeySet ? "Set" : "Not set"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b py-2 sm:col-span-2" style={{ borderColor: "var(--border)" }}>
            <dt className="text-(--muted)">secret</dt>
            <dd className="text-(--muted-strong)">
              {school.secretSet ? "Set" : "Not set"}
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
            Login password (tenant)
          </p>
          <p className="mt-2 max-w-xl font-mono text-[11px] leading-relaxed text-(--muted)">
            Stored as plain text in the database (max 100 characters). Not shown
            again in this UI after save.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                maxLength={100}
                autoComplete="new-password"
                className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                placeholder="Min 8 characters"
              />
            </label>
            <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={100}
                autoComplete="new-password"
                className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={applyPasswordUpdate}
              disabled={isPwdPending}
              className="theme-button-secondary border px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
            >
              {isPwdPending ? "Saving…" : "Update password"}
            </button>
            {school.passwordCredentialSet ? (
              <button
                type="button"
                onClick={applyRemovePassword}
                disabled={isPwdPending}
                className="border border-(--danger)/40 px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-(--danger) transition-colors hover:bg-(--danger)/10 disabled:opacity-50"
              >
                Remove stored password
              </button>
            ) : null}
            {pwdSavedFlash ? (
              <span className="font-mono text-[11px] text-(--success)">
                Saved
              </span>
            ) : null}
            {pwdError ? (
              <span className="font-mono text-[11px] text-(--danger)">
                {pwdError}
              </span>
            ) : null}
          </div>
        </div>

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
                Enrichment feature
              </p>
              <label className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                <input
                  type="checkbox"
                  checked={enrichmentFeat}
                  onChange={(e) => setEnrichmentFeat(e.target.checked)}
                  className="h-4 w-4 accent-(--accent)"
                />
                {enrichmentFeat ? "Enabled" : "Disabled"}
              </label>
            </div>

            <div className="theme-panel border p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                Default AI model
              </p>
              <select
                value={defaultAiModelId}
                onChange={(e) => setDefaultAiModelId(e.target.value)}
                className="theme-input mt-3 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
              >
                <option value="">No default model</option>
                {aiModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} · {model.status}
                  </option>
                ))}
              </select>
              <p className="mt-3 font-mono text-[11px] text-(--muted)">
                {defaultAiModelId
                  ? aiModels.find((model) => model.id === defaultAiModelId)
                    ?.description ?? "Selected model"
                  : "Use this school's preferred default AI model."}
              </p>
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
              {unlimitedToken ? (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-(--accent)">
                  &infin; Unlimited
                </p>
              ) : null}
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
              {unlimitedStorage ? (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-(--accent)">
                  &infin; Unlimited
                </p>
              ) : null}
              <input
                type="text"
                inputMode="numeric"
                value={storageLimitInput}
                onChange={(e) => setStorageLimitInput(e.target.value)}
                className="theme-input mt-3 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
              />
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-(--muted)">
                Number is megabytes: 10,000 = 10,000 MB. Schema default 10,000.
              </p>
            </div>

            <div className="theme-panel border p-4 sm:col-span-2 xl:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                API key
              </p>
              <p className="mt-2 font-mono text-[11px] text-(--muted)">
                Optional. Leave blank to keep the current value. Enter a new value to replace. Max 100 characters.
              </p>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                maxLength={100}
                autoComplete="off"
                className="theme-input mt-3 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                placeholder={school.apiKeySet ? "Replace API key…" : "Set API key…"}
              />
            </div>

            <div className="theme-panel border p-4 sm:col-span-2 xl:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                Secret
              </p>
              <p className="mt-2 font-mono text-[11px] text-(--muted)">
                Optional. Leave blank to keep the current value. Enter a new value to replace. Max 100 characters.
              </p>
              <input
                type="text"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                maxLength={100}
                autoComplete="off"
                className="theme-input mt-3 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                placeholder={school.secretSet ? "Replace secret…" : "Set secret…"}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={applyConfigSave}
              disabled={isConfigPending}
              className="theme-button-secondary border px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              {isConfigPending ? "Saving..." : "Save configuration"}
            </button>
            {configSavedFlash ? (
              <span className="font-mono text-[11px] text-(--success)">
                Configuration saved
              </span>
            ) : null}
            {configError ? (
              <span className="font-mono text-[11px] text-(--danger)">
                {configError}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="theme-panel-strong border p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--muted)">
          Usage
        </p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] text-(--muted)">
              Storage used / total quota
            </p>
            <p className="mt-1 font-mono text-sm text-foreground">
              {formatStorageSize(metrics.storageUsedBytes)} /{" "}
              {unlimitedStorage ? (
                <span className="text-(--accent)">&infin;</span>
              ) : (
                formatStorageSize(metrics.quotaStorageBytes)
              )}
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
              {unlimitedToken ? (
                <span className="text-(--accent)">&infin;</span>
              ) : (
                metrics.quotaTokens.toLocaleString()
              )}
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
    </div>
  );
}
