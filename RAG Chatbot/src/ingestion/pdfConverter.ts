import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

export async function convertPdfToMarkdown(pdfPath: string, buffer: Buffer): Promise<string> {
  const cacheDir = path.join(process.cwd(), "data", "docs-md");
  
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const filename = path.basename(pdfPath);
  const mdFilename = filename.replace(/\.pdf$/i, ".md");
  const cachePath = path.join(cacheDir, mdFilename);

  // Check cache
  if (fs.existsSync(cachePath)) {
    const pdfStat = fs.statSync(pdfPath);
    const mdStat = fs.statSync(cachePath);
    if (mdStat.mtime > pdfStat.mtime) {
      console.log(`[converter] Using cached Markdown for ${filename}`);
      return fs.readFileSync(cachePath, "utf-8");
    }
  }

  console.log(`[converter] Converting ${filename} to Markdown...`);
  const parser = new PDFParse({ data: buffer });
  const parsed = await parser.getText();
  await parser.destroy();

  const rawText = parsed.text;
  
  // Heuristic Markdown formatting
  const lines = rawText.split("\n");
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Remove empty lines or pure whitespace
    if (!line) {
      // Keep single blank line to separate paragraphs
      if (processedLines.length > 0 && processedLines[processedLines.length - 1] !== "") {
        processedLines.push("");
      }
      continue;
    }
    
    // Heuristic: short UPPERCASE line -> Heading 2
    if (line.length > 3 && line.length < 100 && line === line.toUpperCase() && /[A-Z]/.test(line)) {
      processedLines.push(`\n## ${line}\n`);
      continue;
    }
    
    // Heuristic: line starts with numbering like "1. ", "1.1 " -> List or Heading
    if (/^\d+(\.\d+)*\s+[A-Z]/.test(line)) {
      if (line.length < 120) {
        processedLines.push(`\n### ${line}\n`);
      } else {
        processedLines.push(line); // Normal paragraph starting with number
      }
      continue;
    }
    
    // Heuristic: line starts with bullet points
    if (/^[•\-\*]\s+/.test(line)) {
      processedLines.push(`- ${line.replace(/^[•\-\*]\s+/, "")}`);
      continue;
    }
    
    // Normal line
    processedLines.push(line);
  }
  
  // Join and clean up multiple blank lines
  let markdown = processedLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  
  // Save cache
  fs.writeFileSync(cachePath, markdown, "utf-8");
  console.log(`[converter] Saved Markdown cache to ${cachePath} (${markdown.length} chars)`);
  
  return markdown;
}
