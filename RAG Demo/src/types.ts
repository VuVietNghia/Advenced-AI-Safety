// ============================================================
//  TYPES - Shared interfaces for the entire RAG pipeline
// ============================================================

/**
 * Một chunk (mảnh) văn bản sau khi đã chia tài liệu gốc
 */
export interface Chunk {
  id: string;           // ID duy nhất
  text: string;         // Nội dung văn bản
  source: string;       // Tên tài liệu gốc
  chunkIndex: number;   // Số thứ tự chunk trong tài liệu
  strategy: ChunkingStrategy; // Chiến lược chunking đã dùng
  metadata: {
    charStart: number;  // Vị trí ký tự bắt đầu trong văn bản gốc
    charEnd: number;    // Vị trí ký tự kết thúc
    overlap: number;    // Số ký tự gối đầu với chunk trước
  };
}

/**
 * Một vector entry trong Vector Store
 * = Chunk + embedding vector
 */
export interface VectorEntry {
  chunk: Chunk;
  embedding: number[];   // Vector số chiều cao (768d với nomic-embed-text)
}

/**
 * Kết quả tìm kiếm vector
 */
export interface SearchResult {
  chunk: Chunk;
  score: number;         // Cosine similarity score (0.0 → 1.0)
  rank: number;          // Thứ hạng trong kết quả tìm kiếm
}

/**
 * Các chiến lược chia nhỏ văn bản
 */
export type ChunkingStrategy = 'fixed-size' | 'sentence' | 'recursive';

/**
 * Cấu hình cho từng chiến lược chunking
 */
export interface ChunkingConfig {
  strategy: ChunkingStrategy;
  chunkSize: number;      // Kích thước tối đa mỗi chunk (ký tự)
  overlap: number;        // Số ký tự gối đầu (chỉ dùng cho fixed-size)
  minChunkSize: number;   // Kích thước tối thiểu để giữ lại một chunk
}

/**
 * Tài liệu gốc đầu vào
 */
export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
}
