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
