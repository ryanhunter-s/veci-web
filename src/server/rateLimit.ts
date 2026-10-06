import { and, eq, gt, lt, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { rateLimitBuckets } from "@/server/db/schema";

export type RateLimitResult =
  | { ok: true; remaining: number; resetAt: number }
  | { ok: false; remaining: 0; resetAt: number };

async function sweepExpired(now: Date): Promise<void> {
  await db.delete(rateLimitBuckets).where(lt(rateLimitBuckets.resetAt, now));
}

export async function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  const now = new Date();
  const current = now.getTime();

  const [bucket] = await db
    .insert(rateLimitBuckets)
    .values({ key, count: 1, resetAt: new Date(current + windowMs) })
    .onConflictDoUpdate({
      target: rateLimitBuckets.key,
      set: {
        count: sql`${rateLimitBuckets.count} + 1`,
        resetAt: sql`GREATEST(${rateLimitBuckets.resetAt}, ${new Date(current + windowMs)})`,
      },
    })
    .returning({ count: rateLimitBuckets.count, resetAt: rateLimitBuckets.resetAt });

  void sweepExpired(now);

  const count = bucket?.count ?? 1;
  const resetAt = bucket?.resetAt.getTime() ?? current + windowMs;

  if (count > limit) {
    return { ok: false, remaining: 0, resetAt };
  }

  return { ok: true, remaining: Math.max(0, limit - count), resetAt };
}

export async function resetRateLimit(key: string): Promise<void> {
  await db.delete(rateLimitBuckets).where(eq(rateLimitBuckets.key, key));
}

export async function assertNotRateLimited(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<void> {
  const [bucket] = await db
    .select()
    .from(rateLimitBuckets)
    .where(and(eq(rateLimitBuckets.key, key), gt(rateLimitBuckets.resetAt, new Date())))
    .limit(1);

  if (bucket && bucket.count >= limit) {
    throw new Error("Too many attempts. Please try again later.");
  }
}

export function ipKey(req: { headers: Headers }): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return ip;
}