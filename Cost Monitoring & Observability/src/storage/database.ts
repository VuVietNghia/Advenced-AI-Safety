import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { AIProvider, Metrics } from "../providers/types.js";

const logsDir = join(process.cwd(), "logs");
mkdirSync(logsDir, { recursive: true });

const db = new Database(join(logsDir, "ai_calls.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS ai_calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    provider TEXT,
    model TEXT,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    latency_ms INTEGER,
    estimated_cost_usd REAL,
    is_error INTEGER,
    error_message TEXT,
    user_id TEXT
  )
`);

interface MetricRow {
  id: number;
  timestamp: string;
  provider: AIProvider;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  latency_ms: number;
  estimated_cost_usd: number | null;
  is_error: 0 | 1;
  error_message: string | null;
  user_id: string | null;
}

export interface StoredMetric extends Metrics {
  id: number;
}

export interface Summary {
  totalCalls: number;
  totalTokens: number;
  totalEstimatedCostUSD: number;
  avgLatencyMs: number;
  errorRate: number;
}

export interface GroupSummary extends Summary {
  name: string;
}

function mapMetricRow(row: MetricRow): StoredMetric {
  return {
    id: row.id,
    timestamp: row.timestamp,
    provider: row.provider,
    model: row.model,
    promptTokens: row.prompt_tokens,
    completionTokens: row.completion_tokens,
    totalTokens: row.total_tokens,
    latencyMs: row.latency_ms,
    estimatedCostUSD: row.estimated_cost_usd,
    isError: Boolean(row.is_error),
    errorMessage: row.error_message,
    userId: row.user_id ?? undefined
  };
}

function normalizeLimit(value: unknown, fallback = 200): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(Math.floor(parsed), 1000);
}

export function insertMetrics(metrics: Metrics): void {
  db.prepare(`
    INSERT INTO ai_calls (
      timestamp,
      provider,
      model,
      prompt_tokens,
      completion_tokens,
      total_tokens,
      latency_ms,
      estimated_cost_usd,
      is_error,
      error_message,
      user_id
    )
    VALUES (
      @timestamp,
      @provider,
      @model,
      @promptTokens,
      @completionTokens,
      @totalTokens,
      @latencyMs,
      @estimatedCostUSD,
      @isError,
      @errorMessage,
      @userId
    )
  `).run({
    ...metrics,
    isError: metrics.isError ? 1 : 0,
    userId: metrics.userId ?? null
  });
}

export function getAllMetrics(options: {
  provider?: AIProvider;
  limit?: number;
} = {}): StoredMetric[] {
  const limit = normalizeLimit(options.limit);

  if (options.provider) {
    const rows = db
      .prepare(
        "SELECT * FROM ai_calls WHERE provider = ? ORDER BY timestamp DESC LIMIT ?"
      )
      .all(options.provider, limit) as MetricRow[];
    return rows.map(mapMetricRow);
  }

  const rows = db
    .prepare("SELECT * FROM ai_calls ORDER BY timestamp DESC LIMIT ?")
    .all(limit) as MetricRow[];
  return rows.map(mapMetricRow);
}

export function getRecentMetrics(limit = 20): StoredMetric[] {
  return getAllMetrics({ limit });
}

function summaryFromWhere(whereClause = "", params: unknown[] = []): Summary {
  const row = db
    .prepare(`
      SELECT
        COUNT(*) AS totalCalls,
        COALESCE(SUM(total_tokens), 0) AS totalTokens,
        COALESCE(SUM(estimated_cost_usd), 0) AS totalEstimatedCostUSD,
        COALESCE(AVG(latency_ms), 0) AS avgLatencyMs,
        CASE
          WHEN COUNT(*) = 0 THEN 0
          ELSE SUM(is_error) * 1.0 / COUNT(*)
        END AS errorRate
      FROM ai_calls
      ${whereClause}
    `)
    .get(...params) as Summary;

  return {
    totalCalls: Number(row.totalCalls),
    totalTokens: Number(row.totalTokens),
    totalEstimatedCostUSD: Number(row.totalEstimatedCostUSD),
    avgLatencyMs: Number(row.avgLatencyMs),
    errorRate: Number(row.errorRate)
  };
}

export function getSummary(): Summary {
  return summaryFromWhere();
}

export function getMetricsByProvider(provider: AIProvider): StoredMetric[] {
  return getAllMetrics({ provider });
}

export function getSummaryByProvider(): GroupSummary[] {
  const rows = db
    .prepare(`
      SELECT
        provider AS name,
        COUNT(*) AS totalCalls,
        COALESCE(SUM(total_tokens), 0) AS totalTokens,
        COALESCE(SUM(estimated_cost_usd), 0) AS totalEstimatedCostUSD,
        COALESCE(AVG(latency_ms), 0) AS avgLatencyMs,
        CASE
          WHEN COUNT(*) = 0 THEN 0
          ELSE SUM(is_error) * 1.0 / COUNT(*)
        END AS errorRate
      FROM ai_calls
      GROUP BY provider
      ORDER BY totalCalls DESC
    `)
    .all() as GroupSummary[];

  return rows.map((row) => ({
    name: row.name,
    totalCalls: Number(row.totalCalls),
    totalTokens: Number(row.totalTokens),
    totalEstimatedCostUSD: Number(row.totalEstimatedCostUSD),
    avgLatencyMs: Number(row.avgLatencyMs),
    errorRate: Number(row.errorRate)
  }));
}

export function getSummaryByModel(): GroupSummary[] {
  const rows = db
    .prepare(`
      SELECT
        model AS name,
        COUNT(*) AS totalCalls,
        COALESCE(SUM(total_tokens), 0) AS totalTokens,
        COALESCE(SUM(estimated_cost_usd), 0) AS totalEstimatedCostUSD,
        COALESCE(AVG(latency_ms), 0) AS avgLatencyMs,
        CASE
          WHEN COUNT(*) = 0 THEN 0
          ELSE SUM(is_error) * 1.0 / COUNT(*)
        END AS errorRate
      FROM ai_calls
      GROUP BY model
      ORDER BY totalCalls DESC
    `)
    .all() as GroupSummary[];

  return rows.map((row) => ({
    name: row.name,
    totalCalls: Number(row.totalCalls),
    totalTokens: Number(row.totalTokens),
    totalEstimatedCostUSD: Number(row.totalEstimatedCostUSD),
    avgLatencyMs: Number(row.avgLatencyMs),
    errorRate: Number(row.errorRate)
  }));
}
