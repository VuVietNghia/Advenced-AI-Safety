// ============================================================
//  INDEXER - Pha 1 của RAG Pipeline: Data Ingestion
//
//  Quy trình:
//  Documents → Chunking → Embedding → Vector Store
//
//  Chạy: npm run index
// ============================================================

import { SAMPLE_DOCUMENTS } from './data/documents.js';
import { chunkDocument, DEFAULT_CONFIGS, getChunkStats } from './chunker.js';
import { embed, checkConnection, EMBEDDING_MODEL } from './embedder.js';
import {
  addEntry,
  saveStore,
  clearStore,
  getStoreStats,
} from './vectorStore.js';
import type { ChunkingStrategy } from './types.js';

// -------------------------------------------------------
//  ANSI Colors cho terminal output đẹp hơn
// -------------------------------------------------------
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  bgBlue: '\x1b[44m',
  white: '\x1b[37m',
};

function print(msg: string) { process.stdout.write(msg + '\n'); }
function printBox(title: string, color = C.blue) {
  const line = '─'.repeat(60);
  print(`${color}${C.bold}┌${line}┐${C.reset}`);
  print(`${color}${C.bold}│  ${title.padEnd(57)}│${C.reset}`);
  print(`${color}${C.bold}└${line}┘${C.reset}`);
}

