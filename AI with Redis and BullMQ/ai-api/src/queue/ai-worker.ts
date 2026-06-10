import { Worker, Job } from "bullmq";
import { createRedisConnection } from "../config/redis.js";
import { callProxy } from "../ai/proxy-client.js";
import { tools } from "../ai/tools.js";
import { executeTool } from "../ai/executor.js";
import { SYSTEM_PROMPT } from "../ai/prompts.js";
import { logAiCall } from "../logger/db-logger.js";
import { logger } from "../logger/app-logger.js";
import { getCached, setCached } from "../cache/redis-cache.js";
import { env } from "../config/env.js";
import type { AiJobData, AiJobResult } from "./job-types.js";
import type Anthropic from "@anthropic-ai/sdk";

// Export processor function — testable riêng lẻ
export async function processAiJob(job: Job<AiJobData, AiJobResult>): Promise<AiJobResult> {
  const { prompt, messages = [] } = job.data;

  // 1. Check cache (hash cả prompt + messages context)
  const cached = await getCached(prompt, messages);
  if (cached) {
    logger.info({ jobId: job.id }, "[worker] Cache hit");
    await logAiCall({
      jobId: job.id ?? "unknown",
      model: env.ai.model,
      durationMs: 0,
      promptLen: prompt.length,
      responseLen: cached.length,
      toolCalls: 0,
      toolNames: [],
      cacheHit: true,
      inputTokens: 0,
      outputTokens: 0,
    });
    return { answer: cached, toolCallsUsed: 0, toolNames: [], fromCache: true, inputTokens: 0, outputTokens: 0 };
  }

  // 2. Build messages array
  const allMessages: Anthropic.MessageParam[] = [
    ...messages,
    { role: "user", content: prompt },
  ];

  const start = Date.now();
  let toolCallsUsed = 0;
  const toolNames: string[] = [];
  let finalAnswer = "";
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  // 3. Agentic loop — tool use with MAX_TOOL_ROUNDS limit
  let round = 0;
  while (round < env.maxToolRounds) {
    round++;

    // Dùng callProxy thay vì Anthropic SDK vì proxy trả response theo format OpenAI
    // callProxy() nhận Anthropic-format request, trả về Anthropic-compatible response
    const response = await callProxy({
      model: env.ai.model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages: allMessages,
    });

    // Track token usage
    totalInputTokens += response.usage.input_tokens;
    totalOutputTokens += response.usage.output_tokens;

    // Push assistant response vào history (content đã được normalize thành array)
    allMessages.push({ role: "assistant", content: response.content as unknown as Anthropic.ContentBlock[] });

    if (response.stop_reason === "tool_use") {
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type === "tool_use") {
          toolCallsUsed++;
          toolNames.push(block.name);
          logger.info(
            { jobId: job.id, tool: block.name, input: block.input, round },
            "[worker] Executing tool"
          );
          const result = await executeTool(
            block.name,
            block.input as Record<string, unknown>
          );
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      allMessages.push({ role: "user", content: toolResults });
      continue;
    }

    if (response.stop_reason === "end_turn" || response.stop_reason === "max_tokens") {
      const textBlock = response.content.find((b) => b.type === "text") as { type: "text"; text: string } | undefined;
      finalAnswer = textBlock?.text ?? "";
      logger.info({ jobId: job.id, round, answerLen: finalAnswer.length }, "[worker] Got final answer");
      break;
    }

    // stop_reason khác — log warning và lấy text nếu có
    logger.warn(
      { jobId: job.id, stopReason: response.stop_reason, round },
      "[worker] Unexpected stop_reason"
    );
    const textBlock = response.content.find((b) => b.type === "text") as { type: "text"; text: string } | undefined;
    finalAnswer = textBlock?.text ?? "";
    break;
  }

  // Nếu đạt max rounds mà chưa end_turn
  if (round >= env.maxToolRounds && !finalAnswer) {
    logger.error({ jobId: job.id, rounds: round }, "[worker] Max tool rounds exceeded");
    finalAnswer = "⚠️ Đã đạt giới hạn vòng xử lý tool. Vui lòng thử lại với câu hỏi đơn giản hơn.";
  }

  const durationMs = Date.now() - start;

  // 4. Cache kết quả (bao gồm messages context)
  if (finalAnswer) {
    await setCached(prompt, finalAnswer, messages);
  }

  // 5. Log to SQL Server
  await logAiCall({
    jobId: job.id ?? "unknown",
    model: env.ai.model,
    durationMs,
    promptLen: prompt.length,
    responseLen: finalAnswer.length,
    toolCalls: toolCallsUsed,
    toolNames,
    cacheHit: false,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
  });

  return {
    answer: finalAnswer,
    toolCallsUsed,
    toolNames,
    fromCache: false,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
  };
}

// --- Worker instance ---

let worker: Worker<AiJobData, AiJobResult> | null = null;

export function startWorker(): Worker<AiJobData, AiJobResult> {
  worker = new Worker<AiJobData, AiJobResult>(
    "ai-jobs",
    processAiJob,
    {
      connection: createRedisConnection(),
      concurrency: env.workerConcurrency,
      limiter: { max: 10, duration: 1000 },
    }
  );

  worker.on("completed", (job, result) => {
    logger.info(
      { jobId: job.id, cache: result.fromCache, tools: result.toolCallsUsed, toolNames: result.toolNames },
      "[worker] Job completed"
    );
  });

  worker.on("failed", (job, err) => {
    logger.error(
      { jobId: job?.id, error: err.message },
      "[worker] Job failed"
    );

    // Log failed job to DB
    logAiCall({
      jobId: job?.id ?? "unknown",
      model: env.ai.model,
      durationMs: 0,
      promptLen: job?.data?.prompt?.length ?? 0,
      responseLen: 0,
      toolCalls: 0,
      toolNames: [],
      cacheHit: false,
      inputTokens: 0,
      outputTokens: 0,
      errorMessage: err.message,
    }).catch(() => {}); // Fire-and-forget
  });

  logger.info({ concurrency: env.workerConcurrency }, "[worker] AI worker started");
  return worker;
}

// Graceful shutdown — chờ jobs đang xử lý hoàn thành
export async function stopWorker(): Promise<void> {
  if (worker) {
    logger.info("[worker] Shutting down gracefully...");
    await worker.close();     // Chờ jobs hiện tại xong rồi mới đóng
    worker = null;
    logger.info("[worker] Worker stopped");
  }
}

// Nếu chạy trực tiếp (npm run dev:worker)
const isDirectRun = process.argv[1]?.includes("ai-worker");
if (isDirectRun) {
  startWorker();

  // Graceful shutdown handlers
  const shutdown = async () => {
    await stopWorker();
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
