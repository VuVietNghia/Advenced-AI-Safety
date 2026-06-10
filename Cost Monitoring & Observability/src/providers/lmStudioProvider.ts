import OpenAI from "openai";
import { settings } from "../config/settings.js";
import {
  AICallOptions,
  AIProviderClient,
  ProviderResponse
} from "./types.js";
import { estimateTokens } from "../core/metricsCollector.js";

export class LMStudioProvider implements AIProviderClient {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      baseURL: settings.LM_STUDIO_BASE_URL,
      apiKey: "lm-studio"
    });
  }

  async chat(options: AICallOptions): Promise<ProviderResponse> {
    const model = options.model?.trim() || "local-model";
    const response = await this.client.chat.completions.create({
      model,
      messages: [{ role: "user", content: options.prompt }],
      max_tokens: options.maxTokens ?? 1024,
      temperature: options.temperature ?? 0.7
    });

    const content = response.choices[0]?.message?.content ?? "";
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
