// ============================================================
//  CHUNKER - Các chiến lược chia nhỏ văn bản
//
//  Chunking là bước đầu tiên và quan trọng nhất trong RAG pipeline.
//  Chất lượng chunking ảnh hưởng trực tiếp đến độ chính xác của
//  toàn bộ hệ thống tìm kiếm.
//
//  Ba chiến lược được implement:
//  1. Fixed-size: Đơn giản, có overlap
//  2. Sentence:   Theo dấu câu, giữ câu hoàn chỉnh
//  3. Recursive:  Đệ quy theo thứ tự ưu tiên (như LangChain)
// ============================================================

import type { Chunk, ChunkingConfig, ChunkingStrategy } from './types.js';

// -------------------------------------------------------
// Cấu hình mặc định cho từng chiến lược
// -------------------------------------------------------
export const DEFAULT_CONFIGS: Record<ChunkingStrategy, ChunkingConfig> = {
  'fixed-size': {
    strategy: 'fixed-size',
    chunkSize: 400,     // 400 ký tự mỗi chunk
    overlap: 80,        // 80 ký tự gối đầu (20% overlap)
    minChunkSize: 50,
  },
  'sentence': {
    strategy: 'sentence',
    chunkSize: 600,     // Max 600 ký tự, nhưng chia theo câu
    overlap: 0,         // Sentence chunking không cần overlap
    minChunkSize: 30,
  },
  'recursive': {
    strategy: 'recursive',
    chunkSize: 500,     // Target 500 ký tự
    overlap: 50,
    minChunkSize: 40,
  },
};

/**
 * Hàm chính: chia một tài liệu thành các chunks
 */
export function chunkDocument(
  content: string,
  source: string,
  config: ChunkingConfig
): Chunk[] {
  switch (config.strategy) {
    case 'fixed-size':
      return fixedSizeChunk(content, source, config);
    case 'sentence':
      return sentenceChunk(content, source, config);
    case 'recursive':
      return recursiveChunk(content, source, config);
  }
}

// ============================================================
//  CHIẾN LƯỢC 1: FIXED-SIZE CHUNKING
//  Chia văn bản thành các mảnh có kích thước cố định,
//  với overlap để tránh mất ngữ cảnh tại ranh giới.
//
//  Ưu điểm:  Đơn giản, tốc độ nhanh, kích thước đồng đều
//  Nhược điểm: Có thể cắt đứt câu giữa chừng
// ============================================================
function fixedSizeChunk(
  content: string,
  source: string,
  config: ChunkingConfig
): Chunk[] {
  const chunks: Chunk[] = [];
  const { chunkSize, overlap, minChunkSize } = config;

  let start = 0;
  let chunkIndex = 0;

  while (start < content.length) {
    const end = Math.min(start + chunkSize, content.length);
    const text = content.slice(start, end).trim();

    if (text.length >= minChunkSize) {
      chunks.push({
        id: `${source}-fixed-${chunkIndex}`,
        text,
        source,
        chunkIndex,
        strategy: 'fixed-size',
        metadata: {
          charStart: start,
          charEnd: end,
          overlap: chunkIndex === 0 ? 0 : overlap,
        },
      });
      chunkIndex++;
    }

    // Tiếp tục từ (end - overlap) để tạo vùng gối đầu
    start = end - overlap;

    // Tránh vòng lặp vô tận nếu overlap >= chunkSize
    if (start >= end) break;
  }

  return chunks;
}

