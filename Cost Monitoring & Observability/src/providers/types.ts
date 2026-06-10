export enum AIProvider {
  LM_STUDIO = "LM_STUDIO",
  ZHIPU_API = "ZHIPU_API"
}

export interface AICallOptions {
  prompt: string;
  provider: AIProvider;
  model?: string;
  userId?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface Metrics {
  provider: AIProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCostUSD: number | null;
  isError: boolean;
  errorMessage: string | null;
  timestamp: string;
  userId?: string;
}

export interface ProviderResponse {
  content: string;
  usage: TokenUsage;
}

export interface AIResponse extends ProviderResponse {
  metrics: Metrics;
}

export interface AIProviderClient {
  chat(options: AICallOptions): Promise<ProviderResponse>;
}
