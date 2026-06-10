import OpenAI from 'openai';
import pRetry from 'p-retry';
import { BaseProvider } from './base.js';

export class OpenAICompatProvider extends BaseProvider {
  private client: OpenAI;
  private timeout: number;

  constructor(apiKey: string, baseUrl: string, model: string, providerName: string, timeout: number = 30000) {
    super(providerName, model);
    this.timeout = timeout;

    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: baseUrl,
      timeout: this.timeout,
    });
  }

  async complete(messages: any[], options: any = {}): Promise<string> {
    const runComplete = async () => {
      const resp = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        max_tokens: options.max_tokens || 1024,
      });

      return resp.choices[0].message?.content || "";
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
