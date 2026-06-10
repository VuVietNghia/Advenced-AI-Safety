import OpenAI from "openai";
import { settings } from "../config/settings.js";
import {
  AICallOptions,
  AIProviderClient,
  ProviderResponse
} from "./types.js";
import { estimateTokens } from "../core/metricsCollector.js";

export class ZhipuProvider implements AIProviderClient {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: settings.ANTHROPIC_AUTH_TOKEN || "missing-api-key",
      baseURL: settings.ANTHROPIC_BASE_URL.replace(/\/+$/, "") + "/v1"
    });
  }

  async chat(options: AICallOptions): Promise<ProviderResponse> {
    const model = options.model?.trim() || settings.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    const response = await this.client.chat.completions.create({
      model,
      messages: [{ role: "user", content: options.prompt }],
      max_tokens: options.maxTokens ?? 1024,
      temperature: options.temperature ?? 0.7
    });

    const content = response.choices?.[0]?.message?.content ?? "";
    const promptTokens =
      response.usage?.prompt_tokens ?? estimateTokens(options.prompt);
    const completionTokens =
      response.usage?.completion_tokens ?? estimateTokens(content);

    return {
      content,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens:
          response.usage?.total_tokens ?? promptTokens + completionTokens
      }
    };
  }
}

