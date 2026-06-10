// ============================================================
//  DEMO TƯƠNG TÁC - Minh họa toàn bộ RAG Pipeline
//
//  Demo này giúp bạn THỰC HÀNH và THẤY TRỰC TIẾP từng bước:
//  1. So sánh các chiến lược chunking
//  2. Xem embeddings được tạo như thế nào
//  3. Quan sát cosine similarity scores
//  4. Thử nghiệm retrieval với các câu hỏi khác nhau
//
//  Chạy: npm run demo
// ============================================================

import * as readline from 'readline';
import { SAMPLE_DOCUMENTS } from './data/documents.js';
import { chunkDocument, DEFAULT_CONFIGS, getChunkStats } from './chunker.js';
import { embed, checkConnection, EMBEDDING_MODEL, EMBEDDING_DIM } from './embedder.js';
import {
  addEntry, search, clearStore, loadStore, saveStore,
  getStoreSize, getStoreStats, cosineSimilarity,
} from './vectorStore.js';
import type { ChunkingStrategy } from './types.js';

// ============================================================
//  ANSI COLORS & HELPERS
// ============================================================
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  white: '\x1b[37m',
  bgCyan: '\x1b[46m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m',
  bgMagenta: '\x1b[45m',
  bgYellow: '\x1b[43m',
};

const p = (msg = '') => process.stdout.write(msg + '\n');
const sep = (c = '═', n = 70) => p(C.dim + c.repeat(n) + C.reset);
const thinSep = (n = 70) => p(C.dim + '─'.repeat(n) + C.reset);

function header(title: string, color = C.cyan) {
  sep('═');
  p(`${color}${C.bold}  ${title}${C.reset}`);
  sep('═');
}

function box(text: string, color = C.blue) {
  const width = 66;
  const lines = text.split('\n');
  p(`${color}┌${'─'.repeat(width)}┐${C.reset}`);
  for (const line of lines) {
    p(`${color}│${C.reset} ${line.padEnd(width - 1)}${color}│${C.reset}`);
  }
  p(`${color}└${'─'.repeat(width)}┘${C.reset}`);
}

function scoreBar(score: number, width = 30): string {
  const filled = Math.round(score * width);
  const bar = '▓'.repeat(filled) + '░'.repeat(width - filled);
  const color = score >= 0.8 ? C.green : score >= 0.6 ? C.cyan : score >= 0.4 ? C.yellow : C.red;
  return `${color}${bar}${C.reset} ${color}${C.bold}${(score * 100).toFixed(1)}%${C.reset}`;
}

function vectorPreview(vec: number[], dims = 8): string {
  const preview = vec.slice(0, dims).map(v => v.toFixed(3));
  return `[${preview.join(', ')}, ... +${vec.length - dims} more]`;
}

// ============================================================
//  READLINE INTERFACE
// ============================================================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(`${C.cyan}${question}${C.reset}`, answer => resolve(answer.trim()));
  });
}

