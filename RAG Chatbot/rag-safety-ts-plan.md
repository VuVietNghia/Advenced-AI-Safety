# RAG Chatbot with Safety Layers — TypeScript Implementation Plan

## Overview

Build a RAG (Retrieval-Augmented Generation) chatbot over a document corpus with full safety layers.
Runtime: Node.js 20+ / TypeScript / tsx
LLM backend: LM Studio (localhost:1234/v1) as primary, Anthropic API as fallback.

### Required components (all must be implemented)
1. Document ingestion pipeline (PDF, TXT, MD)
2. Embedding storage via local vector index
3. Retrieval pipeline with similarity search
4. Prompt injection defense (input guard)
5. Output validation (output guard)

---

## Prerequisites

- Node.js 20+ installed
- LM Studio running at `http://localhost:1234`
- LM Studio has two models loaded:
  - An embedding model (recommended: `nomic-embed-text-v1.5` or `mxbai-embed-large-v1`)
  - A chat model (e.g. `qwen2.5-9b-instruct` or `gemma-3-4b-it`)
- Anthropic API key in `.env` (optional fallback)
- `AVOID @xenova/transformers` — causes 100% CPU/RAM on this machine

---

## Project Setup

### 1. Initialize project

```bash
mkdir rag-chatbot && cd rag-chatbot
npm init -y
npm install openai @anthropic-ai/sdk vectra pdf-parse zod dotenv
npm install -D tsx typescript @types/node @types/pdf-parse
npx tsc --init
```

### 2. tsconfig.json (override generated)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3. package.json scripts

Add to `scripts`:
```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx src/main.ts",
    "ingest": "tsx src/ingest.ts",
    "chat": "tsx src/main.ts"
  }
}
```

### 4. .env file

```env
LMSTUDIO_BASE_URL=http://localhost:1234/v1
LMSTUDIO_API_KEY=lm-studio
LMSTUDIO_CHAT_MODEL=qwen2.5-9b-instruct
LMSTUDIO_EMBED_MODEL=nomic-embed-text-v1.5

ANTHROPIC_AUTH_TOKEN=user-1779871750268-key
ANTHROPIC_BASE_URL=https://llm-hub.roxane.one
ANTHROPIC_DEFAULT_HAIKU_MODEL=glm-4.5
ANTHROPIC_DEFAULT_SONNET_MODEL=glm-4.6
ANTHROPIC_DEFAULT_OPUS_MODEL=glm-4.7

VECTOR_INDEX_PATH=./data/index
DOCS_PATH=./data/docs

CHUNK_SIZE=512
CHUNK_OVERLAP=64
TOP_K=4
```

---

## Directory Structure

```
rag-chatbot/
├── src/
│   ├── ingestion/
│   │   ├── loader.ts          # Read PDF, TXT, MD files from disk
│   │   └── chunker.ts         # Split text into overlapping chunks
│   ├── embedding/
│   │   ├── embedder.ts        # Call LM Studio /embeddings endpoint
│   │   └── store.ts           # vectra LocalIndex: upsert + query
│   ├── retrieval/
│   │   └── retriever.ts       # Embed query → search index → top-k chunks
│   ├── safety/
│   │   ├── inputGuard.ts      # Prompt injection detection + sanitization
│   │   └── outputGuard.ts     # Zod schema validation + grounding check
│   ├── llm/
│   │   ├── promptBuilder.ts   # Assemble final prompt with context
│   │   └── provider.ts        # LM Studio / Anthropic provider abstraction
│   ├── chatbot.ts             # Main orchestration: glues all modules
│   ├── ingest.ts              # CLI entry: run ingestion pipeline
│   └── main.ts                # CLI entry: interactive chat loop
├── data/
│   ├── docs/                  # Place source documents here (.pdf, .txt, .md)
│   └── index/                 # vectra will write index files here (auto-created)
├── .env
├── package.json
└── tsconfig.json
```

---

## Module Implementations

### src/ingestion/loader.ts

Reads documents from disk. Supports PDF, TXT, and MD.

