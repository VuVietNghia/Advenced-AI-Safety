import { aiClient } from "./core/aiClient.js";
import {
  getRecentMetrics,
  getSummary,
  getSummaryByModel,
  getSummaryByProvider
} from "./storage/database.js";
import { AIProvider, AICallOptions } from "./providers/types.js";

const demoCalls: AICallOptions[] = [
  {
    provider: AIProvider.LM_STUDIO,
    model: "local-model",
    prompt: "Explain cost monitoring for LLM applications in three bullets."
  },
  {
    provider: AIProvider.LM_STUDIO,
    model: "missing-local-model",
    prompt: "This call intentionally checks error tracking for a bad local model."
  },
  {
    provider: AIProvider.ZHIPU_API,
    model: "glm-4.5",
    prompt: "Write a short observability checklist for AI API calls."
  },
  {
    provider: AIProvider.ZHIPU_API,
    model: "glm-4.6",
    prompt: "Summarize why token usage and latency should be stored together."
  },
  {
    provider: AIProvider.ZHIPU_API,
    model: "glm-4.7",
    prompt: "Give one practical dashboard insight for LLM cost optimization."
  }
];

for (const call of demoCalls) {
  console.log(`\nCalling ${call.provider} / ${call.model}`);
  const response = await aiClient.chat(call);
  console.log(response.metrics.isError ? "ERROR" : "OK", {
    model: response.metrics.model,
    tokens: response.metrics.totalTokens,
    latencyMs: response.metrics.latencyMs,
    cost: response.metrics.estimatedCostUSD,
    message: response.metrics.errorMessage
  });
}

console.log("\nSummary");
console.table([getSummary()]);

console.log("\nBy Provider");
console.table(getSummaryByProvider());

console.log("\nBy Model");
console.table(getSummaryByModel());

console.log("\nRecent Calls");
console.table(
  getRecentMetrics(10).map((metric) => ({
    id: metric.id,
    provider: metric.provider,
    model: metric.model,
    tokens: metric.totalTokens,
    latencyMs: metric.latencyMs,
    cost: metric.estimatedCostUSD,
    isError: metric.isError
  }))
);
