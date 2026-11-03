import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

let upstash: Ratelimit | null | undefined;

function getUpstash(): Ratelimit | null {
  if (upstash !== undefined) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  upstash =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(LIMIT, "10 m"),
          prefix: "argy-chat",
        })
      : null;
  return upstash;
}

// Fallback dev / tanpa Upstash: per instance server saja.
const memory = new Map<string, number[]>();

/** 20 pesan / 10 menit per IP (docs/06). */
export async function checkRateLimit(ip: string): Promise<boolean> {
  const limiter = getUpstash();
  if (limiter) {
    const { success } = await limiter.limit(ip);
    return success;
  }
  const now = Date.now();
  const hits = (memory.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) {
    memory.set(ip, hits);
    return false;
  }
  hits.push(now);
  memory.set(ip, hits);
  if (memory.size > 5000) memory.clear();
  return true;
}
