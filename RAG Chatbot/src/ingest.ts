import { loadDocumentsFromDir } from "./ingestion/loader.js";
import { chunkDocument, chunkMarkdown } from "./ingestion/chunker.js";
import { embedBatch } from "./embedding/embedder.js";
import { initIndex, upsertChunk, deleteBySourceFile } from "./embedding/store.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

async function main() {
  const docsPath = path.resolve(process.env.DOCS_PATH!);
  const chunkSize = parseInt(process.env.CHUNK_SIZE ?? "512", 10);
  const overlap = parseInt(process.env.CHUNK_OVERLAP ?? "64", 10);

  console.log(`[ingest] Loading documents from ${docsPath}...`);
  const documents = await loadDocumentsFromDir(docsPath);
  console.log(`[ingest] Loaded ${documents.length} document(s)`);

  await initIndex();

  for (const doc of documents) {
    console.log(`[ingest] Processing: ${doc.filename}`);
    await deleteBySourceFile(doc.filename);
    const chunks = doc.extension === "md"
      ? chunkMarkdown(doc.content, doc.filename, chunkSize)
      : chunkDocument(doc.content, doc.filename, chunkSize, overlap);
    console.log(`[ingest] ${chunks.length} chunks created`);

    // Batch embed all chunks from this document
    const texts = chunks.map((c) => c.text);
    const vectors = await embedBatch(texts);

    for (let i = 0; i < chunks.length; i++) {
      await upsertChunk(vectors[i], {
        text: chunks[i].text,
        sourceFile: chunks[i].sourceFile,
        chunkIndex: chunks[i].chunkIndex,
      });
    }

    console.log(`[ingest] Stored ${chunks.length} vectors for ${doc.filename}`);
  }

  console.log("[ingest] Done.");
}

main().catch(console.error);