// ============================================================
//  CHIẾN LƯỢC 2: SENTENCE CHUNKING
//  Chia theo dấu câu, nhóm nhiều câu lại cho đến khi
//  đạt kích thước chunkSize.
//
//  Ưu điểm:  Câu hoàn chỉnh, ngữ nghĩa tốt hơn
//  Nhược điểm: Kích thước chunk không đồng đều
// ============================================================
function sentenceChunk(
  content: string,
  source: string,
  config: ChunkingConfig
): Chunk[] {
  const chunks: Chunk[] = [];
  const { chunkSize, minChunkSize } = config;

  // Tách câu theo dấu câu phổ biến (hỗ trợ cả tiếng Việt)
  // Dùng lookahead để giữ dấu câu trong câu
  const sentences = content
    .split(/(?<=[.!?。？！])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  let currentChunk = '';
  let currentStart = 0;
  let chunkIndex = 0;
  let absolutePos = 0;

  for (const sentence of sentences) {
    const potentialChunk = currentChunk
      ? `${currentChunk} ${sentence}`
      : sentence;

    if (potentialChunk.length > chunkSize && currentChunk.length >= minChunkSize) {
      // Chunk hiện tại đã đủ lớn → lưu lại và bắt đầu chunk mới
      chunks.push({
        id: `${source}-sentence-${chunkIndex}`,
        text: currentChunk.trim(),
        source,
        chunkIndex,
        strategy: 'sentence',
        metadata: {
          charStart: currentStart,
          charEnd: absolutePos,
          overlap: 0,
        },
      });
      chunkIndex++;
      currentStart = absolutePos;
      currentChunk = sentence;
    } else {
      currentChunk = potentialChunk;
    }

    absolutePos += sentence.length + 1; // +1 cho khoảng trắng
  }

  // Đừng quên chunk cuối cùng
  if (currentChunk.trim().length >= minChunkSize) {
    chunks.push({
      id: `${source}-sentence-${chunkIndex}`,
      text: currentChunk.trim(),
      source,
      chunkIndex,
      strategy: 'sentence',
      metadata: {
        charStart: currentStart,
        charEnd: content.length,
        overlap: 0,
      },
    });
  }

  return chunks;
}

// ============================================================
//  CHIẾN LƯỢC 3: RECURSIVE CHUNKING (giống LangChain)
//  Thử chia theo thứ tự ưu tiên giảm dần:
//  đoạn văn (\n\n) → dòng (\n) → câu (. ) → ký tự
//
//  Ưu điểm:  Giữ cấu trúc văn bản tốt nhất có thể
//  Nhược điểm: Phức tạp hơn, cần tinh chỉnh nhiều tham số
// ============================================================
function recursiveChunk(
  content: string,
  source: string,
  config: ChunkingConfig
): Chunk[] {
  const rawTexts = recursiveSplit(content, config.chunkSize, [
    '\n\n',   // Ưu tiên 1: Chia theo đoạn văn
    '\n',     // Ưu tiên 2: Chia theo dòng
    '. ',     // Ưu tiên 3: Chia theo câu
    ' ',      // Ưu tiên 4: Chia theo từ
  ]);

  // Gộp các đoạn quá nhỏ vào đoạn tiếp theo
  const merged = mergeSmallChunks(rawTexts, config.chunkSize, config.overlap);

  return merged
    .filter(text => text.trim().length >= config.minChunkSize)
    .map((text, index) => ({
      id: `${source}-recursive-${index}`,
      text: text.trim(),
      source,
      chunkIndex: index,
      strategy: 'recursive' as ChunkingStrategy,
      metadata: {
        charStart: content.indexOf(text.trim()),
        charEnd: content.indexOf(text.trim()) + text.trim().length,
        overlap: config.overlap,
      },
    }));
}

/**
 * Hàm đệ quy: chia text theo separator có ưu tiên cao nhất,
 * sau đó gọi đệ quy với separator tiếp theo nếu vẫn quá lớn.
 */
function recursiveSplit(
  text: string,
  maxSize: number,
  separators: string[]
): string[] {
  if (text.length <= maxSize) return [text];
  if (separators.length === 0) {
    // Không còn separator nào → buộc phải chia theo ký tự
    const result: string[] = [];
    for (let i = 0; i < text.length; i += maxSize) {
      result.push(text.slice(i, i + maxSize));
    }
    return result;
  }

  const [sep, ...restSeps] = separators;
  const parts = text.split(sep);

  const result: string[] = [];
  for (const part of parts) {
    if (part.length <= maxSize) {
      if (part.trim()) result.push(part);
    } else {
      // Phần này vẫn còn quá lớn → đệ quy với separator tiếp theo
      result.push(...recursiveSplit(part, maxSize, restSeps));
    }
  }
  return result;
}

/**
 * Gộp các chunk nhỏ vào với nhau, có tính overlap giữa các chunk.
 */
function mergeSmallChunks(
  chunks: string[],
  maxSize: number,
  overlap: number
): string[] {
  const merged: string[] = [];
  let current = '';

  for (const chunk of chunks) {
    const combined = current ? `${current}\n${chunk}` : chunk;
    if (combined.length <= maxSize) {
      current = combined;
    } else {
      if (current) merged.push(current);
      // Lấy phần cuối của chunk hiện tại làm overlap
      const overlapText = current.slice(-overlap);
      current = overlapText ? `${overlapText}\n${chunk}` : chunk;
    }
  }

  if (current) merged.push(current);
  return merged;
}

/**
 * Thống kê về một tập chunks (để hiển thị trong demo)
 */
export function getChunkStats(chunks: Chunk[]) {
  const lengths = chunks.map(c => c.text.length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);

  return {
    count: chunks.length,
    avgLength: Math.round(avg),
    minLength: min,
    maxLength: max,
  };
}
