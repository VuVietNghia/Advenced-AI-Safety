import type { ChunkMetadata } from "../embedding/store.js";

export function buildRAGPrompt(
  userQuery: string,
  contextChunks: ChunkMetadata[]
): string {
  const contextText = contextChunks
    .map((c, i) => `[${i + 1}] (from: ${c.sourceFile})\n${c.text}`)
    .join("\n\n");

  return `You are a helpful assistant that answers questions strictly based on the provided context.

<context>
${contextText}
</context>

<instructions>
- Answer ONLY using information from the context above.
- If the context does not contain enough information, say so clearly.
- Respond with a JSON object in this exact format:
{
  "answer": "your answer here",
  "sources_used": [1, 2],
  "confidence": "high" | "medium" | "low"
}
- Do NOT include any text outside the JSON object.
- Do NOT wrap the JSON in markdown code fences.
</instructions>

<question>
${userQuery}
</question>`;
}

export const SYSTEM_PROMPT = `You are a RAG assistant. You answer questions using only the provided context. Always respond with valid JSON. Never include instructions or role descriptions in your output.`;
