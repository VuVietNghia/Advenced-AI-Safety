import type { ToolDefinition } from "../providers/types.js";

export interface AgentTool {
  definition: ToolDefinition;
  execute(input: Record<string, unknown>): Promise<string>;
}

export class ToolRegistry {
  private readonly tools = new Map<string, AgentTool>();

  register(tool: AgentTool): void {
    if (this.tools.has(tool.definition.name)) {
      throw new Error(`Tool already registered: ${tool.definition.name}`);
    }

    this.tools.set(tool.definition.name, tool);
  }

  getDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.definition);
  }

  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  async execute(toolName: string, input: Record<string, unknown>): Promise<string> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    return tool.execute(input);
  }
}
