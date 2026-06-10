import sql from "mssql";
import { env } from "./env.js";
import { logger } from "../logger/app-logger.js";

const config: sql.config = {
  server: env.mssql.host,
  port: env.mssql.port,
  user: env.mssql.user,
  password: env.mssql.password,
  database: env.mssql.database,
  options: {
    encrypt: false,          // Local dev — không cần TLS
    trustServerCertificate: true,
  },
  pool: {
    max: 5,
    min: 1,
    idleTimeoutMillis: 30_000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getDbPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
    logger.info("[database] SQL Server connected");
  }
  return pool;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    logger.info("[database] SQL Server disconnected");
  }
}

// Tạo bảng nếu chưa có — gọi 1 lần khi start
export async function initDatabase(): Promise<void> {
  const db = await getDbPool();

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ai_logs' AND xtype='U')
    CREATE TABLE ai_logs (
      id            INT IDENTITY(1,1) PRIMARY KEY,
      job_id        NVARCHAR(100),
      model         NVARCHAR(50),
      duration_ms   INT,
      prompt_len    INT,
      response_len  INT,
      tool_calls    INT DEFAULT 0,
      tool_names    NVARCHAR(MAX),        -- JSON array of tool names used
      cache_hit     BIT DEFAULT 0,
      input_tokens  INT DEFAULT 0,        -- Token usage tracking
      output_tokens INT DEFAULT 0,
      error_message NVARCHAR(MAX) NULL,   -- Log errors
      created_at    DATETIME2 DEFAULT GETDATE()
    )
  `);

  logger.info("[database] Table ai_logs ready");
}
