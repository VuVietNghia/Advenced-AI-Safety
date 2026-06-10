import { calculateCostUSD } from "./costCalculator.js";
import { AIProvider, Metrics, TokenUsage } from "../providers/types.js";

interface MetricsInput {
  provider: AIProvider;
  model: string;
  usage?: Partial<TokenUsage>;
  latencyMs: number;
  isError?: boolean;
  errorMessage?: string | null;
  userId?: string;
}

export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.trim().length / 4));
}

export function collectMetrics(input: MetricsInput): Metrics {
  const promptTokens = Math.max(0, input.usage?.promptTokens ?? 0);
  const completionTokens = Math.max(0, input.usage?.completionTokens ?? 0);
  const totalTokens = Math.max(
    0,
    input.usage?.totalTokens ?? promptTokens + completionTokens
  );

  return {
    provider: input.provider,
    model: input.model,
    promptTokens,
    completionTokens,
    totalTokens,
    latencyMs: input.latencyMs,
    estimatedCostUSD: calculateCostUSD(
      input.provider,
      input.model,
      promptTokens,
      completionTokens
    ),
    isError: Boolean(input.isError),
    errorMessage: input.errorMessage ?? null,
    timestamp: new Date().toISOString(),
    userId: input.userId
  };
}
