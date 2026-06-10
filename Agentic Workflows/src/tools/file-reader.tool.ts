import { readFile } from "node:fs/promises";
import path from "node:path";
import type { AgentTool } from "./tool-registry.js";

export class FileReaderTool implements AgentTool {
  private readonly dataRoot: string;

  constructor(workspaceRoot: string) {
    this.dataRoot = path.resolve(workspaceRoot, "data");
  }

  definition = {
    name: "file_reader",
    description: "Read a UTF-8 text file from the project data directory. Use this when a task asks to inspect local study material.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Path relative to the data directory, for example: sample.txt"
        }
      },
      required: ["filePath"],
      additionalProperties: false
    }
  };

  async execute(input: Record<string, unknown>): Promise<string> {
    const filePath = String(input.filePath ?? "").trim();
    if (!filePath) {
      throw new Error("file_reader requires filePath.");
    }

    const targetPath = path.resolve(this.dataRoot, filePath);
    if (!targetPath.startsWith(this.dataRoot + path.sep) && targetPath !== this.dataRoot) {
      throw new Error("file_reader can only read files inside the data directory.");
    }

    const content = await readFile(targetPath, "utf8");
    return content.length > 4000 ? `${content.slice(0, 4000)}\n...[truncated]` : content;
  }
}