async function main() {
  print('');
  printBox('🚀 RAG INDEXER - Pha 1: Data Ingestion Pipeline', C.cyan);
  print('');

  // -------------------------------------------------------
  //  BƯỚC 0: Kiểm tra kết nối LM Studio
  // -------------------------------------------------------
  print(`${C.yellow}${C.bold}[BƯỚC 0] Kiểm tra kết nối LM Studio...${C.reset}`);
  print(`${C.dim}   Model: ${EMBEDDING_MODEL}${C.reset}`);
  print(`${C.dim}   URL:   http://localhost:1234/v1${C.reset}`);
  print('');

  const connected = await checkConnection();
  if (!connected) {
    print(`${C.red}${C.bold}❌ Không thể kết nối với LM Studio!${C.reset}`);
    print(`${C.yellow}   Hãy đảm bảo:${C.reset}`);
    print(`${C.dim}   1. LM Studio đang chạy${C.reset}`);
    print(`${C.dim}   2. Đã load model nomic-embed-text-v1.5${C.reset}`);
    print(`${C.dim}   3. Local Server đang bật (port 1234)${C.reset}`);
    process.exit(1);
  }
  print(`${C.green}✅ Kết nối thành công với LM Studio!${C.reset}\n`);

  // -------------------------------------------------------
  //  BƯỚC 1: Load Documents
  // -------------------------------------------------------
  print(`${C.yellow}${C.bold}[BƯỚC 1] 📄 Load Documents...${C.reset}`);
  print(`${C.dim}   Tổng số tài liệu: ${SAMPLE_DOCUMENTS.length}${C.reset}`);
  for (const doc of SAMPLE_DOCUMENTS) {
    print(`${C.dim}   • [${doc.category}] ${doc.title} (${doc.content.length} ký tự)${C.reset}`);
  }
  print('');

  // -------------------------------------------------------
  //  BƯỚC 2: Chunking - Thử cả 3 chiến lược
  // -------------------------------------------------------
  print(`${C.yellow}${C.bold}[BƯỚC 2] ✂️  Chunking - Chia nhỏ tài liệu...${C.reset}`);

  const strategies: ChunkingStrategy[] = ['fixed-size', 'sentence', 'recursive'];
  const strategyNames: Record<ChunkingStrategy, string> = {
    'fixed-size': 'Fixed-size (400 chars, 80 overlap)',
    'sentence':   'Sentence   (dấu câu, max 600 chars)',
    'recursive':  'Recursive  (đệ quy, 500 chars)',
  };

  // Sử dụng strategy 'sentence' để index (cân bằng tốt nhất)
  const PRIMARY_STRATEGY: ChunkingStrategy = 'sentence';
  const allChunks: ReturnType<typeof chunkDocument> = [];

  for (const strategy of strategies) {
    const strategyChunks = SAMPLE_DOCUMENTS.flatMap(doc =>
      chunkDocument(doc.content, doc.id, DEFAULT_CONFIGS[strategy])
    );

    const stats = getChunkStats(strategyChunks);
    const marker = strategy === PRIMARY_STRATEGY ? `${C.green}★ ` : `  `;

    print(`${marker}${C.cyan}${strategyNames[strategy]}${C.reset}`);
    print(`${C.dim}     → ${stats.count} chunks | avg: ${stats.avgLength} chars | min: ${stats.minLength} | max: ${stats.maxLength}${C.reset}`);

    if (strategy === PRIMARY_STRATEGY) {
      allChunks.push(...strategyChunks);
      // Cũng thêm fixed-size và recursive để demo comparison
      const fixedChunks = SAMPLE_DOCUMENTS.flatMap(doc =>
        chunkDocument(doc.content, doc.id, DEFAULT_CONFIGS['fixed-size'])
      );
      const recursiveChunks = SAMPLE_DOCUMENTS.flatMap(doc =>
        chunkDocument(doc.content, doc.id, DEFAULT_CONFIGS['recursive'])
      );
      allChunks.push(...fixedChunks, ...recursiveChunks);
    }
  }

  const totalChunks = allChunks.length;
  print('');
  print(`${C.green}   📦 Tổng chunks sẽ index (3 strategies × tài liệu): ${totalChunks}${C.reset}\n`);

  // -------------------------------------------------------
  //  BƯỚC 3: Embedding - Chuyển text thành vectors
  // -------------------------------------------------------
  print(`${C.yellow}${C.bold}[BƯỚC 3] 🔢 Embedding - Chuyển text thành vectors...${C.reset}`);
  print(`${C.dim}   Model: ${EMBEDDING_MODEL}${C.reset}`);
  print(`${C.dim}   Số chiều vector: 768D${C.reset}`);
  print(`${C.dim}   Đang xử lý ${totalChunks} chunks...\n${C.reset}`);

  clearStore();

  let processed = 0;
  const startTime = Date.now();

  for (const chunk of allChunks) {
    const embedding = await embed(chunk.text);
    addEntry(chunk, embedding);
    processed++;

    // Progress bar
    const percent = Math.round((processed / totalChunks) * 100);
    const filled = Math.round(percent / 5);
    const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
    process.stdout.write(`\r   [${bar}] ${percent}% (${processed}/${totalChunks})`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  print(`\n\n${C.green}✅ Hoàn thành embedding trong ${elapsed}s${C.reset}\n`);

  // -------------------------------------------------------
  //  BƯỚC 4: Lưu Vector Store
  // -------------------------------------------------------
  print(`${C.yellow}${C.bold}[BƯỚC 4] 💾 Lưu Vector Store...${C.reset}`);
  saveStore();

  const stats = getStoreStats();
  print(`${C.green}✅ Đã lưu vào vector_store.json${C.reset}`);
  print(`${C.dim}   Tổng entries: ${stats.total}${C.reset}`);
  print(`${C.dim}   Số chiều vector: ${stats.vectorDim}D${C.reset}`);
  print(`${C.dim}   Theo strategy:${C.reset}`);
  for (const [strategy, count] of Object.entries(stats.byStrategy)) {
    print(`${C.dim}     • ${strategy}: ${count} chunks${C.reset}`);
  }

  print('');
  printBox('✅ INDEXING HOÀN THÀNH! Chạy "npm run demo" để thử nghiệm.', C.green);
  print('');
}

main().catch(err => {
  console.error(`\n${C.red}❌ Lỗi:${C.reset}`, err.message);
  process.exit(1);
});
