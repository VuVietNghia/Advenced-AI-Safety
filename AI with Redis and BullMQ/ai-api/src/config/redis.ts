import Redis from "ioredis";
import { env } from "./env.js";

// Factory — mỗi caller nhận connection riêng
// BullMQ cần maxRetriesPerRequest: null
// Cache client thì dùng default
export function createRedisConnection(forBullMQ = true) {
  return new Redis({
    host: env.redis.host,
    port: env.redis.port,
    maxRetriesPerRequest: forBullMQ ? null : undefined,
  });
}

// Cache client (singleton — reuse)
export const redisCache = createRedisConnection(false);
