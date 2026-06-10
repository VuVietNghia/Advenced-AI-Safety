import { checkInput } from "./safety/inputGuard.js";
import { validateOutput } from "./safety/outputGuard.js";
import { retrieveContext } from "./retrieval/retriever.js";
import { buildRAGPrompt, SYSTEM_PROMPT } from "./llm/promptBuilder.js";
import { callLLM } from "./llm/provider.js";

export interface ChatResult {
  answer: string;
  sources: string[];
  confidence: string;
  blocked?: string;
}

export async function chat(rawUserQuery: string): Promise<ChatResult> {
  // Step 1: Input guard
  const guardResult = checkInput(rawUserQuery);
  if (!guardResult.safe) {
    return {
      answer: `[Blocked] ${guardResult.reason ?? "Query not allowed."}`,
      sources: [],
      confidence: "low",
      blocked: guardResult.reason,
    };
  }

  // Step 2: Retrieve relevant context
  const contextChunks = await retrieveContext(guardResult.sanitized);

  if (contextChunks.length === 0) {
    return {
      answer: "No relevant documents found for your query.",
      sources: [],
      confidence: "low",
    };
  }

  // Step 3: Build prompt with context
  const prompt = buildRAGPrompt(guardResult.sanitized, contextChunks);

  let rawOutput: string;
  try {
    rawOutput = await callLLM(SYSTEM_PROMPT, prompt, "lmstudio");
  } catch (err) {
    console.warn(`[provider] LM Studio failed (${(err as Error).message}), falling back to Anthropic...`);
    rawOutput = await callLLM(SYSTEM_PROMPT, prompt, "anthropic");
  }

  // Step 5: Output guard
  const validation = validateOutput(rawOutput, contextChunks.length);
  if (!validation.valid || !validation.output) {
    console.error("[output guard] Validation failed:", validation.error);
    return {
      answer: "Response validation failed. Please try again.",
      sources: [],
      confidence: "low",
    };
  }

  const { answer, sources_used, confidence } = validation.output;
  const sources = sources_used.map(
    (i) => contextChunks[i - 1]?.sourceFile ?? "unknown"
  );

  return { answer, sources, confidence };
}
