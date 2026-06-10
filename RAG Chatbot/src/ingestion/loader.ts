import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

export interface RawDocument {
  filename: string;
  content: string;
  extension: string;
}

export async function loadDocumentsFromDir(dirPath: string): Promise<RawDocument[]> {
  const files = fs.readdirSync(dirPath);
  const docs: RawDocument[] = [];

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const ext = path.extname(file).toLowerCase();

    if (ext === ".pdf") {
      const buffer = fs.readFileSync(fullPath);
      const parser = new PDFParse({ data: buffer });
      const parsed = await parser.getText();
      docs.push({ filename: file, content: parsed.text, extension: "pdf" });
      await parser.destroy();
    } else if (ext === ".txt" || ext === ".md") {
      const content = fs.readFileSync(fullPath, "utf-8");
      docs.push({ filename: file, content, extension: ext.slice(1) });
    }
    // Silently skip unsupported formats
  }

  return docs;
}
