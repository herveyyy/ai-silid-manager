export const SCHOOL_QUOTA_STORAGE_KEY = "silid-admin-school-quotas";

export type StoredSchoolQuotas = {
  quotaStorageBytes: number;
  quotaTokens: number;
};

export function readQuotaOverride(schoolId: string): StoredSchoolQuotas | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SCHOOL_QUOTA_STORAGE_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, StoredSchoolQuotas>;
    return all[schoolId] ?? null;
  } catch {
    return null;
  }
}

export function writeQuotaOverride(
  schoolId: string,
  data: StoredSchoolQuotas,
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SCHOOL_QUOTA_STORAGE_KEY);
    const all = raw
      ? (JSON.parse(raw) as Record<string, StoredSchoolQuotas>)
      : {};
    all[schoolId] = data;
    localStorage.setItem(SCHOOL_QUOTA_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event("silid-school-quotas-updated"));
  } catch {
    // ignore quota errors
  }
}
