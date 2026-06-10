import { createHash } from "crypto";
import { redisCache } from "../config/redis.js";
import { env } from "../config/env.js";

// Hash prompt + messages context để làm cache key
// Dùng 32 hex chars (128 bits) — đủ an toàn tránh collision
function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 32);
}

// Build cache key từ prompt + messages context
function buildCacheKey(prompt: string, messages?: Array<{ role: string; content: string }>): string {
  const contextStr = messages && messages.length > 0
    ? JSON.stringify(messages) + "|" + prompt
    : prompt;
  const prefix = `cache:ai:${env.nodeEnv}`;  // Namespace theo environment
  return `${prefix}:${hashContent(contextStr)}`;
}

export async function getCached(
  prompt: string,
  messages?: Array<{ role: string; content: string }>
): Promise<string | null> {
  const key = buildCacheKey(prompt, messages);
  return await redisCache.get(key);
}

export async function setCached(
  prompt: string,
  result: string,
  messages?: Array<{ role: string; content: string }>
): Promise<void> {
  const key = buildCacheKey(prompt, messages);
  await redisCache.set(key, result, "EX", env.cacheTTL);
}

// Invalidate theo pattern — dùng SCAN, không dùng KEYS *
export async function invalidateAll(): Promise<number> {
  const prefix = `cache:ai:${env.nodeEnv}:*`;
  let count = 0;
  const stream = redisCache.scanStream({ match: prefix, count: 100 });
  const keys: string[] = [];

  for await (const batch of stream) {
    keys.push(...(batch as string[]));
  }

  if (keys.length > 0) {
    await redisCache.del(...keys);
    count = keys.length;
  }
  return count;
}
