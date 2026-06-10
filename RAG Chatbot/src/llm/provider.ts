import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const lmStudio = new OpenAI({
  baseURL: process.env.LMSTUDIO_BASE_URL!,
  apiKey: process.env.LMSTUDIO_API_KEY!,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN!,
  baseURL: process.env.ANTHROPIC_BASE_URL!,
});

export type Provider = "lmstudio" | "anthropic";

// Retry wrapper with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      console.warn(`[retry] Attempt ${attempt + 1} failed:`, lastError.message);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  provider: Provider = "lmstudio"
): Promise<string> {
  if (provider === "lmstudio") {
    return withRetry(async () => {
      const response = await lmStudio.chat.completions.create({
        model: process.env.LMSTUDIO_CHAT_MODEL!,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1, // Low temp for factual RAG responses
        max_tokens: 1024,
      });
      return response.choices[0].message.content ?? "";
    });
  }

  if (provider === "anthropic") {
    return withRetry(async () => {
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL!,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });
      
      // Proxy llm-hub.roxane.one returns OpenAI format despite accepting Anthropic requests
      if ((response as any).choices?.length > 0) {
        return (response as any).choices[0].message?.content ?? "";
      }

      // Standard Anthropic fallback
      if (response.content && response.content.length > 0) {
        const block = response.content[0];
        return block.type === "text" ? block.text : "";
      }
      return "";
    });
  }

  throw new Error(`Unknown provider: ${provider}`);
}
