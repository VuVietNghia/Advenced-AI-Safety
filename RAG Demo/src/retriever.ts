// ============================================================
//  RETRIEVER - Pha 2 của RAG Pipeline: Query & Retrieval
//
//  Quy trình:
//  User Query → Embed Query → Vector Search → Top-K Chunks
//
//  Chạy: npm run query "câu hỏi của bạn"
// ============================================================

import { embed, EMBEDDING_MODEL } from './embedder.js';
import { loadStore, search, getStoreStats } from './vectorStore.js';
import type { ChunkingStrategy, SearchResult } from './types.js';

// ANSI Colors
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
  white: '\x1b[37m',
};

function print(msg: string) { process.stdout.write(msg + '\n'); }
function printSeparator(char = '─', len = 60) {
  print(C.dim + char.repeat(len) + C.reset);
}

/**
 * Hàm retrieval chính - có thể dùng trong các module khác
 */
export async function retrieve(
  query: string,
  topK: number = 3,
  strategy?: ChunkingStrategy,
  minScore: number = 0.0
): Promise<SearchResult[]> {
  const queryEmbedding = await embed(query);
  return search(queryEmbedding, topK, minScore, strategy);
}

/**
 * Hiển thị kết quả retrieval với màu sắc và visual score bars
 */
export function displayResults(
  results: SearchResult[],
  query: string,
  showDetails = true
) {
  print('');
  print(`${C.cyan}${C.bold}🔍 Kết quả tìm kiếm cho: "${query}"${C.reset}`);
  printSeparator();

  if (results.length === 0) {
    print(`${C.yellow}⚠️  Không tìm thấy kết quả phù hợp.${C.reset}`);
    return;
  }

  for (const result of results) {
    const { chunk, score, rank } = result;
    const scorePercent = Math.round(score * 100);

    // Màu dựa theo score
    const scoreColor =
      score >= 0.8 ? C.green :
      score >= 0.6 ? C.cyan :
      score >= 0.4 ? C.yellow : C.red;

    // Visual score bar (20 ký tự)
    const filledBars = Math.round(score * 20);
    const scoreBar = '▓'.repeat(filledBars) + '░'.repeat(20 - filledBars);

    print('');
    print(`${C.bold}${scoreColor}#${rank}${C.reset} ${C.dim}[${chunk.strategy}]${C.reset} ${C.bold}${chunk.source}${C.reset} - Chunk #${chunk.chunkIndex}`);
    print(`   Score: ${scoreColor}${scoreBar}${C.reset} ${scoreColor}${C.bold}${scorePercent}%${C.reset} (cosine = ${score.toFixed(4)})`);

    if (showDetails) {
      // Hiển thị text chunk (rút gọn nếu quá dài)
      const preview = chunk.text.length > 300
        ? chunk.text.slice(0, 300) + '...'
        : chunk.text;
      print(`   ${C.dim}${preview}${C.reset}`);
      print(`   ${C.dim}📏 Độ dài: ${chunk.text.length} ký tự${C.reset}`);
    }

    printSeparator('·');
  }
}

// ============================================================
//  Main: Chạy từ command line
//  npm run query "câu hỏi của bạn"
// ============================================================
async function main() {
  const query = process.argv[2];

  if (!query) {
    print(`\n${C.yellow}${C.bold}Cách dùng:${C.reset}`);
    print(`  ${C.cyan}npm run query "câu hỏi của bạn"${C.reset}`);
    print('');
    print(`${C.dim}Ví dụ:${C.reset}`);
    print(`  ${C.dim}npm run query "RAG là gì?"${C.reset}`);
    print(`  ${C.dim}npm run query "Cosine similarity hoạt động như thế nào?"${C.reset}`);
    print(`  ${C.dim}npm run query "Cách dùng LM Studio?"${C.reset}`);
    process.exit(1);
  }

  // Load vector store
  const loaded = loadStore();
  if (!loaded) {
    print(`\n${C.red}❌ Chưa có Vector Store. Hãy chạy "npm run index" trước!${C.reset}\n`);
    process.exit(1);
  }

  const stats = getStoreStats();
  print(`\n${C.dim}📦 Vector Store: ${stats.total} entries | ${stats.vectorDim}D vectors${C.reset}`);
  print(`${C.dim}🤖 Embedding model: ${EMBEDDING_MODEL}${C.reset}\n`);

  print(`${C.yellow}⏳ Đang tạo embedding cho câu hỏi...${C.reset}`);
  const results = await retrieve(query, 5);

  displayResults(results, query);

  print('');
  print(`${C.dim}💡 Tip: Chạy "npm run demo" để xem interactive demo đầy đủ hơn!${C.reset}\n`);
}

main().catch(err => {
  console.error(`\n${C.red}❌ Lỗi:${C.reset}`, err.message);
  process.exit(1);
});
