import { getDbPool } from "../config/database.js";
import { logger } from "./app-logger.js";

export interface LogEntry {
  jobId: string;
  model: string;
  durationMs: number;
  promptLen: number;
  responseLen: number;
  toolCalls: number;
  toolNames: string[];     // Tên các tool đã gọi
  cacheHit: boolean;
  inputTokens: number;     // Token usage
  outputTokens: number;
  errorMessage?: string;   // Null nếu success
}

export async function logAiCall(entry: LogEntry): Promise<void> {
  try {
    const db = await getDbPool();
    await db.request()
      .input("jobId", entry.jobId)
      .input("model", entry.model)
      .input("durationMs", entry.durationMs)
      .input("promptLen", entry.promptLen)
      .input("responseLen", entry.responseLen)
      .input("toolCalls", entry.toolCalls)
      .input("toolNames", JSON.stringify(entry.toolNames))
      .input("cacheHit", entry.cacheHit ? 1 : 0)
      .input("inputTokens", entry.inputTokens)
      .input("outputTokens", entry.outputTokens)
      .input("errorMessage", entry.errorMessage ?? null)
      .query(`
        INSERT INTO ai_logs
          (job_id, model, duration_ms, prompt_len, response_len,
           tool_calls, tool_names, cache_hit, input_tokens, output_tokens, error_message)
        VALUES
          (@jobId, @model, @durationMs, @promptLen, @responseLen,
           @toolCalls, @toolNames, @cacheHit, @inputTokens, @outputTokens, @errorMessage)
      `);
  } catch (err) {
    // Log to error file nếu DB write fail — không throw để không crash worker
    logger.error({ err, entry }, "[db-logger] Failed to write log");
  }
}
