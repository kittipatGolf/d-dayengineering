type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  key: string,
  _maxAttempts: number,
  _windowMs: number,
): { allowed: boolean; retryAfterMs?: number } {
  // Only disable rate limiting if explicitly opted out
  if (process.env.DISABLE_RATE_LIMIT === "true") {
    return { allowed: true };
  }

  const maxAttempts = _maxAttempts;
  const windowMs = _windowMs;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  // Prefer x-real-ip (set by reverse proxy) over x-forwarded-for
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    // Use last entry (added by proxy, not client-spoofable)
    return parts[parts.length - 1].trim();
  }
  return "unknown";
}
