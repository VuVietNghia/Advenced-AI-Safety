import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

export interface ChunkMetadata {
  text: string;
  sourceFile: string;
  chunkIndex: number;
}

let qdrantClient: QdrantClient | null = null;

function getClient(): QdrantClient {
  if (!qdrantClient) {
    qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL ?? "http://localhost:6333",
    });
  }
  return qdrantClient;
}

const COLLECTION_NAME = process.env.QDRANT_COLLECTION ?? "rag_chunks";

export async function initIndex(): Promise<void> {
  const client = getClient();
  const collections = await client.getCollections();
  const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

  if (!exists) {
    const vectorSize = parseInt(process.env.EMBED_VECTOR_SIZE ?? "1024", 10);
    console.log(`[store] Creating Qdrant collection '${COLLECTION_NAME}' with size ${vectorSize}...`);
    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: vectorSize,
        distance: "Cosine",
      },
    });

    // Create payload index for fast deletion by sourceFile
    await client.createPayloadIndex(COLLECTION_NAME, {
      field_name: "sourceFile",
      field_schema: "keyword",
      wait: true,
    });
  }
}

function generateId(sourceFile: string, chunkIndex: number): string {
  // Qdrant ID must be UUID or uint64. We generate UUID v5-like string or just a simple UUID from hash
  const hash = crypto.createHash("md5").update(`${sourceFile}_${chunkIndex}`).digest("hex");
  // format as UUID: 8-4-4-4-12
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

export async function upsertChunk(
  vector: number[],
  metadata: ChunkMetadata
): Promise<void> {
  const id = generateId(metadata.sourceFile, metadata.chunkIndex);
  await getClient().upsert(COLLECTION_NAME, {
    wait: true,
    points: [
      {
        id,
        vector,
        payload: metadata as any,
      },
    ],
  });
}

export async function queryIndex(
  vector: number[],
  topK: number
): Promise<ChunkMetadata[]> {
  const results = await getClient().search(COLLECTION_NAME, {
    vector,
    limit: topK,
    with_payload: true,
  });

  return results.map((r) => r.payload as unknown as ChunkMetadata);
}

export async function deleteBySourceFile(sourceFile: string): Promise<void> {
  console.log(`[store] Deleting existing chunks for ${sourceFile}...`);
  await getClient().delete(COLLECTION_NAME, {
    wait: true,
    filter: {
      must: [
        {
          key: "sourceFile",
          match: {
            value: sourceFile,
          },
        },
      ],
    },
  });
}
