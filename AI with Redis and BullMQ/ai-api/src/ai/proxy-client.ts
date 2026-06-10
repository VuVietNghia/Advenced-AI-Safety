import { env } from "../config/env.js";
import { logger } from "../logger/app-logger.js";
import type Anthropic from "@anthropic-ai/sdk";

// ─── Normalized response shape (Anthropic-compatible) ──────────────────────
export interface NormalizedResponse {
  stop_reason: "end_turn" | "tool_use" | "max_tokens" | string;
  content: Array<
    | { type: "text"; text: string }
    | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  >;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// ─── Request payload (Anthropic-format) ────────────────────────────────────
interface ProxyRequest {
  model: string;
  max_tokens: number;
  system?: string;
  tools?: Anthropic.Tool[];
  messages: Anthropic.MessageParam[];
}

/**
 * Gọi proxy llm-hub.roxane.one bằng fetch thuần.
 * Proxy nhận request theo chuẩn Anthropic nhưng trả response theo chuẩn OpenAI.
 * Hàm này chuẩn hóa response về dạng Anthropic để các phần còn lại của code không đổi.
 */
export async function callProxy(req: ProxyRequest): Promise<NormalizedResponse> {
  const url = `${env.ai.baseURL.replace(/\/$/, "")}/v1/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.ai.apiKey}`,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Proxy API error ${res.status}: ${errText}`);
  }

  const raw = await res.json() as any;

  // 🔍 Log raw response để debug
  logger.info(
    {
      hasContent: "content" in raw,
      hasChoices: "choices" in raw,
      stopReason: raw.stop_reason ?? raw.choices?.[0]?.finish_reason,
      rawKeys: Object.keys(raw),
    },
    "[proxy-client] Raw response shape"
  );

  // ── Chuẩn Anthropic: có field `content` ở root level ────────────────────
  if (Array.isArray(raw.content)) {
    return {
      stop_reason: raw.stop_reason ?? "end_turn",
      content: raw.content,
      usage: {
        input_tokens: raw.usage?.input_tokens ?? 0,
        output_tokens: raw.usage?.output_tokens ?? 0,
      },
    };
  }

  // ── OpenAI format: `choices[0].message` ─────────────────────────────────
  if (Array.isArray(raw.choices) && raw.choices.length > 0) {
    const choice = raw.choices[0];
    const message = choice.message ?? choice.delta ?? {};
    const finishReason: string = choice.finish_reason ?? "end_turn";

    const content: NormalizedResponse["content"] = [];

    // Text content
    if (typeof message.content === "string" && message.content.trim()) {
      content.push({ type: "text", text: message.content });
    }

    // Tool calls (OpenAI style)
    if (Array.isArray(message.tool_calls)) {
      for (const tc of message.tool_calls) {
        let parsedInput: Record<string, unknown> = {};
        try {
          parsedInput = typeof tc.function?.arguments === "string"
            ? JSON.parse(tc.function.arguments)
            : tc.function?.arguments ?? {};
        } catch {
          parsedInput = { raw: tc.function?.arguments };
        }
        content.push({
          type: "tool_use",
          id: tc.id ?? `tool_${Date.now()}`,
          name: tc.function?.name ?? "unknown",
          input: parsedInput,
        });
      }
    }

    // Map OpenAI finish_reason → Anthropic stop_reason
    const stopReasonMap: Record<string, string> = {
      stop: "end_turn",
      end_turn: "end_turn",
      tool_calls: "tool_use",
      length: "max_tokens",
    };
    const normalizedStopReason = stopReasonMap[finishReason] ?? finishReason;

    return {
      stop_reason: content.some((b) => b.type === "tool_use") ? "tool_use" : normalizedStopReason,
      content,
      usage: {
        input_tokens: raw.usage?.prompt_tokens ?? 0,
        output_tokens: raw.usage?.completion_tokens ?? 0,
      },
    };
  }

  // Fallback: không nhận ra format
  logger.warn({ raw: JSON.stringify(raw).slice(0, 500) }, "[proxy-client] Unknown response format");
  return {
    stop_reason: "end_turn",
    content: [],
    usage: { input_tokens: 0, output_tokens: 0 },
  };
}
