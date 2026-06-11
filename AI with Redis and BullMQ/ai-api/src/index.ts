import express from "express";
import path from "path";
import { env } from "./config/env.js";
import { redisCache } from "./config/redis.js";
import { initDatabase, closeDb } from "./config/database.js";
import { startWorker, stopWorker } from "./queue/ai-worker.js";
import { logger } from "./logger/app-logger.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();
app.use(express.json({ limit: "1mb" }));   // Giới hạn body size

// Phục vụ giao diện web (static files)
app.use(express.static(path.join(process.cwd(), "public")));

// Health check — bao gồm Redis connectivity
app.get("/health", async (_req, res) => {
  try {
    const redisPing = await redisCache.ping();
    res.json({
      status: "ok",
      time: new Date().toISOString(),
      redis: redisPing === "PONG" ? "connected" : "error",
      env: env.nodeEnv,
    });
  } catch (err) {
    res.status(503).json({
      status: "degraded",
      time: new Date().toISOString(),
      redis: "disconnected",
    });
  }
});

app.use("/api", aiRoutes);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err: err.message, stack: err.stack }, "[server] Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

// --- Start ---
async function main() {
  // 1. Init SQL Server tables
  await initDatabase();

  // 2. Start worker embedded (dev mode — 1 process cho cả server + worker)
  const worker = startWorker();

  // 3. Start HTTP server
  const server = app.listen(env.port, () => {
    logger.info(`[server] Running on http://localhost:${env.port}`);
    logger.info(`[server] Health: http://localhost:${env.port}/health`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    logger.info("[server] Shutting down...");
    server.close();
    await stopWorker();
    await closeDb();
    await redisCache.quit();
    logger.info("[server] Bye!");
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  logger.error({ err }, "[server] Failed to start");
  process.exit(1);
});