function pause(ms = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
//  MAIN DEMO
// ============================================================
async function main() {
  console.clear();

  // ─── WELCOME SCREEN ───────────────────────────────────────
  p('');
  sep('═');
  p(`${C.bgCyan}${C.bold}${'  RAG BASIC DEMO - Học Embeddings, Vector Search, Retrieval  '.padEnd(70)}${C.reset}`);
  p(`${C.dim}  Powered by: nomic-embed-text-v1.5 (LM Studio) + Cosine Similarity${C.reset}`);
  sep('═');
  p('');

  box(
    'Demo này sẽ minh họa TỪNG BƯỚC của RAG Pipeline:\n' +
    '  1. 📄 Documents → ✂️  Chunking Strategies\n' +
    '  2. 🔢 Text → Embedding Vectors (768D)\n' +
    '  3. 💾 Lưu vào Vector Store\n' +
    '  4. 🔍 Query → Cosine Similarity → Top-K Results\n' +
    '  5. 📊 So sánh các Chunking Strategies',
    C.cyan
  );
  p('');

  // ─── KIỂM TRA KẾT NỐI ─────────────────────────────────────
  p(`${C.yellow}${C.bold}⏳ Kiểm tra kết nối LM Studio...${C.reset}`);
  const connected = await checkConnection();

  if (!connected) {
    p('');
    box(
      '❌ KHÔNG THỂ KẾT NỐI VỚI LM STUDIO!\n\n' +
      'Để chạy demo, bạn cần:\n' +
      '  1. Mở LM Studio\n' +
      '  2. Tải model: nomic-ai/nomic-embed-text-v1.5\n' +
      '  3. Vào tab "Local Server" → bật server\n' +
      '  4. Đảm bảo server chạy ở port 1234\n' +
      '  5. Chạy lại: npm run demo',
      C.red
    );
    p('');
    rl.close();
    process.exit(1);
  }

  p(`${C.green}✅ Kết nối LM Studio thành công!${C.reset}`);
  p(`${C.dim}   Model: ${EMBEDDING_MODEL}${C.reset}`);
  p(`${C.dim}   Output: ${EMBEDDING_DIM} chiều vector${C.reset}`);
  p('');

  await ask(`${C.bold}Nhấn Enter để bắt đầu demo...${C.reset}`);

  // ============================================================
  //  DEMO 1: CHUNKING STRATEGIES
  // ============================================================
  console.clear();
  header('📚 PHẦN 1: CHUNKING STRATEGIES', C.magenta);
  p('');
  p(`${C.dim}Chúng ta có ${SAMPLE_DOCUMENTS.length} tài liệu mẫu về AI và RAG.${C.reset}`);
  p(`${C.dim}Hãy chọn một tài liệu để xem các chiến lược chunking khác nhau.${C.reset}`);
  p('');

  for (let i = 0; i < SAMPLE_DOCUMENTS.length; i++) {
    const doc = SAMPLE_DOCUMENTS[i];
    p(`  ${C.cyan}${i + 1}${C.reset}. ${C.bold}${doc.title}${C.reset} ${C.dim}(${doc.content.length} chars)${C.reset}`);
  }
  p('');

  const docChoice = await ask(`Chọn tài liệu (1-${SAMPLE_DOCUMENTS.length}): `);
  const docIndex = Math.max(0, Math.min(parseInt(docChoice) - 1 || 0, SAMPLE_DOCUMENTS.length - 1));
  const selectedDoc = SAMPLE_DOCUMENTS[docIndex];

  p('');
  thinSep();
  p(`${C.bold}📄 Tài liệu: ${selectedDoc.title}${C.reset}`);
  p(`${C.dim}${selectedDoc.content.slice(0, 200)}...${C.reset}`);
  thinSep();
  p('');

  const strategies: ChunkingStrategy[] = ['fixed-size', 'sentence', 'recursive'];
  const strategyLabels: Record<ChunkingStrategy, string> = {
    'fixed-size': '1. Fixed-size Chunking',
    'sentence':   '2. Sentence Chunking',
    'recursive':  '3. Recursive Chunking',
  };
  const strategyColors: Record<ChunkingStrategy, string> = {
    'fixed-size': C.blue,
    'sentence':   C.green,
    'recursive':  C.magenta,
  };

  for (const strategy of strategies) {
    const chunks = chunkDocument(selectedDoc.content, selectedDoc.id, DEFAULT_CONFIGS[strategy]);
    const stats = getChunkStats(chunks);
    const color = strategyColors[strategy];

    p(`${color}${C.bold}${strategyLabels[strategy]}${C.reset}`);

    // Giải thích
    if (strategy === 'fixed-size') {
      p(`${C.dim}   Chia theo kích thước cố định: ${DEFAULT_CONFIGS[strategy].chunkSize} chars, overlap: ${DEFAULT_CONFIGS[strategy].overlap} chars${C.reset}`);
    } else if (strategy === 'sentence') {
      p(`${C.dim}   Chia theo dấu câu (.!?), nhóm cho đến max ${DEFAULT_CONFIGS[strategy].chunkSize} chars${C.reset}`);
    } else {
      p(`${C.dim}   Đệ quy: \\n\\n → \\n → dấu câu → ký tự (target: ${DEFAULT_CONFIGS[strategy].chunkSize} chars)${C.reset}`);
    }

    p(`${color}   📊 ${stats.count} chunks | avg: ${stats.avgLength} | min: ${stats.minLength} | max: ${stats.maxLength} chars${C.reset}`);

    // Hiển thị 2 chunks đầu
    for (let i = 0; i < Math.min(2, chunks.length); i++) {
      p(`   ${C.dim}Chunk #${i}: "${chunks[i].text.slice(0, 100)}..."${C.reset}`);
    }
    p('');
  }

  await ask(`${C.bold}Nhấn Enter để xem demo Embeddings...${C.reset}`);

  // ============================================================
  //  DEMO 2: EMBEDDINGS - VISUALIZE VECTORS
  // ============================================================
  console.clear();
  header('🔢 PHẦN 2: EMBEDDING VECTORS', C.blue);
  p('');
  p(`${C.dim}Embedding model chuyển văn bản thành vector số học ${C.bold}${EMBEDDING_DIM} chiều${C.reset}.`);
  p(`${C.dim}Văn bản có nghĩa tương đồng → vectors nằm gần nhau trong không gian.${C.reset}`);
  p('');

  const embeddingExamples = [
    { text: 'RAG là gì?', label: 'Câu hỏi về RAG' },
    { text: 'Retrieval Augmented Generation là một kỹ thuật AI', label: 'Định nghĩa RAG' },
    { text: 'Hôm nay thời tiết đẹp', label: 'Câu không liên quan' },
  ];

  p(`${C.yellow}⏳ Đang tạo embeddings cho 3 câu ví dụ...${C.reset}`);
  const exampleVectors: number[][] = [];

  for (const example of embeddingExamples) {
    const vec = await embed(example.text);
    exampleVectors.push(vec);
    p(`   ${C.green}✓${C.reset} "${example.text}"`);
  }

  p('');
  thinSep();
  p(`${C.bold}📐 Kết quả Embedding Vectors:${C.reset}`);
  thinSep();

  for (let i = 0; i < embeddingExamples.length; i++) {
    const example = embeddingExamples[i];
    p(`${C.cyan}${C.bold}[${example.label}]${C.reset}`);
    p(`  Text: "${example.text}"`);
    p(`  Vector: ${C.yellow}${vectorPreview(exampleVectors[i])}${C.reset}`);
    p('');
  }

  p(`${C.bold}📐 Cosine Similarity Matrix:${C.reset}`);
  thinSep();

  for (let i = 0; i < embeddingExamples.length; i++) {
    for (let j = i + 1; j < embeddingExamples.length; j++) {
      const score = cosineSimilarity(exampleVectors[i], exampleVectors[j]);
      const label = `"${embeddingExamples[i].text.slice(0, 25)}" vs "${embeddingExamples[j].text.slice(0, 25)}"`;
      p(`  ${C.dim}${label}${C.reset}`);
      p(`    → ${scoreBar(score)}`);
      p('');
    }
  }

  await ask(`${C.bold}Nhấn Enter để build Vector Store...${C.reset}`);

  // ============================================================
  //  DEMO 3: BUILD VECTOR STORE
  // ============================================================
  console.clear();
  header('💾 PHẦN 3: XÂY DỰNG VECTOR STORE', C.green);
  p('');

  // Thử tải store đã có trước
  const alreadyIndexed = loadStore();
  let shouldReindex = true;

  if (alreadyIndexed) {
    const stats = getStoreStats();
    p(`${C.green}✅ Tìm thấy Vector Store sẵn có: ${stats.total} entries${C.reset}`);
    const ans = await ask(`Re-index lại không? (y/N): `);
    shouldReindex = ans.toLowerCase() === 'y';
    if (!shouldReindex) {
      p(`${C.dim}Sử dụng Vector Store sẵn có.${C.reset}`);
    }
  }

  if (shouldReindex) {
    clearStore();
    const allStrategies: ChunkingStrategy[] = ['fixed-size', 'sentence', 'recursive'];

    p(`${C.yellow}⚙️  Đang index ${SAMPLE_DOCUMENTS.length} tài liệu × 3 strategies...${C.reset}\n`);

    let totalProcessed = 0;
    for (const strategy of allStrategies) {
      const stratColor = strategyColors[strategy];
      p(`${stratColor}${C.bold}[${strategy}]${C.reset} Chunking & Embedding...`);

      const chunks = SAMPLE_DOCUMENTS.flatMap(doc =>
        chunkDocument(doc.content, doc.id, DEFAULT_CONFIGS[strategy])
      );

      for (let i = 0; i < chunks.length; i++) {
        const embedding = await embed(chunks[i].text);
        addEntry(chunks[i], embedding);
        totalProcessed++;

        const percent = Math.round(((i + 1) / chunks.length) * 100);
        const filled = Math.round(percent / 5);
        const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
        process.stdout.write(`\r  ${stratColor}[${bar}]${C.reset} ${percent}% (${i + 1}/${chunks.length})`);
      }
      p('');
      p(`  ${C.green}✓ ${chunks.length} chunks indexed${C.reset}\n`);
    }

    saveStore();
    p(`${C.green}${C.bold}✅ Vector Store đã lưu! Tổng: ${totalProcessed} vectors${C.reset}`);
  }

  await pause(500);
  const finalStats = getStoreStats();
  p('');
  box(
    `📊 VECTOR STORE STATS\n` +
    `  Tổng entries:    ${finalStats.total}\n` +
    `  Vector dimension: ${finalStats.vectorDim}D\n` +
    `  fixed-size chunks: ${finalStats.byStrategy['fixed-size'] ?? 0}\n` +
    `  sentence chunks:   ${finalStats.byStrategy['sentence'] ?? 0}\n` +
    `  recursive chunks:  ${finalStats.byStrategy['recursive'] ?? 0}`,
    C.green
  );

  await ask(`\n${C.bold}Nhấn Enter để thử Retrieval...${C.reset}`);

  // ============================================================
  //  DEMO 4: INTERACTIVE RETRIEVAL
  // ============================================================
  let continueDemo = true;

  while (continueDemo) {
    console.clear();
    header('🔍 PHẦN 4: RETRIEVAL - TÌM KIẾM NGỮ NGHĨA', C.cyan);
    p('');
    p(`${C.dim}Nhập câu hỏi bất kỳ. Hệ thống sẽ:${C.reset}`);
    p(`${C.dim}  1. Chuyển câu hỏi thành embedding vector${C.reset}`);
    p(`${C.dim}  2. Tính cosine similarity với ${getStoreSize()} vectors trong store${C.reset}`);
    p(`${C.dim}  3. Trả về các chunks có score cao nhất${C.reset}`);
    p('');
    p(`${C.dim}Câu hỏi gợi ý:${C.reset}`);
    p(`  ${C.cyan}1${C.reset}. RAG là gì và hoạt động như thế nào?`);
    p(`  ${C.cyan}2${C.reset}. Cosine similarity được tính như thế nào?`);
    p(`  ${C.cyan}3${C.reset}. Các chiến lược chunking nào phổ biến nhất?`);
    p(`  ${C.cyan}4${C.reset}. Cách sử dụng LM Studio cho embedding?`);
    p(`  ${C.cyan}5${C.reset}. So sánh các vector database`);
    p(`  ${C.cyan}6${C.reset}. [Nhập câu hỏi tự do]`);
    p(`  ${C.cyan}7${C.reset}. [Demo so sánh strategies]`);
    p(`  ${C.cyan}q${C.reset}. Thoát`);
    p('');

    const presetQueries: Record<string, string> = {
      '1': 'RAG là gì và hoạt động như thế nào?',
      '2': 'Cosine similarity được tính như thế nào?',
      '3': 'Các chiến lược chunking nào phổ biến nhất?',
      '4': 'Cách sử dụng LM Studio cho embedding?',
      '5': 'So sánh các vector database như Pinecone và ChromaDB',
    };

    const choice = await ask(`Chọn (1-7/q): `);

    if (choice.toLowerCase() === 'q') {
      continueDemo = false;
      break;
    }

    if (choice === '7') {
      // Demo so sánh strategies
      await demoCompareStrategies();
      await ask(`\n${C.bold}Nhấn Enter để tiếp tục...${C.reset}`);
      continue;
    }

    let query: string;
    if (presetQueries[choice]) {
      query = presetQueries[choice];
    } else if (choice === '6' || !presetQueries[choice]) {
      query = await ask(`Nhập câu hỏi của bạn: `);
      if (!query) continue;
    } else {
      query = presetQueries[choice] || choice;
    }

    // THỰC HIỆN RETRIEVAL
    p('');
    thinSep();
    p(`${C.yellow}${C.bold}🔍 Query: "${query}"${C.reset}`);
    thinSep();

    p(`\n${C.dim}⏳ Bước 1: Tạo embedding cho câu hỏi...${C.reset}`);
    const queryEmbedding = await embed(query);
    p(`${C.green}✓ Query embedding: ${vectorPreview(queryEmbedding)}${C.reset}`);

    p(`\n${C.dim}⏳ Bước 2: Tính cosine similarity với ${getStoreSize()} vectors...${C.reset}`);
    await pause(200);
    const results = search(queryEmbedding, 5, 0.0);
    p(`${C.green}✓ Tìm thấy ${results.length} kết quả có liên quan${C.reset}`);

    p(`\n${C.bold}📊 Top-5 Kết quả (theo cosine score):${C.reset}\n`);
    thinSep();

    for (const result of results) {
      const { chunk, score, rank } = result;
      const stratColor = strategyColors[chunk.strategy];

      p(`${C.bold}Rank #${rank}${C.reset}  ${stratColor}[${chunk.strategy}]${C.reset}  ${C.dim}source: ${chunk.source}  chunk: #${chunk.chunkIndex}${C.reset}`);
      p(`  Cosine Score: ${scoreBar(score, 30)}`);
      p(`  Preview: ${C.dim}"${chunk.text.slice(0, 200)}..."${C.reset}`);
      thinSep('·');
    }

    await ask(`\n${C.bold}Nhấn Enter để thử câu hỏi khác...${C.reset}`);
  }

  // ─── BYE ──────────────────────────────────────────────────
  console.clear();
  header('🎓 CẢM ƠN BẠN ĐÃ HỌC RAG CÙNG DEMO!', C.green);
  p('');
  box(
    'Bạn vừa trải nghiệm đầy đủ RAG Basic Pipeline:\n\n' +
    '  ✅ Chunking: Fixed-size, Sentence, Recursive\n' +
    '  ✅ Embeddings: nomic-embed-text-v1.5 (768D)\n' +
    '  ✅ Vector Store: In-memory với Cosine Similarity\n' +
    '  ✅ Retrieval: Query → Embed → Search → Top-K\n\n' +
    'Bước tiếp theo:\n' +
    '  → Thêm LLM để generate câu trả lời (hoàn thiện RAG)\n' +
    '  → Dùng ChromaDB/Qdrant thay vì in-memory store\n' +
    '  → Thử Re-ranking với cross-encoder model',
    C.green
  );
  p('');

  rl.close();
}

// ============================================================
//  SO SÁNH CHIẾN LƯỢC CHUNKING TRONG RETRIEVAL
// ============================================================
async function demoCompareStrategies() {
  console.clear();
  header('📊 SO SÁNH CHUNKING STRATEGIES TRONG RETRIEVAL', C.magenta);
  p('');

  const query = await ask(`Nhập câu hỏi để so sánh: `);
  if (!query) return;

  p(`\n${C.yellow}⏳ Tạo embedding cho query...${C.reset}`);
  const queryEmbedding = await embed(query);

  const strategies: ChunkingStrategy[] = ['fixed-size', 'sentence', 'recursive'];
  const strategyColors: Record<ChunkingStrategy, string> = {
    'fixed-size': C.blue,
    'sentence':   C.green,
    'recursive':  C.magenta,
  };

  p('');
  sep('─');
  p(`${C.bold}Kết quả Top-1 theo từng strategy cho query: "${query}"${C.reset}`);
  sep('─');
  p('');

  for (const strategy of strategies) {
    const results = search(queryEmbedding, 1, 0.0, strategy);
    const color = strategyColors[strategy];

    p(`${color}${C.bold}[${strategy}]${C.reset}`);

    if (results.length === 0) {
      p(`  ${C.dim}Không có kết quả${C.reset}`);
    } else {
      const { chunk, score } = results[0];
      p(`  Score: ${scoreBar(score, 25)}`);
      p(`  ${C.dim}"${chunk.text.slice(0, 200)}..."${C.reset}`);
    }
    p('');
  }
}

main().catch(err => {
  console.error(`\n${C.red}${C.bold}❌ Lỗi:${C.reset}`, err.message);
  console.error(err);
  rl.close();
  process.exit(1);
});
