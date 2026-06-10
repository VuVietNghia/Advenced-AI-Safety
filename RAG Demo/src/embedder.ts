// ============================================================
//  EMBEDDER - Kết nối với LM Studio để tạo vector embeddings
//
//  Đây là cầu nối giữa văn bản và không gian vector số học.
//  Sử dụng model nomic-embed-text-v1.5 chạy local qua LM Studio.
// ============================================================

import OpenAI from 'openai/index.mjs';

// -------------------------------------------------------
// Kết nối LM Studio
// LM Studio implement OpenAI-compatible API tại localhost:1234
// apiKey có thể là bất kỳ string nào (LM Studio không xác thực)
// -------------------------------------------------------
const client = new OpenAI({
  baseURL: 'http://localhost:1234/v1',
  apiKey: 'lm-studio',
});

// Model nomic-embed-text-v1.5 tạo ra vectors 768 chiều
// Hỗ trợ đa ngôn ngữ, rất phù hợp cho tiếng Việt
// LM Studio sử dụng tên model theo định dạng của file GGUF đã load.
// Thường là: 'nomic-ai/nomic-embed-text-v1.5-GGUF' hoặc tên file cụ thể.
// Khi dùng LM Studio, model ID có thể đặt là bất kỳ string nào -
// server sẽ dùng model đang được load.
export const EMBEDDING_MODEL = 'nomic-ai/nomic-embed-text-v1.5-GGUF/nomic-embed-text-v1.5.Q8_0.gguf';
export const EMBEDDING_DIM = 768;

/**
 * Tạo embedding vector cho một đoạn văn bản.
 *
 * Quá trình:
 * 1. Gửi văn bản đến LM Studio API
 * 2. nomic-embed-text xử lý qua các tầng transformer
 * 3. Trả về vector 768 chiều đại diện cho "ý nghĩa" của văn bản
 *
 * @param text - Đoạn văn bản cần embedding
 * @returns Vector số học 768 chiều
 */
export async function embed(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    // LM Studio dùng model đang được load, model ID chỉ là placeholder.
    // Nếu bị lỗi model not found, LM Studio sẽ dùng model đang active.
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

/**
 * Tạo embeddings cho nhiều văn bản cùng lúc (batch processing).
 *
 * Hiệu quả hơn gọi embed() nhiều lần vì giảm số lần gọi API.
 * Tuy nhiên do LM Studio local, ta vẫn xử lý tuần tự để tránh overload.
 *
 * @param texts - Mảng các đoạn văn bản
 * @param onProgress - Callback để hiển thị tiến trình
 * @returns Mảng vectors tương ứng
 */
export async function embedBatch(
  texts: string[],
  onProgress?: (current: number, total: number) => void
): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i++) {
    embeddings.push(await embed(texts[i]));
    onProgress?.(i + 1, texts.length);
  }

  return embeddings;
}

/**
 * Kiểm tra kết nối với LM Studio
 * @returns true nếu kết nối thành công
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await embed('test');
    return true;
  } catch {
    return false;
  }
}
