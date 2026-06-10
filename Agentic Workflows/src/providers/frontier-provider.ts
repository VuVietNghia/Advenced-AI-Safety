import OpenAI from "openai/index.mjs";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/chat/completions.mjs";
import type { LLMProvider, LLMResponse, Message, ToolDefinition } from "./types.js";

export class FrontierProvider implements LLMProvider {
  private readonly client: OpenAI;

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly baseUrl: string
  ) {
    this.client = new OpenAI({
      apiKey,
      baseURL: baseUrl
    });
  }

  async chat(messages: Message[], tools: ToolDefinition[] = []): Promise<LLMResponse> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(toOpenAIMessage),
      tools: tools.length > 0 ? tools.map(toOpenAITool) : undefined,
      tool_choice: tools.length > 0 ? "auto" : undefined,
      temperature: 0.2
    });

    const choice = response.choices[0];
    const message = choice?.message;
    const toolCalls = message?.tool_calls ?? [];

    return {
      text: typeof message?.content === "string" ? message.content : null,
      toolCalls: toolCalls.map((toolCall) => ({
        toolName: toolCall.function.name,
        toolInput: parseJsonObject(toolCall.function.arguments)
      })),
      stopReason: toolCalls.length > 0 ? "tool_use" : choice?.finish_reason === "length" ? "max_tokens" : "end_turn"
    };
  }
}

function toOpenAIMessage(message: Message): ChatCompletionMessageParam {
  if (message.role === "tool") {
    return {
      role: "tool",
      content: message.content,
      tool_call_id: message.name ?? "tool_result"
    };
  }

  return {
    role: message.role,
    content: message.content
  } as ChatCompletionMessageParam;
}

function toOpenAITool(tool: ToolDefinition): ChatCompletionTool {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  };
}

function parseJsonObject(raw: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}
