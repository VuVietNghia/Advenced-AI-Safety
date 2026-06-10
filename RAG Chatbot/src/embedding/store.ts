import { LocalIndex } from "vectra";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export interface ChunkMetadata {
  text: string;
  sourceFile: string;
  chunkIndex: number;
}

let index: LocalIndex | null = null;

function getIndex(): LocalIndex {
  if (!index) {
    const indexPath = path.resolve(process.env.VECTOR_INDEX_PATH!);
    if (!fs.existsSync(indexPath)) {
      fs.mkdirSync(indexPath, { recursive: true });
    }
    index = new LocalIndex(indexPath);
  }
  return index;
}

export async function initIndex(): Promise<void> {
  const idx = getIndex();
  if (!(await idx.isIndexCreated())) {
    await idx.createIndex();
  }
}

export async function upsertChunk(
  vector: number[],
  metadata: ChunkMetadata
): Promise<void> {
  await getIndex().insertItem({ vector, metadata: metadata as any });
}

export async function queryIndex(
  vector: number[],
  topK: number
): Promise<ChunkMetadata[]> {
  // vectra v0.15 signature: queryItems(vector, query, topK, filter, isBm25)
  const results = await getIndex().queryItems(vector, "", topK);
  return results.map((r) => r.item.metadata as unknown as ChunkMetadata);
}
