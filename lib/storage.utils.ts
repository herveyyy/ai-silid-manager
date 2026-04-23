/** Decimal megabyte (10⁶ B). */
export const BYTES_PER_MB = 1_000_000;

/** Decimal gigabyte in bytes (10⁹). Used for sliders / ceilings that step in GB. */
export const BYTES_PER_DECIMAL_GB = 1_000_000_000;

/** `schools.storage_limit` is megabytes — convert to bytes for comparisons with attachment sizes. */
export function storageLimitMbToBytes(mb: number): number {
  if (!Number.isFinite(mb) || mb <= 0) return 0;
  return Math.floor(mb * BYTES_PER_MB);
}

/** SI step base: 1000 B = 1 kB, 1000 kB = 1 MB, … */
const STORAGE_STEP = 1000;

const STORAGE_LABELS = ["B", "kB", "MB", "GB", "TB"] as const;

/**
 * Pick the largest scale where the value stays below 1000 (except raw bytes): B until 999,
 * then kB, MB, GB, TB using decimal thousands.
 */
export function formatStorageSize(bytes: number, fractionDigits = 2): string {
  const safe = Number(bytes);
  if (!Number.isFinite(safe) || safe < 0) return `0 ${STORAGE_LABELS[0]}`;
  if (safe === 0) return `0 ${STORAGE_LABELS[0]}`;

  let v = safe;
  let i = 0;
  while (v >= STORAGE_STEP && i < STORAGE_LABELS.length - 1) {
    v /= STORAGE_STEP;
    i++;
  }

  const decimals =
    i === 0 ? 0 : Math.min(Math.max(fractionDigits, 0), 8);
  return `${v.toFixed(decimals)} ${STORAGE_LABELS[i]}`;
}

/** Input field: bytes → numeric MB string (editors stay in MB). */
export function bytesToMbInputString(bytes: number, fractionDigits = 2): string {
  const safe = Number(bytes);
  if (!Number.isFinite(safe) || safe <= 0) {
    return (0).toFixed(fractionDigits);
  }
  return (safe / BYTES_PER_MB).toFixed(fractionDigits);
}

/** Input field: user MB → bytes. */
export function parseMbInputToBytes(raw: string): number | null {
  const t = raw.trim().replace(",", ".");
  if (t === "") return null;
  const v = Number(t);
  if (!Number.isFinite(v) || v < 0) return null;
  return Math.round(v * BYTES_PER_MB);
}