```typescript
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

export interface RawDocument {
  filename: string;
  content: string;
  extension: string;
}

export async function loadDocumentsFromDir(dirPath: string): Promise<RawDocument[]> {
  const files = fs.readdirSync(dirPath);
  const docs: RawDocument[] = [];

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const ext = path.extname(file).toLowerCase();

    if (ext === ".pdf") {
      const buffer = fs.readFileSync(fullPath);
      const parsed = await pdfParse(buffer);
      docs.push({ filename: file, content: parsed.text, extension: "pdf" });
    } else if (ext === ".txt" || ext === ".md") {
      const content = fs.readFileSync(fullPath, "utf-8");
      docs.push({ filename: file, content, extension: ext.slice(1) });
    }
    // Silently skip unsupported formats
  }

  return docs;
}
```

---

### src/ingestion/chunker.ts

Splits text into fixed-size chunks with overlap. No external dependency.

```typescript
export interface TextChunk {
  text: string;
  sourceFile: string;
  chunkIndex: number;
}

export function chunkDocument(
  content: string,
  sourceFile: string,
  chunkSize = 512,
  overlap = 64
): TextChunk[] {
  // Normalize whitespace before chunking
  const normalized = content.replace(/\s+/g, " ").trim();
  const chunks: TextChunk[] = [];
  let start = 0;
  let index = 0;

  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length);
    const text = normalized.slice(start, end).trim();

    if (text.length > 0) {
      chunks.push({ text, sourceFile, chunkIndex: index++ });
    }

    if (end === normalized.length) break;
    start += chunkSize - overlap;
  }

  return chunks;
}
```

---

### src/embedding/embedder.ts

Calls LM Studio embedding endpoint via the `openai` package.
LM Studio requires a non-empty API key string (any value works).

```typescript
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  baseURL: process.env.LMSTUDIO_BASE_URL!,
  apiKey: process.env.LMSTUDIO_API_KEY!, // Required even if unused by LM Studio
});

export async function embedText(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: process.env.LMSTUDIO_EMBED_MODEL!,
    input: text,
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[], batchSize = 100): Promise<number[][]> {
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await client.embeddings.create({
      model: process.env.LMSTUDIO_EMBED_MODEL!,
      input: batch,
    });
    allEmbeddings.push(...response.data.map((item) => item.embedding));
  }

  return allEmbeddings;
}
```

---

### src/embedding/store.ts

Wraps vectra `LocalIndex` for upsert and query operations.
Index is persisted to disk at `VECTOR_INDEX_PATH`.

```typescript
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
  await getIndex().insertItem({ vector, metadata });
}

export async function queryIndex(
  vector: number[],
  topK: number
): Promise<ChunkMetadata[]> {
  const results = await getIndex().queryItems(vector, topK);
  return results.map((r) => r.item.metadata as ChunkMetadata);
}
```

---

### src/retrieval/retriever.ts

Embeds the (sanitized) user query and retrieves top-k matching chunks.

```typescript
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
```

---

### src/safety/inputGuard.ts

Detects and blocks prompt injection attempts before the query reaches the LLM.
Optimized for small local models: pattern-based, not model-based.

```typescript
export interface InputGuardResult {
  safe: boolean;
  reason?: string;
  sanitized: string;
}

// Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+instructions/i,
  /forget\s+(everything|all|your\s+instructions)/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /act\s+as\s+(if\s+you\s+are|a|an)\s+/i,
  /new\s+system\s+prompt/i,
  /\[SYSTEM\]/i,
  /\[INST\]/i,
  /<\|system\|>/i,
  /jailbreak/i,
  /DAN\s+mode/i,
  /developer\s+mode/i,
];

// Patterns for clearly harmful intent (block entirely)
const BLOCK_PATTERNS: RegExp[] = [
  /how\s+to\s+(make|build|create)\s+(bomb|weapon|malware|virus)/i,
  /generate\s+(malware|ransomware|exploit)/i,
];

const MAX_QUERY_LENGTH = 1000;

// Normalize unicode tricks to prevent injection bypass
function normalizeForSafety(text: string): string {
  return text
    .normalize("NFKD")                       // Decompose unicode
    .replace(/[\u200B-\u200F\uFEFF]/g, "")   // Strip zero-width chars
    .replace(/[\u0300-\u036f]/g, "");          // Strip combining diacritics
}

export function checkInput(rawQuery: string): InputGuardResult {
  // Normalize unicode tricks before checking patterns
  const normalized = normalizeForSafety(rawQuery);

  // Length check
  if (normalized.length > MAX_QUERY_LENGTH) {
    return {
      safe: false,
      reason: "Query exceeds maximum length",
      sanitized: rawQuery.slice(0, MAX_QUERY_LENGTH),
    };
  }

  // Hard block
  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        safe: false,
        reason: "Query matches blocked content pattern",
        sanitized: "",
      };
    }
  }

  // Injection detection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        safe: false,
        reason: `Potential prompt injection detected`,
        sanitized: "",
      };
    }
  }

  // Basic sanitization: strip XML/HTML tags to prevent tag injection
  const sanitized = rawQuery
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s.,!?;:()\-'"àáâãèéêìíòóôõùúăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return { safe: true, sanitized };
}
```

