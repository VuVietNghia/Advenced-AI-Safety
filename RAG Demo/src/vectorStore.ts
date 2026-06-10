// ============================================================
//  VECTOR STORE - Lưu trữ và tìm kiếm vector bằng Cosine Similarity
//
//  Đây là "trái tim" của hệ thống RAG - nơi lưu trữ toàn bộ
//  kiến thức đã được mã hóa thành vector, và thực hiện tìm kiếm
//  ngữ nghĩa khi có câu hỏi từ người dùng.
//
//  Thay vì dùng thư viện vector DB bên ngoài (ChromaDB, Pinecone...),
//  ta tự implement để hiểu rõ cơ chế hoạt động bên trong.
// ============================================================

import type { VectorEntry, SearchResult, Chunk, ChunkingStrategy } from './types.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const STORE_PATH = './vector_store.json';

// -------------------------------------------------------
//  STATE - In-memory store
// -------------------------------------------------------
let vectorStore: VectorEntry[] = [];

// ============================================================
//  COSINE SIMILARITY - Trái tim của Vector Search
//
//  Công thức: cos(θ) = (A · B) / (|A| × |B|)
//
//  Giải thích hình học:
//  - Mỗi embedding là một điểm trong không gian N chiều (768D)
//  - Cosine similarity đo GÓC giữa hai vector từ gốc tọa độ
//  - Góc nhỏ (gần 0°) → cos ≈ 1 → văn bản rất tương đồng
//  - Góc vuông (90°) → cos = 0 → không liên quan
//  - Góc ngược (180°) → cos = -1 → trái nghĩa nhau
//
//  Tại sao dùng cosine thay vì Euclidean distance?
//  → Cosine không bị ảnh hưởng bởi độ dài văn bản (magnitude),
//    chỉ so sánh "hướng" = ý nghĩa. Câu ngắn và câu dài về
//    cùng một chủ đề sẽ có cosine similarity cao.
// ============================================================

/**
 * Tính dot product (tích vô hướng) của hai vector: A · B = Σ(Ai × Bi)
 */
function dotProduct(vecA: number[], vecB: number[]): number {
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    sum += vecA[i] * vecB[i];
  }
  return sum;
}

/**
 * Tính magnitude (độ dài) của vector: |A| = √(Σ Ai²)
 */
function magnitude(vec: number[]): number {
  let sumSquares = 0;
  for (const val of vec) {
    sumSquares += val * val;
  }
  return Math.sqrt(sumSquares);
}

/**
 * Tính Cosine Similarity giữa hai vector.
 *
 * @returns Số từ -1 đến 1:
 *   1.0  = hoàn toàn giống nhau
 *   0.7+ = rất tương đồng (thường là ngưỡng "relevant")
 *   0.5  = có liên quan một phần
 *   0.0  = không liên quan
 *  -1.0  = hoàn toàn trái ngược
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = dotProduct(vecA, vecB);
  const magA = magnitude(vecA);
  const magB = magnitude(vecB);

  // Tránh chia cho 0
  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}

// ============================================================
//  CRUD OPERATIONS
// ============================================================

/**
 * Thêm một entry (chunk + embedding) vào store.
 */
export function addEntry(chunk: Chunk, embedding: number[]): void {
  vectorStore.push({ chunk, embedding });
}

/**
 * Lấy tổng số entries trong store.
 */
export function getStoreSize(): number {
  return vectorStore.length;
}

/**
 * Xóa toàn bộ store.
 */
export function clearStore(): void {
  vectorStore = [];
}

/**
 * Lấy tất cả entries (để debug/visualization).
 */
export function getAllEntries(): VectorEntry[] {
  return [...vectorStore];
}

// ============================================================
//  VECTOR SEARCH - Tìm kiếm ngữ nghĩa
// ============================================================

/**
 * Tìm kiếm top-K chunks có cosine similarity cao nhất với query vector.
 *
 * Thuật toán (Brute-force / Exact Search):
 * 1. Với mỗi entry trong store, tính cosine similarity với query
 * 2. Sắp xếp theo score giảm dần
 * 3. Lấy top K entries
 *
 * Đây là "exhaustive search" - chính xác 100% nhưng O(N×D).
 * Database thực tế (FAISS, HNSW) dùng Approximate Nearest Neighbor
 * để nhanh hơn trên triệu vectors.
 *
 * @param queryEmbedding - Vector của câu hỏi người dùng
 * @param topK - Số lượng kết quả muốn lấy
 * @param minScore - Ngưỡng tối thiểu của cosine score (mặc định 0.0)
 * @param strategyFilter - Chỉ tìm trong chunks của strategy cụ thể
 */
export function search(
  queryEmbedding: number[],
  topK: number = 3,
  minScore: number = 0.0,
  strategyFilter?: ChunkingStrategy
): SearchResult[] {
  // Lọc theo strategy nếu cần
  const entries = strategyFilter
    ? vectorStore.filter(e => e.chunk.strategy === strategyFilter)
    : vectorStore;

  // Tính cosine similarity cho tất cả entries
  const scored = entries.map(entry => ({
    chunk: entry.chunk,
    score: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  // Lọc theo ngưỡng minScore và sắp xếp giảm dần
  const filtered = scored
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Thêm rank (thứ hạng)
  return filtered.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

// ============================================================
//  PERSISTENCE - Lưu và tải store từ file JSON
//  (Trong production sẽ dùng vector DB thực sự như ChromaDB)
// ============================================================

/**
 * Lưu toàn bộ vector store ra file JSON.
 * Bao gồm cả chunks và embeddings.
 */
export function saveStore(): void {
  writeFileSync(STORE_PATH, JSON.stringify(vectorStore, null, 2), 'utf-8');
}

/**
 * Tải vector store từ file JSON.
 * @returns true nếu tải thành công, false nếu file không tồn tại
 */
export function loadStore(): boolean {
  if (!existsSync(STORE_PATH)) return false;

  try {
    const data = readFileSync(STORE_PATH, 'utf-8');
    vectorStore = JSON.parse(data) as VectorEntry[];
    return true;
  } catch {
    return false;
  }
}

/**
 * Thống kê về store (để hiển thị trong demo)
 */
export function getStoreStats() {
  if (vectorStore.length === 0) {
    return { total: 0, byStrategy: {}, bySources: {} };
  }

  const byStrategy: Record<string, number> = {};
  const bySources: Record<string, number> = {};

  for (const entry of vectorStore) {
    byStrategy[entry.chunk.strategy] = (byStrategy[entry.chunk.strategy] || 0) + 1;
    bySources[entry.chunk.source] = (bySources[entry.chunk.source] || 0) + 1;
  }

  // Lấy độ dài vector (số chiều embedding)
  const vectorDim = vectorStore[0]?.embedding.length ?? 0;

  return {
    total: vectorStore.length,
    vectorDim,
    byStrategy,
    bySources,
  };
}
