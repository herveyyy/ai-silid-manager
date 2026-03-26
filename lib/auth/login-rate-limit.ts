type LoginAttemptState = {
    failedAttempts: number[];
    lockedUntil: number | null;
};

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

const globalStore = globalThis as typeof globalThis & {
    __silidLoginRateLimit?: Map<string, LoginAttemptState>;
};

const loginRateLimitStore =
    globalStore.__silidLoginRateLimit ??
    (globalStore.__silidLoginRateLimit = new Map<string, LoginAttemptState>());

function getEntry(key: string, now: number): LoginAttemptState {
    const existing = loginRateLimitStore.get(key);
    if (!existing) {
        const created: LoginAttemptState = {
            failedAttempts: [],
            lockedUntil: null,
        };
        loginRateLimitStore.set(key, created);
        return created;
    }

    existing.failedAttempts = existing.failedAttempts.filter(
        (timestamp) => now - timestamp <= WINDOW_MS,
    );

    if (existing.lockedUntil && existing.lockedUntil <= now) {
        existing.lockedUntil = null;
    }

    return existing;
}

export function createLoginRateLimitKey(email: string): string {
    return email.trim().toLowerCase();
}

export function isLoginBlocked(key: string): boolean {
    const now = Date.now();
    return Boolean(getEntry(key, now).lockedUntil);
}

export function recordFailedLoginAttempt(key: string): void {
    const now = Date.now();
    const entry = getEntry(key, now);
    entry.failedAttempts.push(now);

    if (entry.failedAttempts.length >= MAX_ATTEMPTS) {
        entry.lockedUntil = now + LOCKOUT_MS;
    }
}

export function clearFailedLoginAttempts(key: string): void {
    loginRateLimitStore.delete(key);
}