---

### src/safety/outputGuard.ts

Validates LLM output format and performs a basic grounding check.
Uses `zod` for schema enforcement.

```typescript
import { z } from "zod";

// Define expected LLM output structure
// The prompt builder must instruct the LLM to respond in this JSON format
export const LLMOutputSchema = z.object({
  answer: z.string().min(1).max(3000),
  sources_used: z.array(z.number()).min(0), // indices of context sources actually used
  confidence: z.enum(["high", "medium", "low"]),
});

export type LLMOutput = z.infer<typeof LLMOutputSchema>;

export interface OutputGuardResult {
  valid: boolean;
  output?: LLMOutput;
  error?: string;
  rawText?: string;
}

// Forbidden phrases in output (hallucination / leakage indicators)
const FORBIDDEN_OUTPUT_PATTERNS: RegExp[] = [
  /as\s+an\s+AI\s+language\s+model/i,
  /I\s+don't\s+have\s+access\s+to\s+real[\s-]time/i,
  /my\s+training\s+data/i,
];

// Extract JSON from mixed text output (fallback for small models)
function extractJSON(raw: string): string {
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) return match[0];

  // Last resort: wrap plain text as structured response
  return JSON.stringify({
    answer: raw.trim(),
    sources_used: [],
    confidence: "low",
  });
}

export function validateOutput(rawOutput: string, numContextChunks: number): OutputGuardResult {
  // Strip markdown code fences if LLM wraps JSON in ```
  const cleaned = rawOutput.replace(/```(?:json)?\s*/g, "").replace(/```/g, "").trim();

  // Attempt JSON parse with fallback extraction
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    try {
      parsed = JSON.parse(extractJSON(cleaned));
    } catch {
      return {
        valid: false,
        error: "Output is not valid JSON",
        rawText: rawOutput,
      };
    }
  }

  // Zod schema validation
  const result = LLMOutputSchema.safeParse(parsed);
  if (!result.success) {
    return {
      valid: false,
      error: `Schema validation failed: ${result.error.message}`,
      rawText: rawOutput,
    };
  }

  // Forbidden pattern check on the answer text
  for (const pattern of FORBIDDEN_OUTPUT_PATTERNS) {
    if (pattern.test(result.data.answer)) {
      return {
        valid: false,
        error: "Output contains forbidden pattern",
        rawText: rawOutput,
      };
    }
  }

  // Grounding check: verify source indices are within valid range
  for (const idx of result.data.sources_used) {
    if (idx < 1 || idx > numContextChunks) {
      return {
        valid: false,
        error: `Source index ${idx} out of range [1..${numContextChunks}]`,
        rawText: rawOutput,
      };
    }
  }

  return { valid: true, output: result.data };
}
```

---

### src/llm/promptBuilder.ts

Assembles the final prompt with retrieved context.
Uses XML delimiters to separate context from query — more robust for small models.

```typescript
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
```

---

### src/llm/provider.ts

Provider abstraction. LM Studio is primary; Anthropic is fallback.

```typescript
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const lmStudio = new OpenAI({
  baseURL: process.env.LMSTUDIO_BASE_URL!,
  apiKey: process.env.LMSTUDIO_API_KEY!,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN!,
  baseURL: process.env.ANTHROPIC_BASE_URL!,
});

export type Provider = "lmstudio" | "anthropic";

