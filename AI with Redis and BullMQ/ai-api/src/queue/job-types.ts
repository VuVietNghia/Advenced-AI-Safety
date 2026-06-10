export interface AiJobData {
  prompt: string;
  // Multi-turn conversation context
  messages?: { role: "user" | "assistant"; content: string }[];
}

export interface AiJobResult {
  answer: string;
  toolCallsUsed: number;
  toolNames: string[];
  fromCache: boolean;
  inputTokens: number;
  outputTokens: number;
}
