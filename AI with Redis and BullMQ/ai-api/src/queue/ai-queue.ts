import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis.js";
import { env } from "../config/env.js";
import type { AiJobData } from "./job-types.js";

export const aiQueue = new Queue<AiJobData>("ai-jobs", {
  connection: createRedisConnection(),   // Connection riêng cho Queue
  prefix: "bull",
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 100,   // Giữ 100 job gần nhất
    removeOnFail: 50,
  },
});
