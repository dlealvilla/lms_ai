import type { VercelRequest } from '@vercel/node';

/**
 * Free, dependency-less fixed-window rate limiter kept in memory per
 * serverless instance. It is a cost/abuse guard, not an exact global quota:
 * each warm instance counts separately and counts reset on cold start.
 * Limits are set far above normal demo use.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimitRule {
  /** Unique name so different limits do not share counters. */
  name: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets (for Retry-After). */
  retryAfterSec: number;
}

const MAX_KEYS = 10_000;
const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }
  // If still too large (many distinct keys in one window), drop the oldest.
  while (buckets.size > MAX_KEYS) {
    const first = buckets.keys().next().value;
    if (first === undefined) break;
    buckets.delete(first);
  }
}

export function consume(rule: RateLimitRule, key: string, now: number = Date.now()): RateLimitResult {
  const id = `${rule.name}:${key}`;
  let b = buckets.get(id);
  if (!b || b.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) sweep(now);
    b = { count: 0, resetAt: now + rule.windowMs };
    buckets.set(id, b);
  }
  b.count += 1;
  const allowed = b.count <= rule.limit;
  return {
    allowed,
    remaining: Math.max(0, rule.limit - b.count),
    retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
  };
}

/** Check several rules; all are counted, the request passes only if all allow it. */
export function consumeAll(
  checks: Array<{ rule: RateLimitRule; key: string }>,
  now: number = Date.now(),
): RateLimitResult {
  let worst: RateLimitResult = { allowed: true, remaining: Number.MAX_SAFE_INTEGER, retryAfterSec: 1 };
  for (const { rule, key } of checks) {
    const r = consume(rule, key, now);
    if (!r.allowed && (worst.allowed || r.retryAfterSec > worst.retryAfterSec)) {
      worst = r;
    } else if (worst.allowed && r.remaining < worst.remaining) {
      worst = r;
    }
  }
  return worst;
}

/** Test helper. */
export function resetRateLimits() {
  buckets.clear();
}

export function getClientIp(request: VercelRequest): string {
  const headers = request.headers || {};
  const fwd = headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim();
  const real = headers['x-real-ip'];
  const realIp = Array.isArray(real) ? real[0] : real;
  return first || realIp || 'unknown';
}