// Retry wrapper with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      console.warn(`[retry] Attempt ${attempt + 1} failed:`, lastError.message);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  provider: Provider = "lmstudio"
): Promise<string> {
  if (provider === "lmstudio") {
    return withRetry(async () => {
      const response = await lmStudio.chat.completions.create({
        model: process.env.LMSTUDIO_CHAT_MODEL!,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1, // Low temp for factual RAG responses
        max_tokens: 1024,
      });
      return response.choices[0].message.content ?? "";
    });
  }

  if (provider === "anthropic") {
    return withRetry(async () => {
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL!,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });
      const block = response.content[0];
      return block.type === "text" ? block.text : "";
    });
  }

  throw new Error(`Unknown provider: ${provider}`);
}
```

---

### src/chatbot.ts

Main orchestration. Wires all modules into a single `chat()` function.

```typescript
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

  // Step 4: Call LLM (retry with Anthropic if LM Studio fails)
  let rawOutput: string;
  try {
    rawOutput = await callLLM(SYSTEM_PROMPT, prompt, "lmstudio");
  } catch (err) {
    console.warn("[provider] LM Studio failed, falling back to Anthropic:", err);
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
```

---

### src/ingest.ts

CLI script to run ingestion pipeline once (or re-run to add more docs).

```typescript
import { loadDocumentsFromDir } from "./ingestion/loader.js";
import { chunkDocument } from "./ingestion/chunker.js";
import { embedBatch } from "./embedding/embedder.js";
import { initIndex, upsertChunk } from "./embedding/store.js";
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
    const chunks = chunkDocument(doc.content, doc.filename, chunkSize, overlap);
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
```

---

### src/main.ts

Interactive CLI chat loop using `readline`.

```typescript
import readline from "readline";
import { chat } from "./chatbot.js";
import { initIndex } from "./embedding/store.js";

async function main() {
  await initIndex();
  console.log("RAG Chatbot ready. Type your question (Ctrl+C to exit).\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = () => {
    rl.question("You: ", async (input) => {
      const query = input.trim();
      if (!query) {
        ask();
        return;
      }

      try {
        const result = await chat(query);

        if (result.blocked) {
          console.log(`\n[BLOCKED] ${result.answer}\n`);
        } else {
          console.log(`\nBot: ${result.answer}`);
          console.log(`Sources: ${result.sources.join(", ") || "none"}`);
          console.log(`Confidence: ${result.confidence}\n`);
        }
      } catch (err) {
        console.error("[error]", err);
      }

      ask();
    });
  };

  ask();
}

main().catch(console.error);
```

---

## Build Order (Phases)

### Phase 1 — Core pipeline (no safety)
Goal: confirm data flows correctly end-to-end.

1. Implement `loader.ts` and `chunker.ts`
2. Place 1-2 test `.txt` files in `data/docs/`
3. Implement `embedder.ts` — verify LM Studio returns vectors
4. Implement `store.ts` — verify vectra writes/reads index
5. Implement `retriever.ts`
6. Run `npm run ingest` → confirm vectors stored
7. Write a quick test: call `retrieveContext("test query")` and log results
8. Confirm top-k chunks are relevant to the query

### Phase 2 — LLM integration
Goal: get coherent answers from the retrieved context.

1. Implement `promptBuilder.ts`
2. Implement `provider.ts` — test with LM Studio first
3. Implement basic `chatbot.ts` (no safety yet)
4. Run `npm run chat` — confirm answers are grounded in documents

### Phase 3 — Safety layers
Goal: block injections and validate output format.

1. Implement `inputGuard.ts`
2. Test with known injection phrases to confirm blocking
3. Implement `outputGuard.ts` with Zod schema
4. Update `chatbot.ts` to use both guards
5. Manually test edge cases:
   - Query that triggers input guard → should return blocked message
   - LLM returns malformed JSON → output guard catches it
   - Normal query → passes both guards cleanly

### Phase 4 — Polish
Goal: production-quality reliability.

1. Add retry logic in `provider.ts` (max 2 retries before fallback)
2. Add SQLite logging (optional — reuse observability work from previous sessions)
3. Add `--reindex` flag to `ingest.ts` to wipe and rebuild the index
4. Write evaluation: 5-10 sample Q&A pairs against test corpus, log pass rate

---

## Known Constraints and Notes

- `vectra` stores the entire index in memory when loaded. For large corpora (>50k chunks), consider switching to Qdrant with `@qdrant/js-client-rest`.
- `embedBatch` automatically splits large inputs into batches of 100 to avoid LM Studio timeout.
- LM Studio embedding endpoint uses the same `/v1/embeddings` path as OpenAI — the `openai` package works with no changes.
- The embedding model used during ingestion MUST match the model used during query. If the model changes, delete `data/index/` and re-run ingestion.
- `zod` schema validation will fail if the LLM omits the JSON wrapper. Adjust the system prompt and temperature if this happens frequently with a specific model.
- For Qwen 9B on this machine (RTX 4060 125W, 16GB RAM): temperature 0.1 recommended for deterministic JSON output.
