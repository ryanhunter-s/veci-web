type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function nowMs() {
  return Date.now();
}

export function rateLimit(key: string, { limit, windowMs} : { limit: number; windowMs: number }) {
  const current = nowMs();
  const bucket = buckets.get(key);

  if (!bucket || current > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: current + windowMs });
    return { ok: true as const, remaining: limit - 1, resetAt: current + windowMs };
  }

  if (bucket.count >= limit) {
    return { ok: false as const, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true as const, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export function ipKey(req: { headers: Headers }): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return ip;
}
