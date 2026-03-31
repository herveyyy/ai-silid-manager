"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { createSchoolAction } from "@/app/dashboard/schools/actions";

export function AddSchoolModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secret, setSecret] = useState("");
  const [feedback, setFeedback] = useState<{
    text: string;
    kind: "error" | "ok";
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const resetForm = useCallback(() => {
    setName("");
    setSchoolCode("");
    setSite("");
    setUsername("");
    setPassword("");
    setApiKey("");
    setSecret("");
    setFeedback(null);
  }, []);

  const closeModal = useCallback(() => {
    resetForm();
    setIsOpen(false);
  }, [resetForm]);

  const openModal = useCallback(() => {
    resetForm();
    setIsOpen(true);
  }, [resetForm]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const result = await createSchoolAction({
        name,
        schoolCode,
        site,
        username,
        password,
        apiKey,
        secret,
      });
      if (!result.success) {
        setFeedback({ text: result.message, kind: "error" });
        return;
      }

      closeModal();
      router.refresh();
      if (result.schoolId) {
        router.push(`/dashboard/schools/${result.schoolId}`);
      }
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={openModal}
          className="theme-button-secondary border px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors"
        >
          Add school
        </button>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-school-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/55"
            aria-hidden
            onClick={closeModal}
          />
          <div
            className="theme-panel relative z-10 max-h-[min(90vh,640px)] w-full max-w-md overflow-y-auto border p-6 shadow-lg"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <div
              className="flex items-start justify-between gap-4 border-b pb-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <h2
                  id="add-school-modal-title"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted)"
                >
                  New tenant
                </h2>
                <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em] text-foreground">
                  Add school
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="theme-button-secondary shrink-0 border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.15em]"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                Name
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={500}
                  autoComplete="organization"
                  className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                  placeholder="Example High School"
                />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                School code
                <input
                  type="text"
                  name="schoolCode"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  required
                  maxLength={50}
                  className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                  placeholder="EHS-01"
                />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                Site
                <input
                  type="text"
                  name="site"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  required
                  maxLength={2000}
                  className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                  placeholder="https://example.edu or tenant label"
                />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                Username{" "}
                <span className="normal-case tracking-normal text-(--muted)">
                  (optional)
                </span>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={100}
                  autoComplete="off"
                  className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                Password{" "}
                <span className="normal-case tracking-normal text-(--muted)">
                  (optional, min 8 if set — stored as plain text)
                </span>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={100}
                  autoComplete="new-password"
                  className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                API key{" "}
                <span className="normal-case tracking-normal text-(--muted)">
                  (optional, max 100)
                </span>
                <input
                  type="text"
                  name="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  maxLength={100}
                  autoComplete="off"
                  className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-(--muted-strong)">
                Secret{" "}
                <span className="normal-case tracking-normal text-(--muted)">
                  (optional, max 100)
                </span>
                <input
                  type="text"
                  name="secret"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  maxLength={100}
                  autoComplete="off"
                  className="theme-input mt-2 w-full border px-3 py-2.5 font-mono text-[13px] outline-none"
                />
              </label>
              {feedback ? (
                <p
                  className={`font-mono text-[11px] ${
                    feedback.kind === "error"
                      ? "text-red-500"
                      : "text-(--muted-strong)"
                  }`}
                >
                  {feedback.text}
                </p>
              ) : null}
              <div
                className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="theme-button-secondary border px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="theme-button-secondary border px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] disabled:opacity-50"
                >
                  {isPending ? "Creating…" : "Create school"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
