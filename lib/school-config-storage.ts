import type { SchoolDTO } from "@/lib/types/admin-types";

export const SCHOOL_CONFIG_STORAGE_KEY = "silid-admin-school-config";

export type StoredSchoolConfig = Pick<
    SchoolDTO,
    | "aiFeat"
    | "defaultAiModelId"
    | "unlimitedStorage"
    | "unlimitedToken"
    | "tokenLimit"
    | "storageLimit"
    | "secret"
    | "apiKey"
>;

export function readSchoolConfigOverride(
    schoolId: string,
): StoredSchoolConfig | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = localStorage.getItem(SCHOOL_CONFIG_STORAGE_KEY);
        if (!raw) return null;
        const all = JSON.parse(raw) as Record<string, StoredSchoolConfig>;
        return all[schoolId] ?? null;
    } catch {
        return null;
    }
}

export function writeSchoolConfigOverride(
    schoolId: string,
    data: StoredSchoolConfig,
): void {
    if (typeof window === "undefined") return;

    try {
        const raw = localStorage.getItem(SCHOOL_CONFIG_STORAGE_KEY);
        const all = raw
            ? (JSON.parse(raw) as Record<string, StoredSchoolConfig>)
            : {};
        all[schoolId] = data;
        localStorage.setItem(SCHOOL_CONFIG_STORAGE_KEY, JSON.stringify(all));
        window.dispatchEvent(new Event("silid-school-config-updated"));
    } catch {
        throw new Error("Failed to write school config override");
    }
}
