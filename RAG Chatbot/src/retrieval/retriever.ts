import { embedText } from "../embedding/embedder.js";
import { queryIndex } from "../embedding/store.js";
import type { ChunkMetadata } from "../embedding/store.js";
import dotenv from "dotenv";
dotenv.config();

export async function retrieveContext(query: string): Promise<ChunkMetadata[]> {
  const queryVector = await embedText(query);
  const topK = parseInt(process.env.TOP_K ?? "4", 10);
  return queryIndex(queryVector, topK);
}

export function formatContextForPrompt(chunks: ChunkMetadata[]): string {
  return chunks
    .map((c, i) => `[Source ${i + 1}: ${c.sourceFile}]\n${c.text}`)
    .join("\n\n");
}
