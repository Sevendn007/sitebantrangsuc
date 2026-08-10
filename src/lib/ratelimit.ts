// Simple in-memory sliding window rate limiter. Sufficient for single-instance deploys.
// For multi-instance, replace with Redis / Upstash.

interface Bucket {
  tokens: number[];
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function rateLimit(key: string, opts: RateLimitOptions): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key) || { tokens: [] };
  bucket.tokens = bucket.tokens.filter((t) => now - t < opts.windowMs);
  if (bucket.tokens.length >= opts.max) {
    const oldest = bucket.tokens[0];
    return { ok: false, retryAfter: Math.ceil((opts.windowMs - (now - oldest)) / 1000) };
  }
  bucket.tokens.push(now);
  buckets.set(key, bucket);

  // opportunistic cleanup to avoid unbounded growth
  if (buckets.size > 5000) {
    for (const [k, b] of buckets.entries()) {
      if (b.tokens.every((t) => now - t > opts.windowMs)) buckets.delete(k);
    }
  }

  return { ok: true, retryAfter: 0 };
}

export function clientKey(req: Request, salt = ""): string {
  const h = new Headers(req.headers);
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return `${salt}:${ip}`;
}
