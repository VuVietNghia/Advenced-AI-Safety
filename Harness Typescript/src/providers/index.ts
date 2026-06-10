import { getEnv } from '../config.js';
import { BaseProvider } from './base.js';
import { AnthropicProvider } from './anthropic.js';
import { OpenAICompatProvider } from './openai-compat.js';

export const REGISTRY: Record<string, BaseProvider> = {
  claude: new AnthropicProvider(
    getEnv("ANTHROPIC_AUTH_TOKEN", "user-1779871750268-key"),
    getEnv("ANTHROPIC_BASE_URL", "https://llm-hub.roxane.one"),
    getEnv("ANTHROPIC_DEFAULT_HAIKU_MODEL", "glm-4.5")
  ),
  claude_judge: new AnthropicProvider(
    getEnv("ANTHROPIC_AUTH_TOKEN", "user-1779871750268-key"),
    getEnv("ANTHROPIC_BASE_URL", "https://llm-hub.roxane.one"),
    getEnv("ANTHROPIC_DEFAULT_SONNET_MODEL", "glm-4.6")
  ),
  lm_studio: new OpenAICompatProvider(
    "lm-studio",
    getEnv("LM_STUDIO_BASE_URL", "http://localhost:1234/v1"),
    getEnv("LM_STUDIO_MODEL", "local-model"),
    "lm_studio"
  ),
  openrouter: new OpenAICompatProvider(
    getEnv("OPENROUTER_API_KEY", "not_provided") || "not_provided",
    "https://openrouter.ai/api/v1",
    "mistralai/mistral-7b-instruct",
    "openrouter"
  ),
  groq: new OpenAICompatProvider(
    getEnv("GROQ_API_KEY", "not_provided") || "not_provided",
    "https://api.groq.com/openai/v1",
    "llama-3.1-8b-instant",
    "groq"
  )
};
