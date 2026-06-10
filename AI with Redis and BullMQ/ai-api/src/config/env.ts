import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",

  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
  },

  mssql: {
    host: process.env.MSSQL_HOST ?? "localhost",
    port: Number(process.env.MSSQL_PORT ?? 1433),
    user: process.env.MSSQL_USER ?? "sa",
    password: process.env.MSSQL_PASSWORD ?? "",
    database: process.env.MSSQL_DATABASE ?? "ai_api_logs",
  },

  ai: {
    baseURL: process.env.ANTHROPIC_BASE_URL!,
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN!,
    model: process.env.ANTHROPIC_MODEL ?? "glm-4.6",
  },

  cacheTTL: Number(process.env.CACHE_TTL ?? 300),
  maxToolRounds: Number(process.env.MAX_TOOL_ROUNDS ?? 10),
  jobTimeoutMs: Number(process.env.JOB_TIMEOUT_MS ?? 300_000),
  workerConcurrency: Number(process.env.WORKER_CONCURRENCY ?? 3),
};
