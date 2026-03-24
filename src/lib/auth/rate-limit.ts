type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Check if the given key is rate-limited.
 * This only CHECKS — it does NOT increment the counter.
 * Call `recordFailedAttempt` after a failed action to increment.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): { allowed: boolean; retryAfterMs?: number } {
  if (process.env.DISABLE_RATE_LIMIT === "true") {
    return { allowed: true };
  }

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  return { allowed: true };
}

/**
 * Increment the failure counter for a given key.
 * Call this ONLY after a failed attempt (wrong password, user not found, etc.).
 */
export function recordFailedAttempt(key: string, windowMs: number): void {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  entry.count += 1;
}

export function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    return parts[parts.length - 1].trim();
  }
  return "unknown";
}
