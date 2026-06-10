import { collectMetrics } from "./metricsCollector.js";
import { LMStudioProvider } from "../providers/lmStudioProvider.js";
import { ZhipuProvider } from "../providers/zhipuProvider.js";
import {
  AICallOptions,
  AIProvider,
  AIProviderClient,
  AIResponse
} from "../providers/types.js";
import { insertMetrics } from "../storage/database.js";
import { logMetrics } from "../storage/logger.js";
import { settings } from "../config/settings.js";

function getProviderClient(provider: AIProvider): AIProviderClient {
  if (provider === AIProvider.LM_STUDIO) {
    return new LMStudioProvider();
  }

  return new ZhipuProvider();
}

function defaultModelForProvider(provider: AIProvider, model?: string): string {
  if (model?.trim()) {
    return model.trim();
  }

  return provider === AIProvider.LM_STUDIO
    ? "local-model"
    : settings.ANTHROPIC_DEFAULT_HAIKU_MODEL;
}

export class AIClient {
  async chat(options: AICallOptions): Promise<AIResponse> {
    const model = defaultModelForProvider(options.provider, options.model);
    const startedAt = Date.now();

    try {
      const provider = getProviderClient(options.provider);
      const result = await provider.chat({ ...options, model });
      const metrics = collectMetrics({
        provider: options.provider,
        model,
        usage: result.usage,
        latencyMs: Date.now() - startedAt,
        userId: options.userId
      });

      insertMetrics(metrics);
      logMetrics(metrics);

      return { ...result, metrics };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const metrics = collectMetrics({
        provider: options.provider,
        model,
        latencyMs: Date.now() - startedAt,
        isError: true,
        errorMessage: message,
        userId: options.userId
      });

      insertMetrics(metrics);
      logMetrics(metrics);

      return {
        content: message,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        metrics
      };
    }
  }
}

export const aiClient = new AIClient();
