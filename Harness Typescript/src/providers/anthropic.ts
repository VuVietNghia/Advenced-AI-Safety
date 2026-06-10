import Anthropic from '@anthropic-ai/sdk';
import pRetry from 'p-retry';
import { BaseProvider } from './base.js';

export class AnthropicProvider extends BaseProvider {
  private client: Anthropic;
  private timeout: number;

  constructor(apiKey: string, baseUrl: string, model: string, timeout: number = 30000) {
    super("anthropic", model);
    this.timeout = timeout;

    const defaultHeaders: Record<string, string> = {};
    if (baseUrl.includes("roxane.one")) {
      defaultHeaders["Authorization"] = `Bearer ${apiKey}`;
    }

    this.client = new Anthropic({
      apiKey: apiKey,
      baseURL: baseUrl,
      defaultHeaders,
      timeout: this.timeout,
    });
  }

  async complete(messages: any[], options: any = {}): Promise<string> {
    const runComplete = async () => {
      // Map OpenAI messages format (used loosely in this framework) to Anthropic format if needed
      // Actually Anthropic requires `system` string at root and messages without system role.
      let systemPrompt: string | undefined = undefined;
      const filteredMessages = messages.filter(m => {
        if (m.role === "system") {
          systemPrompt = m.content;
          return false;
        }
        return true;
      });

      const params: Anthropic.MessageCreateParamsNonStreaming = {
        model: this.model,
        max_tokens: options.max_tokens || 1024,
        messages: filteredMessages,
      };

      if (systemPrompt) {
        params.system = systemPrompt;
      }

      const resp = await this.client.messages.create(params);
      
      // Handle Anthropic standard response
      if (resp.content && resp.content.length > 0 && resp.content[0].type === "text") {
        return resp.content[0].text;
      }
      
      // Fallback cho proxy roxane.one trả về cấu trúc OpenAI
      const anyResp = resp as any;
      if (anyResp.choices && anyResp.choices.length > 0) {
        return anyResp.choices[0].message?.content || "";
      }
      
      return JSON.stringify(resp);
    };

    return pRetry(runComplete, {
      retries: 3,
      minTimeout: 2000,
      maxTimeout: 10000,
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.complete([{ role: "user", content: "Hi" }], { max_tokens: 5 });
      return true;
    } catch (e) {
      console.log(`[${this.name}] Health check failed:`, (e as Error).message);
      return false;
    }
  }
}
