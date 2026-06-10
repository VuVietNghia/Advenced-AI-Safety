import { mkdirSync } from "node:fs";
import { join } from "node:path";
import winston from "winston";
import { Metrics } from "../providers/types.js";

const logsDir = join(process.cwd(), "logs");
mkdirSync(logsDir, { recursive: true });

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: join(logsDir, "app.log"),
      level: "debug"
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} ${level}: ${message} ${JSON.stringify(meta)}`;
        })
      )
    })
  ]
});

export function logMetrics(metrics: Metrics): void {
  const payload = {
    provider: metrics.provider,
    model: metrics.model,
    latency_ms: metrics.latencyMs,
    total_tokens: metrics.totalTokens,
    estimated_cost_usd: metrics.estimatedCostUSD,
    is_error: metrics.isError,
    error_message: metrics.errorMessage
  };

  if (metrics.isError) {
    logger.error("ai_call", payload);
    return;
  }

  logger.info("ai_call", payload);
}
