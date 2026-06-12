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

export function chunkMarkdown(
  markdown: string,
  sourceFile: string,
  maxChunkSize = 512
): TextChunk[] {
  const chunks: TextChunk[] = [];
  let chunkIndex = 0;
  
  // Split by headings (## or ###)
  const sections = markdown.split(/\n(?=#{2,3}\s)/);
  
  for (let section of sections) {
    section = section.trim();
    if (!section) continue;
    
    // Extract heading as breadcrumb
    let breadcrumb = "";
    const match = section.match(/^(#{2,3}\s[^\n]+)\n/);
    if (match) {
      breadcrumb = `[${match[1].replace(/^#+\s/, "")}]\n`;
    }
    
    if (section.length <= maxChunkSize) {
      chunks.push({ text: section, sourceFile, chunkIndex: chunkIndex++ });
    } else {
      // Split by paragraphs
      const paragraphs = section.split(/\n\n/);
      let currentChunk = breadcrumb;
      
      for (const p of paragraphs) {
        const para = p.trim();
        if (!para) continue;
        
        // Skip the heading line since it's already in breadcrumb
        if (match && para === match[1].trim()) continue;
        
        if (currentChunk.length + para.length > maxChunkSize) {
          if (currentChunk.trim() !== breadcrumb.trim()) {
            chunks.push({ text: currentChunk.trim(), sourceFile, chunkIndex: chunkIndex++ });
          }
          
          // If a single paragraph is too large, fallback to chunkDocument logic for this paragraph
          if (breadcrumb.length + para.length > maxChunkSize) {
            const subChunks = chunkDocument(para, sourceFile, maxChunkSize, 64);
            for (const sc of subChunks) {
              chunks.push({ 
                text: breadcrumb + sc.text, 
                sourceFile, 
                chunkIndex: chunkIndex++ 
              });
            }
            currentChunk = breadcrumb;
          } else {
            currentChunk = breadcrumb + para + "\n\n";
          }
        } else {
          currentChunk += para + "\n\n";
        }
      }
      
      if (currentChunk.trim() !== breadcrumb.trim()) {
        chunks.push({ text: currentChunk.trim(), sourceFile, chunkIndex: chunkIndex++ });
      }
    }
  }
  
  return chunks;
}
